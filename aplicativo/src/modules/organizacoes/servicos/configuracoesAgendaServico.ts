import clienteHttp from '../../../lib/clienteHttp';

/** Dia da grade semanal: 0 = Domingo … 6 = Sábado. */
export interface DiaGrade {
	diaSemana: number;
	ativo: boolean;
	horarioAbertura: string;
	horarioFechamento: string;
	inicioPausa: string | null;
	fimPausa: string | null;
}

export interface Bloqueio {
	id: number;
	dataHoraInicio: string;
	dataHoraFim: string;
	motivo: string | null;
}

export interface DadosBloqueio {
	dataHoraInicio: string;
	dataHoraFim: string;
	motivo: string | null;
}

interface RespostaGrade {
	dias: DiaGrade[];
}

export const configuracoesAgendaServico = {
	async buscarGrade(): Promise<DiaGrade[]> {
		const resposta = await clienteHttp.get<RespostaGrade>('/configuracoes-agenda');
		return resposta.data.dias;
	},

	async salvarGrade(dias: DiaGrade[]): Promise<DiaGrade[]> {
		const resposta = await clienteHttp.put<RespostaGrade>(
			'/configuracoes-agenda',
			{ dias },
		);
		return resposta.data.dias;
	},

	async listarBloqueios(): Promise<Bloqueio[]> {
		const resposta = await clienteHttp.get<Bloqueio[]>(
			'/configuracoes-agenda/bloqueios',
		);
		return resposta.data;
	},

	async criarBloqueio(dados: DadosBloqueio): Promise<Bloqueio> {
		const resposta = await clienteHttp.post<Bloqueio>(
			'/configuracoes-agenda/bloqueios',
			dados,
		);
		return resposta.data;
	},

	async removerBloqueio(id: number): Promise<void> {
		await clienteHttp.delete(`/configuracoes-agenda/bloqueios/${id}`);
	},
};
