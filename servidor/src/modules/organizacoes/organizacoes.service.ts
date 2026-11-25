import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, ilike, inArray, or } from 'drizzle-orm';
import {
	BANCO_DADOS,
	type BancoDados,
} from '../../database/banco-dados.module';
import { categoriasServicos } from '../../database/schemas/categorias-servicos.schema';
import { configuracoesAgenda } from '../../database/schemas/configuracoes-agenda.schema';
import {
	organizacoes,
	type Organizacao,
} from '../../database/schemas/organizacoes.schema';
import { servicos } from '../../database/schemas/servicos.schema';
import { criarGradePadrao } from '../configuracoes-agenda/grade-padrao';
import type { AtualizarOrganizacaoDto } from './dtos/atualizar-organizacao.dto';
import type { CriarOrganizacaoDto } from './dtos/criar-organizacao.dto';

export interface OrganizacaoPublica {
	id: number;
	nomeFantasia: string;
	documento: string;
	telefone: string | null;
	endereco: string | null;
	capacidadeSimultanea: number;
	duracaoPadraoMinutos: number;
}

export interface ServicoDestaquePublico {
	id: number;
	nomeServico: string;
	precoCentavos: number;
	duracaoMinutos: number;
	categoria: string | null;
}

export interface OrganizacaoVitrineResumo {
	id: number;
	nomeFantasia: string;
	endereco: string | null;
	telefone: string | null;
	totalServicosAtivos: number;
	servicosDestaque: ServicoDestaquePublico[];
}

export interface ResumoDiaAgenda {
	diaSemana: number;
	ativo: boolean;
	horasAbertas: number;
	horarioAbertura: string | null;
	horarioFechamento: string | null;
	inicioPausa: string | null;
	fimPausa: string | null;
}

export interface ResumoCategoriaCatalogo {
	nome: string;
	totalServicos: number;
}

export interface ResumoEmpresa {
	idOrganizacao: number;
	nomeFantasia: string;
	endereco: string | null;
	telefone: string | null;
	capacidadeSimultanea: number;
	totalServicosAtivos: number;
	totalCategorias: number;
	diasAtivosSemana: number;
	agendaConfigurada: boolean;
	gradeSemanal: ResumoDiaAgenda[];
	servicosPorCategoria: ResumoCategoriaCatalogo[];
}

const MENSAGEM_SEM_ORGANIZACAO =
	'Você ainda não cadastrou sua empresa. Conclua o cadastro em Configurações.';

@Injectable()
export class OrganizacoesServico {
	constructor(@Inject(BANCO_DADOS) private readonly banco: BancoDados) {}

	async criar(
		idUsuario: number,
		dados: CriarOrganizacaoDto,
	): Promise<OrganizacaoPublica> {
		const [existente] = await this.banco
			.select({ id: organizacoes.id, idUsuario: organizacoes.idUsuario })
			.from(organizacoes)
			.where(eq(organizacoes.idUsuario, idUsuario))
			.limit(1);

		if (existente) {
			throw new ConflictException('Você já possui uma empresa cadastrada.');
		}

		const [documentoEmUso] = await this.banco
			.select({ id: organizacoes.id })
			.from(organizacoes)
			.where(eq(organizacoes.documento, dados.documento))
			.limit(1);

		if (documentoEmUso) {
			throw new ConflictException(
				'Já existe uma empresa cadastrada com este CPF/CNPJ.',
			);
		}

		try {
			const organizacao = await this.banco.transaction(async (transacao) => {
				const [nova] = await transacao
					.insert(organizacoes)
					.values({ idUsuario, ...dados })
					.returning();

				await transacao.insert(configuracoesAgenda).values(
					criarGradePadrao().map((dia) => ({
						idOrganizacao: nova.id,
						...dia,
					})),
				);

				return nova;
			});

			return this.paraPublica(organizacao);
		} catch (erro) {
			// Corrida entre duas requisições: o índice único do banco tem a palavra final.
			if (this.ehViolacaoUnica(erro)) {
				throw new ConflictException(
					'Já existe uma empresa cadastrada com estes dados.',
				);
			}

			throw erro;
		}
	}

