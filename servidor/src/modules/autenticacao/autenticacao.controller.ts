import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodSerializerDto } from 'nestjs-zod';
import type { Request, Response } from 'express';
import { GuardaAutenticacao } from '../../common/guardas/guarda-autenticacao.guard';
import { UsuarioAtual } from '../../common/decoradores/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/tipos/usuario-autenticado.interface';
import {
	AutenticacaoServico,
	type UsuarioPublico,
} from './autenticacao.service';
import { CadastrarDto } from './dtos/cadastrar.dto';
import { EntrarDto } from './dtos/entrar.dto';
import {
	ReenviarVerificacaoDto,
	VerificarEmailDto,
} from './dtos/verificar-email.dto';
import {
	RedefinirSenhaDto,
	SolicitarRecuperacaoSenhaDto,
} from './dtos/recuperar-senha.dto';
import {
	RespostaMensagemDto,
	RespostaSessaoDto,
	UsuarioPublicoDto,
} from './dtos/respostas.dto';

const COOKIE_ACESSO = 'token_acesso';
const COOKIE_ATUALIZACAO = 'token_atualizacao';
const DURACAO_ACESSO_MS = 15 * 60 * 1000;
const DURACAO_ATUALIZACAO_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('autenticacao')
export class AutenticacaoControlador {
	constructor(
		private readonly autenticacao: AutenticacaoServico,
		private readonly configuracao: ConfigService,
	) {}

	@Post('cadastrar')
	@ZodSerializerDto(RespostaMensagemDto)
	cadastrar(@Body() dados: CadastrarDto) {
		return this.autenticacao.cadastrar(dados);
	}

	@Post('verificar-email')
	@ZodSerializerDto(RespostaMensagemDto)
	verificarEmail(@Body() dados: VerificarEmailDto) {
		return this.autenticacao.verificarEmail(dados.token);
	}

	@Post('reenviar-verificacao')
	@ZodSerializerDto(RespostaMensagemDto)
	reenviarVerificacao(@Body() dados: ReenviarVerificacaoDto) {
		return this.autenticacao.reenviarVerificacao(dados.email);
	}

	@Post('entrar')
	@ZodSerializerDto(RespostaSessaoDto)
	async entrar(
		@Body() dados: EntrarDto,
		@Res({ passthrough: true }) resposta: Response,
	): Promise<{ usuario: UsuarioPublico }> {
		const sessao = await this.autenticacao.entrar(dados);
		this.gravarCookies(resposta, sessao.tokenAcesso, sessao.tokenAtualizacao);

		return { usuario: sessao.usuario };
	}

	@Post('renovar')
	@ZodSerializerDto(RespostaSessaoDto)
	async renovar(
		@Req() requisicao: Request,
		@Res({ passthrough: true }) resposta: Response,
	): Promise<{ usuario: UsuarioPublico }> {
		const sessao = await this.autenticacao.renovar(
			requisicao.cookies?.[COOKIE_ATUALIZACAO],
		);
		this.gravarCookies(resposta, sessao.tokenAcesso, sessao.tokenAtualizacao);

		return { usuario: sessao.usuario };
	}

	@Post('sair')
	@ZodSerializerDto(RespostaMensagemDto)
	async sair(
		@Req() requisicao: Request,
		@Res({ passthrough: true }) resposta: Response,
	): Promise<{ mensagem: string }> {
		await this.autenticacao.sair(requisicao.cookies?.[COOKIE_ATUALIZACAO]);
		const opcoes = this.opcoesCookie();
		resposta.clearCookie(COOKIE_ACESSO, { ...opcoes, path: '/' });
		resposta.clearCookie(COOKIE_ATUALIZACAO, {
			...opcoes,
			path: '/autenticacao',
		});

		return { mensagem: 'Sessão encerrada.' };
	}

	@Post('esqueci-senha')
	@ZodSerializerDto(RespostaMensagemDto)
	esqueciSenha(@Body() dados: SolicitarRecuperacaoSenhaDto) {
		return this.autenticacao.solicitarRecuperacaoSenha(dados.email);
	}

	@Post('redefinir-senha')
	@ZodSerializerDto(RespostaMensagemDto)
	redefinirSenha(@Body() dados: RedefinirSenhaDto) {
		return this.autenticacao.redefinirSenha(dados);
	}

	@Get('eu')
	@UseGuards(GuardaAutenticacao)
	@ZodSerializerDto(UsuarioPublicoDto)
	eu(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.autenticacao.buscarUsuarioAtual(usuario);
	}

	private gravarCookies(
		resposta: Response,
		tokenAcesso: string,
		tokenAtualizacao: string,
	): void {
		const opcoes = this.opcoesCookie();
		resposta.cookie(COOKIE_ACESSO, tokenAcesso, {
			...opcoes,
			path: '/',
			maxAge: DURACAO_ACESSO_MS,
		});
		resposta.cookie(COOKIE_ATUALIZACAO, tokenAtualizacao, {
			...opcoes,
			path: '/autenticacao',
			maxAge: DURACAO_ATUALIZACAO_MS,
		});
	}

	private opcoesCookie() {
		return {
			httpOnly: true,
			secure: this.configuracao.get<string>('NODE_ENV') === 'production',
			sameSite: 'lax' as const,
		};
	}
}
