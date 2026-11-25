import { useQuery } from '@tanstack/react-query';
import { resumoEmpresaServico } from '../servicos/resumoEmpresa.service';

export const CHAVE_RESUMO_EMPRESA = ['resumo-empresa'] as const;

export function usarResumoEmpresa(habilitado = true) {
	return useQuery({
		queryKey: CHAVE_RESUMO_EMPRESA,
		queryFn: resumoEmpresaServico.obterResumo,
		enabled: habilitado,
	});
}
