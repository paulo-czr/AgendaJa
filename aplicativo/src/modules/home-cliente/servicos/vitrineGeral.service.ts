import clienteHttp from '../../../lib/clienteHttp';

export interface ServicoDestaquePublico {
	id: number;
	nomeServico: string;
	precoCentavos: number;
	duracaoMinutos: number;
	categoria: string | null;
}

export interface OrganizacaoPublicaResumo {
	id: number;
	nomeFantasia: string;
	endereco: string | null;
	telefone: string | null;
	totalServicosAtivos: number;
	servicosDestaque: ServicoDestaquePublico[];
}

export const vitrineGeralServico = {
	async listarOrganizacoesPublicas(
		busca?: string,
	): Promise<OrganizacaoPublicaResumo[]> {
		const params = busca?.trim() ? { busca: busca.trim() } : undefined;
		const resposta = await clienteHttp.get<OrganizacaoPublicaResumo[]>(
			'/organizacoes/publicas',
			{ params },
		);
		return resposta.data;
	},
};
