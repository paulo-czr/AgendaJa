import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { Botao } from '../../../components/Botao';
import CountUp from '../../../components/reactbits/CountUp';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import { CardOrganizacao } from '../componentes/CardOrganizacao';
import { HeroCliente } from '../componentes/HeroCliente';
import { SecaoComoFuncionaScrollStack } from '../componentes/SecaoComoFuncionaScrollStack';
import { usarOrganizacoesPublicas } from '../hooks/usarOrganizacoesPublicas';

export function PaginaHomeCliente() {
	const { usuario, sair } = usarAutenticacao();
	const [textoBusca, definirTextoBusca] = useState('');
	const [buscaAplicada, definirBuscaAplicada] = useState('');
	const { data, isPending, error } = usarOrganizacoesPublicas(buscaAplicada);

	if (usuario?.role === 'prestador') {
		return <Navigate to="/empresa" replace />;
	}

	function submeterBusca(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		definirBuscaAplicada(textoBusca.trim());
		const secao = document.getElementById('estabelecimentos');
		secao?.scrollIntoView({ behavior: 'smooth' });
	}

	function alterarBusca(valor: string): void {
		definirTextoBusca(valor);
		if (!valor.trim() && buscaAplicada) {
			definirBuscaAplicada('');
		}
	}

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => notificar.sucesso('Sessão encerrada'),
			onError: () =>
				notificar.erro('Não foi possível encerrar sua sessão. Tente novamente.'),
		});
	}

	const organizacoes = data ?? [];

	return (
		<div className="min-h-screen bg-cor-fundo">
			<HeroCliente
				usuario={usuario}
				saindo={sair.isPending}
				aoSair={encerrarSessao}
				busca={textoBusca}
				aoAlterarBusca={alterarBusca}
				aoBuscar={submeterBusca}
			/>

			<SecaoComoFuncionaScrollStack />

			<main
				id="estabelecimentos"
				className="mx-auto max-w-6xl px-6 pb-16 pt-4 sm:px-8"
			>
				<div className="mb-6 flex flex-wrap items-end justify-between gap-3">
					<div>
						<p className="text-xs font-medium text-cor-primaria-escura">
							Parceiros disponíveis
						</p>
						<h2 className="mt-1 text-xl font-semibold text-cor-fonte-primaria sm:text-2xl">
							{buscaAplicada
								? `Resultados para "${buscaAplicada}"`
								: 'Estabelecimentos no AgendaJá'}
						</h2>
					</div>
					{!isPending && !error && (
						<span className="rounded-lg border border-cor-borda bg-cor-superficie px-3 py-1.5 text-xs font-medium text-cor-fonte-secundaria tabular-nums">
							<CountUp to={organizacoes.length} duration={0.4} trigger="load" />{' '}
							{organizacoes.length === 1
								? 'empresa encontrada'
								: 'empresas encontradas'}
						</span>
					)}
				</div>

				{error ? (
					<section
						role="alert"
						className="rounded-2xl border border-cor-perigo/20 bg-cor-superficie p-6 text-sm text-cor-perigo"
					>
						<p className="font-semibold">
							Não foi possível carregar os estabelecimentos
						</p>
						<p className="mt-1 text-xs text-cor-fonte-secundaria">
							{obterMensagemErro(error)}
						</p>
					</section>
				) : isPending ? (
					<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
						<div className="h-64 animate-pulse rounded-2xl bg-cor-superficie" />
						<div className="h-64 animate-pulse rounded-2xl bg-cor-superficie" />
						<div className="h-64 animate-pulse rounded-2xl bg-cor-superficie" />
					</div>
				) : organizacoes.length === 0 ? (
					<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-10 text-center shadow-sutil">
						<span className="mx-auto grid size-12 place-items-center rounded-xl bg-cor-fundo text-cor-fonte-secundaria">
							<Store className="size-6" strokeWidth={1.5} />
						</span>
						<h3 className="mt-4 text-base font-semibold text-cor-fonte-primaria">
							Nenhum estabelecimento encontrado
						</h3>
						<p className="mx-auto mt-2 max-w-md text-xs leading-5 text-cor-fonte-secundaria">
							{buscaAplicada
								? 'Tente buscar por outro nome de empresa, serviço ou categoria.'
								: 'Ainda não há empresas parceiras disponíveis no catálogo.'}
						</p>
						{buscaAplicada && (
							<Botao
								variante="outline"
								onClick={() => alterarBusca('')}
								className="mt-5"
							>
								Limpar busca
							</Botao>
						)}
					</section>
				) : (
					<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
						{organizacoes.map((organizacao) => (
							<CardOrganizacao
								key={organizacao.id}
								organizacao={organizacao}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
