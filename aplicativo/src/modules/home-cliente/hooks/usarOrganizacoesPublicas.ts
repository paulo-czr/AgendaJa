import { useQuery } from '@tanstack/react-query';
import { vitrineGeralServico } from '../servicos/vitrineGeral.service';

export function chaveOrganizacoesPublicas(termoBusca: string) {
	return ['organizacoes-publicas', termoBusca.trim()] as const;
}

export function usarOrganizacoesPublicas(termoBusca: string) {
	return useQuery({
		queryKey: chaveOrganizacoesPublicas(termoBusca),
		queryFn: () =>
			vitrineGeralServico.listarOrganizacoesPublicas(termoBusca),
	});
}
