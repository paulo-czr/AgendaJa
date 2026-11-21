import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	and,
	eq,
	gt,
	inArray,
	isNull,
	type InferSelectModel,
} from 'drizzle-orm';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt = require('bcrypt');
import {
	BANCO_DADOS,
	type BancoDados,
} from '../../database/banco-dados.module';
import { tokensAutenticacao } from '../../database/schemas/autenticacao.schema';
import { usuarios } from '../../database/schemas/usuarios.schema';
import { EmailServico } from '../../common/servicos/email.service';
import type {
	PapelUsuario,
	UsuarioAutenticado,
} from '../../common/tipos/usuario-autenticado.interface';
import type { CadastrarDto } from './dtos/cadastrar.dto';
import type { EntrarDto } from './dtos/entrar.dto';
import type { RedefinirSenhaDto } from './dtos/recuperar-senha.dto';

type Usuario = InferSelectModel<typeof usuarios>;
type ExecutorBanco = Pick<BancoDados, 'insert'>;

export interface UsuarioPublico {
	id: number;
	nome: string;
	email: string;
	telefone: string;
	role: PapelUsuario;
}

interface SessaoAutenticacao {
	tokenAcesso: string;
	tokenAtualizacao: string;
	usuario: UsuarioPublico;
}

interface CargaJwt {
	sub?: string;
	tipo?: string;
	jti?: string;
}

