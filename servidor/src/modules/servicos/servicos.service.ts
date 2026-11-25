import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, ne, sql } from 'drizzle-orm';
import {
	BANCO_DADOS,
	type BancoDados,
} from '../../database/banco-dados.module';
import { categoriasServicos } from '../../database/schemas/categorias-servicos.schema';
import { configuracoesAgenda } from '../../database/schemas/configuracoes-agenda.schema';
import { organizacoes } from '../../database/schemas/organizacoes.schema';
import { servicos, type Servico } from '../../database/schemas/servicos.schema';
import { OrganizacoesServico } from '../organizacoes/organizacoes.service';
import type { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import type { AtualizarServicoDto } from './dtos/atualizar-servico.dto';
import type { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import type { CriarServicoDto } from './dtos/criar-servico.dto';

export interface CategoriaResumo {
	id: number;
	nome: string;
}

export interface CategoriaPublica {
	id: number;
	nome: string;
	criadoEm: Date;
}

export interface ServicoPublico {
	id: number;
	idOrganizacao: number;
	idCategoria: number | null;
	categoria: CategoriaResumo | null;
	nomeServico: string;
	descricaoServico: string | null;
	precoCentavos: number;
	duracaoMinutos: number;
	ativo: boolean;
	criadoEm: Date;
	atualizadoEm: Date;
	desativadoEm: Date | null;
}

export interface HorarioVitrine {
	diaSemana: number;
	ativo: boolean;
	horarioAbertura: string;
	horarioFechamento: string;
	inicioPausa: string | null;
	fimPausa: string | null;
}

export interface ServicoVitrine {
	id: number;
	nomeServico: string;
	descricaoServico: string | null;
	categoria: CategoriaResumo | null;
	precoCentavos: number;
	duracaoMinutos: number;
}

export interface VitrinePublica {
	organizacao: {
		id: number;
		nomeFantasia: string;
		telefone: string | null;
		endereco: string | null;
		horarios: HorarioVitrine[];
	};
	servicos: ServicoVitrine[];
}

@Injectable()
export class ServicosServico {
	constructor(
		@Inject(BANCO_DADOS) private readonly banco: BancoDados,
		private readonly organizacoes: OrganizacoesServico,
	) {}

	async criarCategoria(
		idUsuario: number,
		dados: CriarCategoriaDto,
	): Promise<CategoriaPublica> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		await this.garantirNomeCategoriaDisponivel(organizacao.id, dados.nome);

		try {
			const [criada] = await this.banco
				.insert(categoriasServicos)
				.values({
					idOrganizacao: organizacao.id,
					nome: dados.nome,
				})
				.returning({
					id: categoriasServicos.id,
					nome: categoriasServicos.nome,
					criadoEm: categoriasServicos.criadoEm,
				});

			return criada;
		} catch (erro) {
			if (this.ehViolacaoUnica(erro)) {
				throw new ConflictException('Já existe uma categoria com este nome.');
			}
			throw erro;
		}
	}

	async listarCategorias(idUsuario: number): Promise<CategoriaPublica[]> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		return this.banco
			.select({
				id: categoriasServicos.id,
				nome: categoriasServicos.nome,
				criadoEm: categoriasServicos.criadoEm,
			})
			.from(categoriasServicos)
			.where(eq(categoriasServicos.idOrganizacao, organizacao.id))
			.orderBy(asc(categoriasServicos.nome));
	}

	async atualizarCategoria(
		idUsuario: number,
		idCategoria: number,
		dados: AtualizarCategoriaDto,
	): Promise<CategoriaPublica> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		await this.garantirPosseCategoria(organizacao.id, idCategoria);
		await this.garantirNomeCategoriaDisponivel(
			organizacao.id,
			dados.nome,
			idCategoria,
		);

		try {
			const [atualizada] = await this.banco
				.update(categoriasServicos)
				.set({ nome: dados.nome })
				.where(
					and(
						eq(categoriasServicos.id, idCategoria),
						eq(categoriasServicos.idOrganizacao, organizacao.id),
					),
				)
				.returning({
					id: categoriasServicos.id,
					nome: categoriasServicos.nome,
					criadoEm: categoriasServicos.criadoEm,
				});

			if (!atualizada) {
				throw new NotFoundException('Categoria não encontrada.');
			}

			return atualizada;
		} catch (erro) {
			if (this.ehViolacaoUnica(erro)) {
				throw new ConflictException('Já existe uma categoria com este nome.');
			}
			throw erro;
		}
	}

	async removerCategoria(
		idUsuario: number,
		idCategoria: number,
	): Promise<{ mensagem: string }> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		const removidas = await this.banco
			.delete(categoriasServicos)
			.where(
				and(
					eq(categoriasServicos.id, idCategoria),
					eq(categoriasServicos.idOrganizacao, organizacao.id),
				),
			)
			.returning({ id: categoriasServicos.id });

		if (removidas.length === 0) {
			throw new NotFoundException('Categoria não encontrada.');
		}

		return { mensagem: 'Categoria removida com sucesso.' };
	}

	async criar(
		idUsuario: number,
		dados: CriarServicoDto,
	): Promise<ServicoPublico> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		const categoria =
			dados.idCategoria != null
				? await this.garantirPosseCategoria(organizacao.id, dados.idCategoria)
				: null;

		const [criado] = await this.banco
			.insert(servicos)
			.values({
				idOrganizacao: organizacao.id,
				idCategoria: dados.idCategoria ?? null,
				nomeServico: dados.nomeServico,
				descricaoServico: dados.descricaoServico ?? null,
				precoCentavos: dados.precoCentavos,
				duracaoMinutos: dados.duracaoMinutos,
				ativo: dados.ativo,
				desativadoEm: dados.ativo ? null : new Date(),
			})
			.returning();

		return this.paraPublico(criado, categoria);
	}

	async listarMeus(idUsuario: number): Promise<ServicoPublico[]> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		const linhas = await this.banco
			.select({
				servico: servicos,
				categoriaId: categoriasServicos.id,
				categoriaNome: categoriasServicos.nome,
			})
			.from(servicos)
			.leftJoin(
				categoriasServicos,
				eq(servicos.idCategoria, categoriasServicos.id),
			)
			.where(eq(servicos.idOrganizacao, organizacao.id))
			.orderBy(
				desc(servicos.ativo),
				asc(categoriasServicos.nome),
				asc(servicos.nomeServico),
			);

		return linhas.map(({ servico, categoriaId, categoriaNome }) =>
			this.paraPublico(
				servico,
				categoriaId !== null && categoriaNome !== null
					? { id: categoriaId, nome: categoriaNome }
					: null,
			),
		);
	}

	async atualizar(
		idUsuario: number,
		idServico: number,
		dados: AtualizarServicoDto,
	): Promise<ServicoPublico> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		if (dados.idCategoria !== undefined && dados.idCategoria !== null) {
			await this.garantirPosseCategoria(organizacao.id, dados.idCategoria);
		}

		const agora = new Date();
		const alteracoes: Partial<typeof servicos.$inferInsert> = {
			...dados,
			atualizadoEm: agora,
		};

		if (dados.ativo !== undefined) {
			alteracoes.desativadoEm = dados.ativo ? null : agora;
		}

		const [atualizado] = await this.banco
			.update(servicos)
			.set(alteracoes)
			.where(
				and(
					eq(servicos.id, idServico),
					eq(servicos.idOrganizacao, organizacao.id),
				),
			)
			.returning();

		if (!atualizado) {
			throw new NotFoundException('Serviço não encontrado.');
		}

		const categoria =
			atualizado.idCategoria !== null
				? await this.garantirPosseCategoria(
						organizacao.id,
						atualizado.idCategoria,
					)
				: null;

		return this.paraPublico(atualizado, categoria);
	}

	/**
	 * Exclusão lógica (RF04): desativa o serviço sem remover do banco para
	 * preservar agendamentos e relatórios históricos.
	 */
	async desativar(
		idUsuario: number,
		idServico: number,
	): Promise<{ mensagem: string }> {
		const organizacao = await this.organizacoes.buscarPorUsuario(idUsuario);
		const agora = new Date();

		const [desativado] = await this.banco
			.update(servicos)
			.set({
				ativo: false,
				desativadoEm: agora,
				atualizadoEm: agora,
			})
			.where(
				and(
					eq(servicos.id, idServico),
					eq(servicos.idOrganizacao, organizacao.id),
				),
			)
			.returning({ id: servicos.id });

		if (!desativado) {
			throw new NotFoundException('Serviço não encontrado.');
		}

		return { mensagem: 'Serviço desativado com sucesso.' };
	}

	async buscarVitrinePublica(idOrganizacao: number): Promise<VitrinePublica> {
		const [organizacao] = await this.banco
			.select({
				id: organizacoes.id,
				nomeFantasia: organizacoes.nomeFantasia,
				telefone: organizacoes.telefone,
				endereco: organizacoes.endereco,
			})
			.from(organizacoes)
			.where(eq(organizacoes.id, idOrganizacao))
			.limit(1);

		if (!organizacao) {
			throw new NotFoundException('Organização não encontrada.');
		}

		const [horarios, linhasServicos] = await Promise.all([
			this.banco
				.select({
					diaSemana: configuracoesAgenda.diaSemana,
					ativo: configuracoesAgenda.ativo,
					horarioAbertura: configuracoesAgenda.horarioAbertura,
					horarioFechamento: configuracoesAgenda.horarioFechamento,
					inicioPausa: configuracoesAgenda.inicioPausa,
					fimPausa: configuracoesAgenda.fimPausa,
				})
				.from(configuracoesAgenda)
				.where(eq(configuracoesAgenda.idOrganizacao, idOrganizacao))
				.orderBy(asc(configuracoesAgenda.diaSemana)),
			this.banco
				.select({
					id: servicos.id,
					nomeServico: servicos.nomeServico,
					descricaoServico: servicos.descricaoServico,
					precoCentavos: servicos.precoCentavos,
					duracaoMinutos: servicos.duracaoMinutos,
					categoriaId: categoriasServicos.id,
					categoriaNome: categoriasServicos.nome,
				})
				.from(servicos)
				.leftJoin(
					categoriasServicos,
					eq(servicos.idCategoria, categoriasServicos.id),
				)
				.where(
					and(
						eq(servicos.idOrganizacao, idOrganizacao),
						eq(servicos.ativo, true),
					),
				)
				.orderBy(asc(categoriasServicos.nome), asc(servicos.nomeServico)),
		]);

		const servicosAtivos: ServicoVitrine[] = linhasServicos.map((linha) => ({
			id: linha.id,
			nomeServico: linha.nomeServico,
			descricaoServico: linha.descricaoServico,
			categoria:
				linha.categoriaId !== null && linha.categoriaNome !== null
					? { id: linha.categoriaId, nome: linha.categoriaNome }
					: null,
			precoCentavos: linha.precoCentavos,
			duracaoMinutos: linha.duracaoMinutos,
		}));

		return {
			organizacao: {
				...organizacao,
				horarios,
			},
			servicos: servicosAtivos,
		};
	}

	private async garantirNomeCategoriaDisponivel(
		idOrganizacao: number,
		nome: string,
		ignorarId?: number,
	): Promise<void> {
		const condicoes = [
			eq(categoriasServicos.idOrganizacao, idOrganizacao),
			sql`lower(${categoriasServicos.nome}) = ${nome.toLowerCase()}`,
		];

		if (ignorarId !== undefined) {
			condicoes.push(ne(categoriasServicos.id, ignorarId));
		}

		const [existente] = await this.banco
			.select({ id: categoriasServicos.id })
			.from(categoriasServicos)
			.where(and(...condicoes))
			.limit(1);

		if (existente) {
			throw new ConflictException('Já existe uma categoria com este nome.');
		}
	}

	private async garantirPosseCategoria(
		idOrganizacao: number,
		idCategoria: number,
	): Promise<CategoriaResumo> {
		const [categoria] = await this.banco
			.select({
				id: categoriasServicos.id,
				nome: categoriasServicos.nome,
			})
			.from(categoriasServicos)
			.where(
				and(
					eq(categoriasServicos.id, idCategoria),
					eq(categoriasServicos.idOrganizacao, idOrganizacao),
				),
			)
			.limit(1);

		if (!categoria) {
			throw new NotFoundException('Categoria não encontrada para esta empresa.');
		}

		return categoria;
	}

	private paraPublico(
		servico: Servico,
		categoria: CategoriaResumo | null,
	): ServicoPublico {
		return {
			id: servico.id,
			idOrganizacao: servico.idOrganizacao,
			idCategoria: servico.idCategoria,
			categoria,
			nomeServico: servico.nomeServico,
			descricaoServico: servico.descricaoServico,
			precoCentavos: servico.precoCentavos,
			duracaoMinutos: servico.duracaoMinutos,
			ativo: servico.ativo,
			criadoEm: servico.criadoEm,
			atualizadoEm: servico.atualizadoEm,
			desativadoEm: servico.desativadoEm,
		};
	}

	private ehViolacaoUnica(erro: unknown): boolean {
		return (
			typeof erro === 'object' &&
			erro !== null &&
			'code' in erro &&
			erro.code === '23505'
		);
	}
}
