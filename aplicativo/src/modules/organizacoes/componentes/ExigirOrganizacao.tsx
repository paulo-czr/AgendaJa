import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import { usarOrganizacao } from '../hooks/usarOrganizacao';

/**
 * RF07: o prestador sem empresa cadastrada é levado às Configurações antes de
 * acessar as demais áreas. Clientes passam direto. Deve ficar dentro de
 * `RotaProtegida`, que garante a sessão.
 */
export function ExigirOrganizacao({ children }: { children: ReactNode }) {
	const { usuario } = usarAutenticacao();
	const ehPrestador = usuario?.role === 'prestador';
	const { organizacao, carregando, erro } = usarOrganizacao(ehPrestador);

	if (!ehPrestador) {
		return children;
	}

	if (carregando) {
		return (
			<main className="flex min-h-screen items-center justify-center text-sm text-tinta-suave">
				Carregando sua empresa...
			</main>
		);
	}

	// Em caso de falha de rede não bloqueamos a navegação: a próxima tela tentará de novo.
	if (!erro && organizacao === null) {
		return <Navigate to="/configuracoes" replace />;
	}

	return children;
}