const DURACAO_REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AutenticacaoServico {
	constructor(
		@Inject(BANCO_DADOS) private readonly banco: BancoDados,
		private readonly jwt: JwtService,
		private readonly configuracao: ConfigService,
		private readonly email: EmailServico,
	) { }

	async cadastrar(dados: CadastrarDto): Promise<{ mensagem: string }> {
		const [existente] = await this.banco
			.select({ id: usuarios.id })
			.from(usuarios)
			.where(eq(usuarios.email, dados.email))
			.limit(1);

		if (existente) {
			throw new ConflictException('Já existe uma conta com este e-mail.');
		}

		const senhaHash = await bcrypt.hash(dados.senha, 12);
		const token = this.gerarToken();
		const agora = new Date();
		const expiraEm = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
		let usuario: Usuario;

		try {
			usuario = await this.banco.transaction(async (transacao) => {
				const [novoUsuario] = await transacao
					.insert(usuarios)
					.values({
						nome: dados.nome,
						email: dados.email,
						senhaHash,
						telefone: dados.telefone,
						role: dados.role,
					})
					.returning();

				await transacao.insert(tokensAutenticacao).values({
					idUsuario: novoUsuario.id,
					tokenHash: this.hashToken(token),
					tipo: 'verificacao_email',
					expiraEm,
				});

				return novoUsuario;
			});
		} catch (erro) {
			if (this.ehEmailDuplicado(erro)) {
				throw new ConflictException('Já existe uma conta com este e-mail.');
			}

			throw erro;
		}

		await this.email.enviarVerificacao(
			usuario.email,
			usuario.nome,
			this.criarLink('verificar-email', token),
		);

		return { mensagem: 'Conta criada. Verifique seu e-mail para entrar.' };
	}

	async verificarEmail(token: string): Promise<{ mensagem: string }> {
		const hash = this.hashToken(token);
		const agora = new Date();

		await this.banco.transaction(async (transacao) => {
			const [registro] = await transacao
				.select({ id: tokensAutenticacao.id, idUsuario: tokensAutenticacao.idUsuario })
				.from(tokensAutenticacao)
				.where(
					and(
						eq(tokensAutenticacao.tokenHash, hash),
						eq(tokensAutenticacao.tipo, 'verificacao_email'),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.limit(1);

			if (!registro) {
				throw new BadRequestException('Link de verificação inválido ou expirado.');
			}

			const [consumido] = await transacao
				.update(tokensAutenticacao)
				.set({ usadoEm: agora })
				.where(
					and(
						eq(tokensAutenticacao.id, registro.id),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.returning({ id: tokensAutenticacao.id });

			if (!consumido) {
				throw new BadRequestException('Link de verificação inválido ou expirado.');
			}

			await transacao
				.update(usuarios)
				.set({ emailVerificado: true, atualizadoEm: agora })
				.where(eq(usuarios.id, registro.idUsuario));
		});

		return { mensagem: 'E-mail verificado. Você já pode entrar.' };
	}

	async reenviarVerificacao(email: string): Promise<{ mensagem: string }> {
		const [usuario] = await this.banco
			.select()
			.from(usuarios)
			.where(eq(usuarios.email, email))
			.limit(1);

		if (usuario && !usuario.emailVerificado) {
			const token = this.gerarToken();
			const agora = new Date();

			await this.banco.transaction(async (transacao) => {
				await transacao
					.update(tokensAutenticacao)
					.set({ usadoEm: agora })
					.where(
						and(
							eq(tokensAutenticacao.idUsuario, usuario.id),
							eq(tokensAutenticacao.tipo, 'verificacao_email'),
							isNull(tokensAutenticacao.usadoEm),
						),
					);

				await transacao.insert(tokensAutenticacao).values({
					idUsuario: usuario.id,
					tokenHash: this.hashToken(token),
					tipo: 'verificacao_email',
					expiraEm: new Date(agora.getTime() + 24 * 60 * 60 * 1000),
				});
			});

			await this.email.enviarVerificacao(
				usuario.email,
				usuario.nome,
				this.criarLink('verificar-email', token),
			);
		}

		return {
			mensagem: 'Se houver uma conta pendente para este e-mail, enviaremos um novo link.',
		};
	}

	async entrar(dados: EntrarDto): Promise<SessaoAutenticacao> {
		const [usuario] = await this.banco
			.select()
			.from(usuarios)
			.where(eq(usuarios.email, dados.email))
			.limit(1);

		if (!usuario || !(await bcrypt.compare(dados.senha, usuario.senhaHash))) {
			throw new UnauthorizedException('E-mail ou senha inválidos.');
		}

		if (!usuario.emailVerificado) {
			throw new ForbiddenException('Verifique seu e-mail antes de entrar.');
		}

		return this.criarSessao(usuario);
	}

	async renovar(tokenAtualizacao?: string): Promise<SessaoAutenticacao> {
		if (!tokenAtualizacao) {
			throw new UnauthorizedException('Sessão de atualização ausente.');
		}

		const carga = await this.verificarJwt(
			tokenAtualizacao,
			this.configuracao.getOrThrow<string>('JWT_REFRESH_SEGREDO'),
		);
		const idUsuario = Number(carga.sub);

		if (
			carga.tipo !== 'refresh' ||
			!carga.jti ||
			!Number.isSafeInteger(idUsuario) ||
			idUsuario <= 0
		) {
			throw new UnauthorizedException('Sessão de atualização inválida.');
		}

		const hash = this.hashToken(tokenAtualizacao);
		const agora = new Date();

		return this.banco.transaction(async (transacao) => {
			const [registro] = await transacao
				.select({ id: tokensAutenticacao.id })
				.from(tokensAutenticacao)
				.where(
					and(
						eq(tokensAutenticacao.idUsuario, idUsuario),
						eq(tokensAutenticacao.tokenHash, hash),
						eq(tokensAutenticacao.tipo, 'refresh_token'),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.limit(1);

			if (!registro) {
				throw new UnauthorizedException('Sessão de atualização inválida ou expirada.');
			}

			const [consumido] = await transacao
				.update(tokensAutenticacao)
				.set({ usadoEm: agora })
				.where(
					and(
						eq(tokensAutenticacao.id, registro.id),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.returning({ id: tokensAutenticacao.id });

			if (!consumido) {
				throw new UnauthorizedException('Sessão de atualização já utilizada.');
			}

			const [usuario] = await transacao
				.select()
				.from(usuarios)
				.where(eq(usuarios.id, idUsuario))
				.limit(1);

			if (!usuario || !usuario.emailVerificado) {
				throw new UnauthorizedException('Conta indisponível para renovação.');
			}

			return this.criarSessao(usuario, transacao);
		});
	}

	async sair(tokenAtualizacao?: string): Promise<void> {
		if (!tokenAtualizacao) {
			return;
		}

		await this.banco
			.update(tokensAutenticacao)
			.set({ usadoEm: new Date() })
			.where(
				and(
					eq(tokensAutenticacao.tokenHash, this.hashToken(tokenAtualizacao)),
					eq(tokensAutenticacao.tipo, 'refresh_token'),
					isNull(tokensAutenticacao.usadoEm),
				),
			);
	}

	async solicitarRecuperacaoSenha(email: string): Promise<{ mensagem: string }> {
		const [usuario] = await this.banco
			.select()
			.from(usuarios)
			.where(eq(usuarios.email, email))
			.limit(1);

		if (usuario) {
			const token = this.gerarToken();
			const agora = new Date();

			await this.banco.transaction(async (transacao) => {
				await transacao
					.update(tokensAutenticacao)
					.set({ usadoEm: agora })
					.where(
						and(
							eq(tokensAutenticacao.idUsuario, usuario.id),
							eq(tokensAutenticacao.tipo, 'recuperacao_senha'),
							isNull(tokensAutenticacao.usadoEm),
						),
					);

				await transacao.insert(tokensAutenticacao).values({
					idUsuario: usuario.id,
					tokenHash: this.hashToken(token),
					tipo: 'recuperacao_senha',
					expiraEm: new Date(agora.getTime() + 60 * 60 * 1000),
				});
			});

			await this.email.enviarRecuperacao(
				usuario.email,
				usuario.nome,
				this.criarLink('recuperar-senha', token),
			);
		}

		return {
			mensagem: 'Se houver uma conta para este e-mail, enviaremos instruções de recuperação.',
		};
	}

	async redefinirSenha(
		dados: RedefinirSenhaDto,
	): Promise<{ mensagem: string }> {
		const hash = this.hashToken(dados.token);
		const agora = new Date();

		await this.banco.transaction(async (transacao) => {
			const [registro] = await transacao
				.select({
					id: tokensAutenticacao.id,
					idUsuario: tokensAutenticacao.idUsuario,
					expiraEm: tokensAutenticacao.expiraEm,
				})
				.from(tokensAutenticacao)
				.where(
					and(
						eq(tokensAutenticacao.tokenHash, hash),
						eq(tokensAutenticacao.tipo, 'recuperacao_senha'),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.limit(1);

			if (!registro || registro.expiraEm <= agora) {
				throw new BadRequestException('Link de recuperação inválido ou expirado.');
			}

			const senhaHash = await bcrypt.hash(dados.senha, 12);
			const [consumido] = await transacao
				.update(tokensAutenticacao)
				.set({ usadoEm: agora })
				.where(
					and(
						eq(tokensAutenticacao.id, registro.id),
						isNull(tokensAutenticacao.usadoEm),
						gt(tokensAutenticacao.expiraEm, agora),
					),
				)
				.returning({ id: tokensAutenticacao.id });

			if (!consumido) {
				throw new BadRequestException('Link de recuperação inválido ou expirado.');
			}

			await transacao
				.update(usuarios)
				.set({ senhaHash, atualizadoEm: agora })
				.where(eq(usuarios.id, registro.idUsuario));

			await transacao
				.update(tokensAutenticacao)
				.set({ usadoEm: agora })
				.where(
					and(
						eq(tokensAutenticacao.idUsuario, registro.idUsuario),
						inArray(tokensAutenticacao.tipo, [
							'recuperacao_senha',
							'refresh_token',
						]),
						isNull(tokensAutenticacao.usadoEm),
					),
				);
		});

		return { mensagem: 'Senha redefinida com sucesso. Entre novamente.' };
	}

	async buscarUsuarioAtual(
		usuarioAutenticado: UsuarioAutenticado,
	): Promise<UsuarioPublico> {
		const [usuario] = await this.banco
			.select()
			.from(usuarios)
			.where(eq(usuarios.id, usuarioAutenticado.id))
			.limit(1);

		if (!usuario) {
			throw new UnauthorizedException('Conta não encontrada.');
		}

		return this.usuarioPublico(usuario);
	}

	private async criarSessao(
		usuario: Usuario,
		banco: ExecutorBanco = this.banco,
	): Promise<SessaoAutenticacao> {
		const idUsuario = String(usuario.id);
		const tokenAtualizacao = await this.jwt.signAsync(
			{ tipo: 'refresh', papel: usuario.role },
			{
				secret: this.configuracao.getOrThrow<string>('JWT_REFRESH_SEGREDO'),
				expiresIn: '7d',
				subject: idUsuario,
				jwtid: randomUUID(),
			},
		);
		const tokenAcesso = await this.jwt.signAsync(
			{ tipo: 'acesso', papel: usuario.role },
			{ expiresIn: '15m', subject: idUsuario },
		);

		await banco.insert(tokensAutenticacao).values({
			idUsuario: usuario.id,
			tokenHash: this.hashToken(tokenAtualizacao),
			tipo: 'refresh_token',
			expiraEm: new Date(Date.now() + DURACAO_REFRESH_MS),
		});

		return {
			tokenAcesso,
			tokenAtualizacao,
			usuario: this.usuarioPublico(usuario),
		};
	}

	private async verificarJwt(token: string, segredo: string): Promise<CargaJwt> {
		try {
			return await this.jwt.verifyAsync<CargaJwt>(token, { secret: segredo });
		} catch (erro) {
			if (this.ehErroToken(erro)) {
				throw new UnauthorizedException('Sessão de atualização inválida ou expirada.');
			}

			throw erro;
		}
	}

	private usuarioPublico(usuario: Usuario): UsuarioPublico {
		return {
			id: usuario.id,
			nome: usuario.nome,
			email: usuario.email,
			telefone: usuario.telefone,
			role: usuario.role,
		};
	}

	private gerarToken(): string {
		return randomBytes(32).toString('hex');
	}

	private hashToken(token: string): string {
		return createHash('sha256').update(token).digest('hex');
	}

	private criarLink(caminho: string, token: string): string {
		const base = this.configuracao
			.getOrThrow<string>('URL_APLICATIVO')
			.replace(/\/+$/, '');
		const link = new URL(caminho, `${base}/`);
		link.searchParams.set('token', token);

		return link.toString();
	}

	private ehErroToken(erro: unknown): boolean {
		return (
			erro instanceof Error &&
			['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(
				erro.name,
			)
		);
	}

	private ehEmailDuplicado(erro: unknown): boolean {
		return (
			typeof erro === 'object' &&
			erro !== null &&
			'code' in erro &&
			erro.code === '23505'
		);
	}
}
