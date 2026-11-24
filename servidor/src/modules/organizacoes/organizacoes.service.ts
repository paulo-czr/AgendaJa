import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
	BANCO_DADOS,
	type BancoDados,
} from '../../database/banco-dados.module';
import { configuracoesAgenda } from '../../database/schemas/configuracoes-agenda.schema';
import {
	organizacoes,
	type Organizacao,
} from '../../database/schemas/organizacoes.schema';
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
}
