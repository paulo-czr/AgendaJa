import {
	BrowserRouter,
	Link,
	Route,
	Routes,
	useNavigate,
} from 'react-router-dom';
import { Botao } from '../components/Botao';
import { LayoutPainel } from '../components/LayoutPainel';
import { ProvedorNotificacoes } from '../lib/notificacoes';
import { ProvedorAplicativo } from './ProvedorAplicativo';
import { RotaProtegida } from '../modules/autenticacao/componentes/RotaProtegida';
import { usarAutenticacao } from '../modules/autenticacao/hooks/usarAutenticacao';
import { PaginaCadastro } from '../modules/autenticacao/paginas/PaginaCadastro';
import { PaginaLogin } from '../modules/autenticacao/paginas/PaginaLogin';
import { PaginaRecuperarSenha } from '../modules/autenticacao/paginas/PaginaRecuperarSenha';
import { PaginaVerificarEmail } from '../modules/autenticacao/paginas/PaginaVerificarEmail';
import { ExigirOrganizacao } from '../modules/organizacoes/componentes/ExigirOrganizacao';
import { usarOrganizacao } from '../modules/organizacoes/hooks/usarOrganizacao';
import { PaginaConfiguracoes } from '../modules/organizacoes/paginas/PaginaConfiguracoes';
import { PaginaServicos } from '../modules/servicos/paginas/PaginaServicos';
import { PaginaVitrinePublica } from '../modules/vitrine/paginas/PaginaVitrinePublica';
import { PaginaNaoEncontrada } from './PaginaNaoEncontrada';

function PaginaInicial() {
	const { usuario, sair } = usarAutenticacao();
	const ehPrestador = usuario?.role === 'prestador';
	const { organizacao } = usarOrganizacao(ehPrestador);
	const navegar = useNavigate();

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => navegar('/entrar', { replace: true }),
		});
	}

	if (ehPrestador) {
		return (
			<LayoutPainel
				itemAtivo="inicio"
				titulo={`Olá, ${usuario?.nome}.`}
				descricao="Acompanhe e gerencie o funcionamento da sua empresa no AgendaJá."
				empresa={{
					nome: organizacao?.nomeFantasia ?? 'Sua empresa',
					detalhe:
						organizacao?.endereco ||
						(organizacao ? 'Endereço não informado' : 'Cadastro pendente'),
				}}
				aoSair={encerrarSessao}
				saindo={sair.isPending}
			>
				<section className="rounded-[14px] bg-white p-6">
					<p className="text-xs font-semibold uppercase tracking-wide text-marca-700">
						Sessão ativa
					</p>
					<h2 className="mt-2 text-lg font-bold text-tinta">
						{organizacao?.nomeFantasia ?? 'Configure sua empresa'}
					</h2>
					<p className="mt-2 max-w-xl text-[13px] leading-6 text-tinta-suave">
						{organizacao
							? 'Os dados da sua empresa e as regras de funcionamento da sua agenda podem ser ajustados a qualquer momento em Configurações.'
							: 'Cadastre os dados da sua empresa e os horários de atendimento para liberar sua agenda.'}
					</p>
					<div className="mt-5">
						<Link
							to="/configuracoes"
							className="inline-flex h-11 items-center rounded-lg bg-marca-500 px-5 text-xs font-semibold text-petroleo transition hover:bg-marca-600"
						>
							Ir para Configurações
						</Link>
					</div>
					{sair.isError && (
						<p className="mt-5 text-xs text-perigo" role="alert">
							Não foi possível encerrar sua sessão. Tente novamente.
						</p>
					)}
				</section>
			</LayoutPainel>
		);
	}

	return (
		<main className="min-h-screen bg-[#f6f7f5]">
			<header className="border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
					<Link className="font-bold text-marca-700" to="/">
						AgendaJá
					</Link>
					<Botao
						variante="outline"
						tamanho="pequeno"
						onClick={encerrarSessao}
						disabled={sair.isPending}
					>
						Sair
					</Botao>
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
			<Route
				path="/servicos"
				element={
					<RotaProtegida papeis={['prestador']}>
						<ExigirOrganizacao>
							<PaginaServicos />
						</ExigirOrganizacao>
					</RotaProtegida>
				}
			/>
			<Route path="/vitrine/:idOrganizacao" element={<PaginaVitrinePublica />} />
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
				<ProvedorNotificacoes />
			</BrowserRouter>
		</ProvedorAplicativo>
	);
}
