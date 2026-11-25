import clienteHttp from '../../../lib/clienteHttp';

export interface CategoriaResumo {
	id: number;
	nome: string;
}

export interface Servico {
	id: number;
	idOrganizacao: number;
	idCategoria: number | null;
	categoria: CategoriaResumo | null;
	nomeServico: string;
	descricaoServico: string | null;
	precoCentavos: number;
	duracaoMinutos: number;
	ativo: boolean;
	criadoEm: string;
	atualizadoEm: string;
	desativadoEm: string | null;
}

export interface DadosCriarServico {
	nomeServico: string;
	descricaoServico?: string | null;
	idCategoria?: number | null;
	precoCentavos: number;
	duracaoMinutos: number;
	ativo?: boolean;
}

export type DadosAtualizarServico = Partial<DadosCriarServico>;

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

export const servicosServico = {
	async listarMeus(): Promise<Servico[]> {
		const resposta = await clienteHttp.get<Servico[]>('/servicos/meus');
		return resposta.data;
	},

	async criar(dados: DadosCriarServico): Promise<Servico> {
		const resposta = await clienteHttp.post<Servico>('/servicos', dados);
		return resposta.data;
	},

	async atualizar(id: number, dados: DadosAtualizarServico): Promise<Servico> {
		const resposta = await clienteHttp.patch<Servico>(`/servicos/${id}`, dados);
		return resposta.data;
	},

	async desativar(id: number): Promise<void> {
		await clienteHttp.delete(`/servicos/${id}`);
	},

	async buscarVitrine(idOrganizacao: number): Promise<VitrinePublica> {
		const resposta = await clienteHttp.get<VitrinePublica>(
			`/vitrine/${idOrganizacao}`,
		);
		return resposta.data;
	},
};