	async buscarMinha(idUsuario: number): Promise<OrganizacaoPublica> {
		return this.paraPublica(await this.buscarPorUsuario(idUsuario));
	}

	async obterResumoEmpresa(idUsuario: number): Promise<ResumoEmpresa> {
		const organizacao = await this.buscarPorUsuario(idUsuario);

		const [servicosAtivos, categoriasLista, grade] = await Promise.all([
			this.banco
				.select({
					id: servicos.id,
					categoriaNome: categoriasServicos.nome,
				})
				.from(servicos)
				.leftJoin(
					categoriasServicos,
					eq(servicos.idCategoria, categoriasServicos.id),
				)
				.where(
					and(
						eq(servicos.idOrganizacao, organizacao.id),
						eq(servicos.ativo, true),
					),
				),
			this.banco
				.select({ id: categoriasServicos.id })
				.from(categoriasServicos)
				.where(eq(categoriasServicos.idOrganizacao, organizacao.id)),
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
				.where(eq(configuracoesAgenda.idOrganizacao, organizacao.id))
				.orderBy(asc(configuracoesAgenda.diaSemana)),
		]);

		const contagemPorCategoria = new Map<string, number>();
		for (const item of servicosAtivos) {
			const chave = item.categoriaNome ?? 'Sem categoria';
			contagemPorCategoria.set(
				chave,
				(contagemPorCategoria.get(chave) ?? 0) + 1,
			);
		}

		const servicosPorCategoria = Array.from(contagemPorCategoria.entries())
			.map(([nome, totalServicos]) => ({ nome, totalServicos }))
			.sort((a, b) => b.totalServicos - a.totalServicos);

		const gradeSemanal: ResumoDiaAgenda[] = Array.from(
			{ length: 7 },
			(_, diaSemana) => {
				const linha = grade.find((g) => g.diaSemana === diaSemana);
				if (!linha || !linha.ativo) {
					return {
						diaSemana,
						ativo: false,
						horasAbertas: 0,
						horarioAbertura: null,
						horarioFechamento: null,
						inicioPausa: null,
						fimPausa: null,
					};
				}

				const minutosExpediente =
					this.paraMinutos(linha.horarioFechamento) -
					this.paraMinutos(linha.horarioAbertura);
				const minutosPausa =
					linha.inicioPausa && linha.fimPausa
						? Math.max(
								0,
								this.paraMinutos(linha.fimPausa) -
									this.paraMinutos(linha.inicioPausa),
							)
						: 0;
				const horasAbertas = Number(
					(Math.max(0, minutosExpediente - minutosPausa) / 60).toFixed(1),
				);

				return {
					diaSemana,
					ativo: true,
					horasAbertas,
					horarioAbertura: linha.horarioAbertura,
					horarioFechamento: linha.horarioFechamento,
					inicioPausa: linha.inicioPausa,
					fimPausa: linha.fimPausa,
				};
			},
		);

		const diasAtivosSemana = gradeSemanal.filter((dia) => dia.ativo).length;

		return {
			idOrganizacao: organizacao.id,
			nomeFantasia: organizacao.nomeFantasia,
			endereco: organizacao.endereco,
			telefone: organizacao.telefone,
			capacidadeSimultanea: organizacao.capacidadeSimultanea,
			totalServicosAtivos: servicosAtivos.length,
			totalCategorias: categoriasLista.length,
			diasAtivosSemana,
			agendaConfigurada: diasAtivosSemana > 0,
			gradeSemanal,
			servicosPorCategoria,
		};
	}

