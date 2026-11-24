import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { organizacoesServico } from '../servicos/organizacoesServico';

export const CHAVE_ORGANIZACAO_ATUAL = ['organizacao-atual'] as const;

/**
 * Organização do prestador logado. `organizacao` é `null` quando a empresa
 * ainda não foi cadastrada (a API responde 404).
 */
export function usarOrganizacao(habilitado = true) {
	const clienteConsultas = useQueryClient();
	const consulta = useQuery({
		queryKey: CHAVE_ORGANIZACAO_ATUAL,
		queryFn: async () => {
			try {
				return await organizacoesServico.buscarMinha();
			} catch (erro) {
				if (axios.isAxiosError(erro) && erro.response?.status === 404) {
					return null;
				}

				throw erro;
			}
		},
		enabled: habilitado,
		retry: false,
	});

	const criar = useMutation({
		mutationFn: organizacoesServico.criar,
		onSuccess: (organizacao) => {
			clienteConsultas.setQueryData(CHAVE_ORGANIZACAO_ATUAL, organizacao);
		},
	});
	const atualizar = useMutation({
		mutationFn: organizacoesServico.atualizar,
		onSuccess: (organizacao) => {
			clienteConsultas.setQueryData(CHAVE_ORGANIZACAO_ATUAL, organizacao);
		},
	});

	return {
		organizacao: consulta.data ?? null,
		carregando: consulta.isPending && habilitado,
		erro: consulta.error,
		criar,
		atualizar,
	};
}
