import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
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
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo text-sm text-cor-fonte-secundaria">
				Verificando sua sessão...
			</main>
		);
	}

	if (erroUsuario) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo p-6">
				<section className="max-w-md rounded-2xl border border-cor-borda/80 bg-cor-superficie p-8 text-center shadow-sutil">
					<p className="text-sm text-cor-perigo" role="alert">
						Não foi possível verificar sua sessão. Confira sua conexão e tente
						novamente.
					</p>
					<Botao
						variante="primario"
						onClick={() => window.location.reload()}
						className="mt-5"
					>
						Tentar novamente
					</Botao>
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
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo p-6">
				<p className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-8 text-sm text-cor-fonte-primaria shadow-sutil">
					Você não tem permissão para acessar esta página.
				</p>
			</main>
		);
	}

	return children;
}
