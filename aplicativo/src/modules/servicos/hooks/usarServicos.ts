import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	servicosServico,
	type DadosAtualizarServico,
} from '../servicos/servicosServico';

export const CHAVE_MEUS_SERVICOS = ['meus-servicos'] as const;

export function chaveVitrine(idOrganizacao: number) {
	return ['vitrine', idOrganizacao] as const;
}

export function usarServicos(habilitado = true) {
	const clienteConsultas = useQueryClient();

	const consulta = useQuery({
		queryKey: CHAVE_MEUS_SERVICOS,
		queryFn: servicosServico.listarMeus,
		enabled: habilitado,
	});

	const criar = useMutation({
		mutationFn: servicosServico.criar,
		onSuccess: () =>
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_MEUS_SERVICOS }),
	});

	const atualizar = useMutation({
		mutationFn: ({
			id,
			dados,
		}: {
			id: number;
			dados: DadosAtualizarServico;
		}) => servicosServico.atualizar(id, dados),
		onSuccess: () =>
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_MEUS_SERVICOS }),
	});

	const desativar = useMutation({
		mutationFn: servicosServico.desativar,
		onSuccess: () =>
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_MEUS_SERVICOS }),
	});

	return {
		servicos: consulta.data ?? [],
		carregando: consulta.isPending && habilitado,
		erro: consulta.error,
		criar,
		atualizar,
		desativar,
	};
}

export function usarVitrinePublica(idOrganizacao: number) {
	return useQuery({
		queryKey: chaveVitrine(idOrganizacao),
		queryFn: () => servicosServico.buscarVitrine(idOrganizacao),
		enabled: Number.isInteger(idOrganizacao) && idOrganizacao > 0,
		retry: false,
	});
}
