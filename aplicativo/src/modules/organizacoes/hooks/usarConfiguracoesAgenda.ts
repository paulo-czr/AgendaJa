import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { configuracoesAgendaServico } from '../servicos/configuracoesAgendaServico';

export const CHAVE_GRADE_AGENDA = ['grade-agenda'] as const;
export const CHAVE_BLOQUEIOS_AGENDA = ['bloqueios-agenda'] as const;

/**
 * Grade semanal e bloqueios da organização. As consultas só rodam quando a
 * empresa já existe (`habilitado`), pois antes disso a API responde 404.
 */
export function usarConfiguracoesAgenda(habilitado: boolean) {
	const clienteConsultas = useQueryClient();
	const grade = useQuery({
		queryKey: CHAVE_GRADE_AGENDA,
		queryFn: configuracoesAgendaServico.buscarGrade,
		enabled: habilitado,
	});
	const bloqueios = useQuery({
		queryKey: CHAVE_BLOQUEIOS_AGENDA,
		queryFn: configuracoesAgendaServico.listarBloqueios,
		enabled: habilitado,
	});

	const salvarGrade = useMutation({
		mutationFn: configuracoesAgendaServico.salvarGrade,
		onSuccess: (dias) => {
			clienteConsultas.setQueryData(CHAVE_GRADE_AGENDA, dias);
		},
	});
	const criarBloqueio = useMutation({
		mutationFn: configuracoesAgendaServico.criarBloqueio,
		onSuccess: () =>
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_BLOQUEIOS_AGENDA }),
	});
	const removerBloqueio = useMutation({
		mutationFn: configuracoesAgendaServico.removerBloqueio,
		onSuccess: () =>
			clienteConsultas.invalidateQueries({ queryKey: CHAVE_BLOQUEIOS_AGENDA }),
	});

	return {
		grade: grade.data,
		carregandoGrade: grade.isPending && habilitado,
		erroGrade: grade.error,
		bloqueios: bloqueios.data ?? [],
		carregandoBloqueios: bloqueios.isPending && habilitado,
		salvarGrade,
		criarBloqueio,
		removerBloqueio,
	};
}
