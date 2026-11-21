import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usarAutenticacao } from '../hooks/usarAutenticacao';
import type { PapelUsuario } from '../servicos/autenticacaoServico';

interface PropriedadesRotaProtegida {
	children: ReactNode;
	papeis?: PapelUsuario[];
}

export function RotaProtegida({
	children,
	papeis,
}: PropriedadesRotaProtegida) {
	const { usuario, carregando, erroUsuario } = usarAutenticacao();
	const localizacao = useLocation();

	if (carregando) {
		return (
			<main className="flex min-h-screen items-center justify-center text-sm text-slate-500">
				Verificando sua sessão...
			</main>
		);
	}

	if (erroUsuario) {
		return (
			<main className="flex min-h-screen items-center justify-center p-6">
				<section className="max-w-md rounded-2xl bg-white p-8 text-center shadow-painel">
					<p className="text-sm text-red-700" role="alert">
						Não foi possível verificar sua sessão. Confira sua conexão e tente
						novamente.
					</p>
					<button
						className="mt-5 rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700"
						onClick={() => window.location.reload()}
					>
						Tentar novamente
					</button>
				</section>
			</main>
		);
	}

	if (!usuario) {
		return (
			<Navigate
				to="/entrar"
				replace
				state={{ de: localizacao.pathname }}
			/>
		);
	}

	if (papeis?.length && !papeis.includes(usuario.role)) {
		return (
			<main className="flex min-h-screen items-center justify-center p-6">
				<p className="rounded-2xl bg-white p-8 text-slate-700 shadow-painel">
					Você não tem permissão para acessar esta página.
				</p>
			</main>
		);
	}

	return children;
}
