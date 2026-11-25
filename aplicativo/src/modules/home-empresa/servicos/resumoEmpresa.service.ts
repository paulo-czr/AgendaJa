import clienteHttp from '../../../lib/clienteHttp';

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

export const resumoEmpresaServico = {
	async obterResumo(): Promise<ResumoEmpresa> {
		const resposta = await clienteHttp.get<ResumoEmpresa>(
			'/organizacoes/minha/resumo',
		);
		return resposta.data;
	},
};
