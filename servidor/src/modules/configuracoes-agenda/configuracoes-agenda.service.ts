import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, gt } from 'drizzle-orm';
import {
	BANCO_DADOS,
	type BancoDados,
} from '../../database/banco-dados.module';
import {
	bloqueiosAgenda,
	configuracoesAgenda,
	type BloqueioAgenda,
} from '../../database/schemas/configuracoes-agenda.schema';
import { OrganizacoesServico } from '../organizacoes/organizacoes.service';
import type { CriarBloqueioDto } from './dtos/criar-bloqueio.dto';
import type { SalvarGradeDto } from './dtos/salvar-grade.dto';
import { criarGradePadrao, type DiaGrade } from './grade-padrao';

export interface BloqueioPublico {
	id: number;
	dataHoraInicio: Date;
	dataHoraFim: Date;
	motivo: string | null;
}

@Injectable()
export class ConfiguracoesAgendaServico {
	constructor(
		@Inject(BANCO_DADOS) private readonly banco: BancoDados,
		private readonly organizacoes: OrganizacoesServico,
	) {}

	/**
	 * Devolve sempre os 7 dias, ordenados de Domingo a Sábado. Dias que ainda
	 * não existem no banco (organizações antigas) vêm da grade padrão inativos.
	 */
	async buscarGrade(idUsuario: number): Promise<{ dias: DiaGrade[] }> {
		const { id: idOrganizacao } =
			await this.organizacoes.buscarPorUsuario(idUsuario);
		const registros = await this.banco
			.select()
			.from(configuracoesAgenda)
			.where(eq(configuracoesAgenda.idOrganizacao, idOrganizacao));

		const dias = criarGradePadrao().map((padrao) => {
			const registro = registros.find(
				(linha) => linha.diaSemana === padrao.diaSemana,
			);

			if (!registro) {
				return { ...padrao, ativo: false };
			}

			return {
				diaSemana: registro.diaSemana,
				ativo: registro.ativo,
				horarioAbertura: registro.horarioAbertura,
				horarioFechamento: registro.horarioFechamento,
				inicioPausa: registro.inicioPausa,
				fimPausa: registro.fimPausa,
			};
		});

		return { dias };
	}

	/** Substitui a grade inteira em uma única transação. */
	async salvarGrade(
		idUsuario: number,
		dados: SalvarGradeDto,
	): Promise<{ dias: DiaGrade[] }> {
		const { id: idOrganizacao } =
			await this.organizacoes.buscarPorUsuario(idUsuario);

		await this.banco.transaction(async (transacao) => {
			await transacao
				.delete(configuracoesAgenda)
				.where(eq(configuracoesAgenda.idOrganizacao, idOrganizacao));

			await transacao.insert(configuracoesAgenda).values(
				dados.dias.map((dia) => ({ idOrganizacao, ...dia })),
			);
		});

		return this.buscarGrade(idUsuario);
	}

	/** Lista os bloqueios que ainda não terminaram, do mais próximo ao mais distante. */
	async listarBloqueios(idUsuario: number): Promise<BloqueioPublico[]> {
		const { id: idOrganizacao } =
			await this.organizacoes.buscarPorUsuario(idUsuario);
		const bloqueios = await this.banco
			.select()
			.from(bloqueiosAgenda)
			.where(
				and(
					eq(bloqueiosAgenda.idOrganizacao, idOrganizacao),
					gt(bloqueiosAgenda.dataHoraFim, new Date()),
				),
			)
			.orderBy(asc(bloqueiosAgenda.dataHoraInicio));

		return bloqueios.map((bloqueio) => this.paraPublico(bloqueio));
	}

	async criarBloqueio(
		idUsuario: number,
		dados: CriarBloqueioDto,
	): Promise<BloqueioPublico> {
		const { id: idOrganizacao } =
			await this.organizacoes.buscarPorUsuario(idUsuario);
		const [bloqueio] = await this.banco
			.insert(bloqueiosAgenda)
			.values({ idOrganizacao, ...dados })
			.returning();

		return this.paraPublico(bloqueio);
	}

	/**
	 * O filtro por organização na própria exclusão impede remover bloqueios de
	 * terceiros: para quem não é dono, o bloqueio simplesmente "não existe".
	 */
	async removerBloqueio(
		idUsuario: number,
		idBloqueio: number,
	): Promise<{ mensagem: string }> {
		const { id: idOrganizacao } =
			await this.organizacoes.buscarPorUsuario(idUsuario);
		const removidos = await this.banco
			.delete(bloqueiosAgenda)
			.where(
				and(
					eq(bloqueiosAgenda.id, idBloqueio),
					eq(bloqueiosAgenda.idOrganizacao, idOrganizacao),
				),
			)
			.returning({ id: bloqueiosAgenda.id });

		if (removidos.length === 0) {
			throw new NotFoundException('Bloqueio não encontrado.');
		}

		return { mensagem: 'Bloqueio removido.' };
	}

	private paraPublico(bloqueio: BloqueioAgenda): BloqueioPublico {
		return {
			id: bloqueio.id,
			dataHoraInicio: bloqueio.dataHoraInicio,
			dataHoraFim: bloqueio.dataHoraFim,
			motivo: bloqueio.motivo,
		};
	}
}
