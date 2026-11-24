import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { ProvedorAplicativo } from './ProvedorAplicativo';
import { RotaProtegida } from '../modules/autenticacao/componentes/RotaProtegida';
import { usarAutenticacao } from '../modules/autenticacao/hooks/usarAutenticacao';
import { PaginaCadastro } from '../modules/autenticacao/paginas/PaginaCadastro';
import { PaginaLogin } from '../modules/autenticacao/paginas/PaginaLogin';
import { PaginaRecuperarSenha } from '../modules/autenticacao/paginas/PaginaRecuperarSenha';
import { PaginaVerificarEmail } from '../modules/autenticacao/paginas/PaginaVerificarEmail';
import { ExigirOrganizacao } from '../modules/organizacoes/componentes/ExigirOrganizacao';
import { PaginaConfiguracoes } from '../modules/organizacoes/paginas/PaginaConfiguracoes';
import { PaginaNaoEncontrada } from './PaginaNaoEncontrada';

function PaginaInicial() {
	const { usuario, sair } = usarAutenticacao();
	const navegar = useNavigate();

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => navegar('/entrar', { replace: true }),
		});
	}

	return (
		<main className="min-h-screen bg-[#f6f7f5]">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
					<Link className="font-bold text-marca-700" to="/">
						AgendaJá
					</Link>
					<button
						className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
						onClick={encerrarSessao}
						disabled={sair.isPending}
					>
						Sair
					</button>
				</div>
			</header>
			<section className="mx-auto max-w-6xl px-6 py-16">
				<p className="text-sm font-semibold text-marca-600">Sessão ativa</p>
				<h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
					Olá, {usuario?.nome}.
				</h1>
				<p className="mt-3 max-w-xl leading-7 text-slate-500">
					Sua conta está pronta. Esta área protegida é o ponto inicial da sua
					experiência no AgendaJá.
				</p>
				{sair.isError && (
					<p className="mt-5 text-sm text-red-700" role="alert">
						Não foi possível encerrar sua sessão. Tente novamente.
					</p>
				)}
			</section>
		</main>
	);
}

function RotasAplicativo() {
	return (
		<Routes>
			<Route path="/entrar" element={<PaginaLogin />} />
			<Route path="/cadastro" element={<PaginaCadastro />} />
			<Route path="/verificar-email" element={<PaginaVerificarEmail />} />
			<Route path="/recuperar-senha" element={<PaginaRecuperarSenha />} />
			<Route
				path="/"
				element={
					<RotaProtegida>
						<ExigirOrganizacao>
							<PaginaInicial />
						</ExigirOrganizacao>
					</RotaProtegida>
				}
			/>
			<Route
				path="/configuracoes"
				element={
					<RotaProtegida papeis={['prestador']}>
						<PaginaConfiguracoes />
					</RotaProtegida>
				}
			/>
			<Route path="/404" element={<PaginaNaoEncontrada />} />
			<Route path="*" element={<PaginaNaoEncontrada />} />
		</Routes>
	);
}

export function Aplicativo() {
	return (
		<ProvedorAplicativo>
			<BrowserRouter>
				<RotasAplicativo />
			</BrowserRouter>
		</ProvedorAplicativo>
	);
}