	async listarPublicas(busca?: string): Promise<OrganizacaoVitrineResumo[]> {
		const termo = busca?.trim();
		const condicaoBusca = termo
			? or(
					ilike(organizacoes.nomeFantasia, `%${termo}%`),
					ilike(organizacoes.endereco, `%${termo}%`),
					ilike(servicos.nomeServico, `%${termo}%`),
					ilike(categoriasServicos.nome, `%${termo}%`),
				)
			: undefined;

		const orgsEncontradas = termo
			? await this.banco
					.selectDistinct({
						id: organizacoes.id,
						nomeFantasia: organizacoes.nomeFantasia,
						endereco: organizacoes.endereco,
						telefone: organizacoes.telefone,
					})
					.from(organizacoes)
					.leftJoin(
						servicos,
						and(
							eq(servicos.idOrganizacao, organizacoes.id),
							eq(servicos.ativo, true),
						),
					)
					.leftJoin(
						categoriasServicos,
						eq(servicos.idCategoria, categoriasServicos.id),
					)
					.where(condicaoBusca)
					.orderBy(asc(organizacoes.nomeFantasia))
			: await this.banco
					.select({
						id: organizacoes.id,
						nomeFantasia: organizacoes.nomeFantasia,
						endereco: organizacoes.endereco,
						telefone: organizacoes.telefone,
					})
					.from(organizacoes)
					.orderBy(asc(organizacoes.nomeFantasia));

		if (orgsEncontradas.length === 0) {
			return [];
		}

		const ids = orgsEncontradas.map((org) => org.id);
		const servicosAtivos = await this.banco
			.select({
				id: servicos.id,
				idOrganizacao: servicos.idOrganizacao,
				nomeServico: servicos.nomeServico,
				precoCentavos: servicos.precoCentavos,
				duracaoMinutos: servicos.duracaoMinutos,
				categoria: categoriasServicos.nome,
			})
			.from(servicos)
			.leftJoin(
				categoriasServicos,
				eq(servicos.idCategoria, categoriasServicos.id),
			)
			.where(
				and(inArray(servicos.idOrganizacao, ids), eq(servicos.ativo, true)),
			)
			.orderBy(asc(servicos.nomeServico));

		const mapaServicos = new Map<number, ServicoDestaquePublico[]>();
		for (const item of servicosAtivos) {
			const lista = mapaServicos.get(item.idOrganizacao) ?? [];
			lista.push({
				id: item.id,
				nomeServico: item.nomeServico,
				precoCentavos: item.precoCentavos,
				duracaoMinutos: item.duracaoMinutos,
				categoria: item.categoria ?? null,
			});
			mapaServicos.set(item.idOrganizacao, lista);
		}

		return orgsEncontradas.map((org) => {
			const lista = mapaServicos.get(org.id) ?? [];
			return {
				...org,
				totalServicosAtivos: lista.length,
				servicosDestaque: lista.slice(0, 3),
			};
		});
	}

	async atualizarMinha(
		idUsuario: number,
		dados: AtualizarOrganizacaoDto,
	): Promise<OrganizacaoPublica> {
		const [atualizada] = await this.banco
			.update(organizacoes)
			.set({ ...dados, atualizadoEm: new Date() })
			.where(eq(organizacoes.idUsuario, idUsuario))
			.returning();

		if (!atualizada) {
			throw new NotFoundException(MENSAGEM_SEM_ORGANIZACAO);
		}

		return this.paraPublica(atualizada);
	}

	/**
	 * Resolve a organização do prestador autenticado. Usado também pelo módulo
	 * de configurações de agenda, garantindo que nenhum `id` venha da URL.
	 */
	async buscarPorUsuario(idUsuario: number): Promise<Organizacao> {
		const [organizacao] = await this.banco
			.select()
			.from(organizacoes)
			.where(eq(organizacoes.idUsuario, idUsuario))
			.limit(1);

		if (!organizacao) {
			throw new NotFoundException(MENSAGEM_SEM_ORGANIZACAO);
		}

		return organizacao;
	}

	private paraPublica(organizacao: Organizacao): OrganizacaoPublica {
		return {
			id: organizacao.id,
			nomeFantasia: organizacao.nomeFantasia,
			documento: organizacao.documento,
			telefone: organizacao.telefone,
			endereco: organizacao.endereco,
			capacidadeSimultanea: organizacao.capacidadeSimultanea,
			duracaoPadraoMinutos: organizacao.duracaoPadraoMinutos,
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

	private paraMinutos(horario: string): number {
		const [horas, minutos] = horario.split(':').map(Number);
		return (horas || 0) * 60 + (minutos || 0);
	}
}
