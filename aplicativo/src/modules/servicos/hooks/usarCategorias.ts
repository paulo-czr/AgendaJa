import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriasServico } from '../servicos/categorias.service';
import { CHAVE_MEUS_SERVICOS } from './usarServicos';

export const CHAVE_CATEGORIAS_SERVICOS = ['categorias-servicos'] as const;

export function usarCategorias(habilitado = true) {
	const clienteConsultas = useQueryClient();

	const consulta = useQuery({
		queryKey: CHAVE_CATEGORIAS_SERVICOS,
		queryFn: categoriasServico.listar,
		enabled: habilitado,
	});

	const invalidarRelacionados = async () => {
		await Promise.all([
			clienteConsultas.invalidateQueries({
				queryKey: CHAVE_CATEGORIAS_SERVICOS,
			}),
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_MEUS_SERVICOS }),
		]);
	};

	const criar = useMutation({
		mutationFn: categoriasServico.criar,
		onSuccess: invalidarRelacionados,
	});

	const atualizar = useMutation({
		mutationFn: ({ id, nome }: { id: number; nome: string }) =>
			categoriasServico.atualizar(id, nome),
		onSuccess: invalidarRelacionados,
	});

	const remover = useMutation({
		mutationFn: categoriasServico.remover,
		onSuccess: invalidarRelacionados,
	});

	return {
		categorias: consulta.data ?? [],
		carregando: consulta.isPending && habilitado,
		erro: consulta.error,
		criar,
		atualizar,
		remover,
	};
}
