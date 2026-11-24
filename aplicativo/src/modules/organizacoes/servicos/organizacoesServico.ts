import clienteHttp from '../../../lib/clienteHttp';

export interface Organizacao {
	id: number;
	nomeFantasia: string;
	documento: string;
	telefone: string | null;
	endereco: string | null;
	capacidadeSimultanea: number;
	duracaoPadraoMinutos: number;
}

export interface DadosOrganizacao {
	nomeFantasia: string;
	telefone: string;
	endereco: string | null;
	capacidadeSimultanea: number;
	duracaoPadraoMinutos: number;
}

export interface DadosCadastroOrganizacao extends DadosOrganizacao {
	documento: string;
}

export const organizacoesServico = {
	async buscarMinha(): Promise<Organizacao> {
		const resposta = await clienteHttp.get<Organizacao>('/organizacoes/minha');
		return resposta.data;
	},

	async criar(dados: DadosCadastroOrganizacao): Promise<Organizacao> {
		const resposta = await clienteHttp.post<Organizacao>('/organizacoes', dados);
		return resposta.data;
	},

	async atualizar(dados: DadosOrganizacao): Promise<Organizacao> {
		const resposta = await clienteHttp.patch<Organizacao>(
			'/organizacoes/minha',
			dados,
		);
		return resposta.data;
	},
};
