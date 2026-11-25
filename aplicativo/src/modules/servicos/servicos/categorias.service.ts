import clienteHttp from '../../../lib/clienteHttp';

export interface CategoriaServico {
	id: number;
	nome: string;
	criadoEm: string;
}

export const categoriasServico = {
	async listar(): Promise<CategoriaServico[]> {
		const resposta = await clienteHttp.get<CategoriaServico[]>(
			'/servicos/categorias',
		);
		return resposta.data;
	},

	async criar(nome: string): Promise<CategoriaServico> {
		const resposta = await clienteHttp.post<CategoriaServico>(
			'/servicos/categorias',
			{ nome },
		);
		return resposta.data;
	},

	async atualizar(id: number, nome: string): Promise<CategoriaServico> {
		const resposta = await clienteHttp.patch<CategoriaServico>(
			`/servicos/categorias/${id}`,
			{ nome },
		);
		return resposta.data;
	},

	async remover(id: number): Promise<void> {
		await clienteHttp.delete(`/servicos/categorias/${id}`);
	},
};
