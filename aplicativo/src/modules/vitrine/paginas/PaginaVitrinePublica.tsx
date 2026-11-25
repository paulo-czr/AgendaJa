import { useMemo, useState } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Logo } from '../../../components/Logo';
import BlurText from '../../../components/reactbits/BlurText';
import SpotlightCard from '../../../components/reactbits/SpotlightCard';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { DIAS_SEMANA } from '../../organizacoes/formulario';
import {
	formatarDuracao,
	formatarPrecoCentavos,
} from '../../servicos/formatadores';
import { usarVitrinePublica } from '../../servicos/hooks/usarServicos';
import type { ServicoVitrine } from '../../servicos/servicos/servicosServico';

function agruparPorCategoria(
	servicos: ServicoVitrine[],
): Array<[string, ServicoVitrine[]]> {
	const grupos = new Map<string, ServicoVitrine[]>();

	for (const servico of servicos) {
		const chave = servico.categoria?.nome || 'Serviços';
		const lista = grupos.get(chave) ?? [];
		lista.push(servico);
		grupos.set(chave, lista);
	}

	return Array.from(grupos.entries());
}

export function PaginaVitrinePublica() {
	const { idOrganizacao } = useParams();
	const idNumero = Number(idOrganizacao);
	const { data, isPending, error } = usarVitrinePublica(idNumero);
	const [categoriaSelecionada, definirCategoriaSelecionada] =
		useState<string>('todas');

	const grupos = useMemo(
		() => (data ? agruparPorCategoria(data.servicos) : []),
		[data],
	);

	const gruposVisiveis = useMemo(() => {
		if (categoriaSelecionada === 'todas') {
			return grupos;
		}
		return grupos.filter(([nome]) => nome === categoriaSelecionada);
	}, [grupos, categoriaSelecionada]);

	if (!Number.isInteger(idNumero) || idNumero <= 0) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo p-6">
				<section className="max-w-md rounded-2xl border border-cor-borda/80 bg-cor-superficie p-8 text-center shadow-sutil">
					<h1 className="text-lg font-semibold text-cor-fonte-primaria">
						Vitrine inválida
					</h1>
					<p className="mt-2 text-sm text-cor-fonte-secundaria">
						O endereço informado não corresponde a uma empresa válida.
					</p>
				</section>
			</main>
		);
	}

	if (isPending) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo text-sm text-cor-fonte-secundaria">
				Carregando vitrine...
			</main>
		);
	}

	if (error || !data) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-cor-fundo p-6">
				<section className="max-w-md rounded-2xl border border-cor-borda/80 bg-cor-superficie p-8 text-center shadow-sutil">
					<h1 className="text-lg font-semibold text-cor-fonte-primaria">
						Vitrine não encontrada
					</h1>
					<p className="mt-2 text-sm text-cor-fonte-secundaria" role="alert">
						{obterMensagemErro(error)}
					</p>
				</section>
			</main>
		);
	}

	const { organizacao, servicos } = data;
	const horariosAtivos = organizacao.horarios.filter((horario) => horario.ativo);

	return (
		<div className="min-h-screen bg-cor-fundo">
			<header className="border-b border-cor-secundaria-borda bg-cor-secundaria text-cor-fonte-invertida">
				<div className="mx-auto max-w-5xl px-6 py-6 sm:px-8">
					<div className="flex items-center justify-between gap-4">
						<Link to="/" aria-label="AgendaJá">
							<Logo variante="claro" />
						</Link>
						<Link
							to="/entrar"
							className="text-xs font-medium text-cor-fonte-invertida-suave transition-colors hover:text-cor-fonte-invertida"
						>
							Entrar na conta
						</Link>
					</div>

					<div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
						<div>
							<p className="text-xs font-medium text-cor-primaria">
								Catálogo de serviços
							</p>
							<h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
								<BlurText
									text={organizacao.nomeFantasia}
									delay={80}
									animateBy="words"
									direction="top"
									trigger="load"
								/>
							</h1>
						</div>

						<div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-cor-fonte-invertida-suave">
							{organizacao.endereco && (
								<span className="inline-flex items-center gap-1.5">
									<MapPin className="size-3.5" strokeWidth={1.5} />
									{organizacao.endereco}
								</span>
							)}
							{organizacao.telefone && (
								<span className="inline-flex items-center gap-1.5 tabular-nums">
									<Phone className="size-3.5" strokeWidth={1.5} />
									{organizacao.telefone}
								</span>
							)}
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto grid max-w-5xl gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
				<div className="min-w-0 space-y-6">
					{grupos.length > 1 && (
						<nav aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => definirCategoriaSelecionada('todas')}
								className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
									categoriaSelecionada === 'todas'
										? 'bg-cor-secundaria text-cor-fonte-invertida'
										: 'border border-cor-borda bg-cor-superficie text-cor-fonte-secundaria hover:text-cor-fonte-primaria'
								}`}
							>
								Todas ({servicos.length})
							</button>
							{grupos.map(([nome, itens]) => (
								<button
									key={nome}
									type="button"
									onClick={() => definirCategoriaSelecionada(nome)}
									className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors tabular-nums ${
										categoriaSelecionada === nome
											? 'bg-cor-secundaria text-cor-fonte-invertida'
											: 'border border-cor-borda bg-cor-superficie text-cor-fonte-secundaria hover:text-cor-fonte-primaria'
									}`}
								>
									{nome} ({itens.length})
								</button>
							))}
						</nav>
					)}

					{servicos.length === 0 ? (
						<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-8 text-center shadow-sutil">
							<h2 className="text-base font-semibold text-cor-fonte-primaria">
								Nenhum serviço disponível no momento
							</h2>
							<p className="mt-2 text-xs text-cor-fonte-secundaria">
								Esta empresa ainda está organizando seu catálogo. Volte em breve.
							</p>
						</section>
					) : (
						<div className="space-y-6">
							{gruposVisiveis.map(([categoria, itens]) => (
								<section
									key={categoria}
									className="rounded-2xl border border-cor-borda/80 bg-cor-superficie shadow-sutil"
								>
									<div className="flex items-center justify-between border-b border-cor-borda/70 px-5 py-3.5">
										<h2 className="text-sm font-semibold text-cor-fonte-primaria">
											{categoria}
										</h2>
										<span className="text-xs text-cor-fonte-secundaria tabular-nums">
											{itens.length} {itens.length === 1 ? 'serviço' : 'serviços'}
										</span>
									</div>

									<ul className="divide-y divide-cor-borda/70">
										{itens.map((servico) => (
											<li
												key={servico.id}
												className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
											>
												<div className="min-w-0 flex-1">
													<h3 className="text-sm font-semibold text-cor-fonte-primaria">
														{servico.nomeServico}
													</h3>
													{servico.descricaoServico && (
														<p className="mt-1 text-xs leading-5 text-cor-fonte-secundaria">
															{servico.descricaoServico}
														</p>
													)}
													<p className="mt-2 inline-flex items-center gap-1.5 text-xs text-cor-fonte-secundaria tabular-nums">
														<Clock
															className="size-3.5"
															strokeWidth={1.5}
															aria-hidden="true"
														/>
														{formatarDuracao(servico.duracaoMinutos)}
													</p>
												</div>

												<div className="flex items-center justify-between gap-4 sm:justify-end">
													<span className="text-sm font-semibold text-cor-fonte-primaria tabular-nums">
														{formatarPrecoCentavos(servico.precoCentavos)}
													</span>
													<Link
														to="/entrar"
														state={{
															servicoId: servico.id,
															organizacaoId: organizacao.id,
														}}
														className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-cor-primaria px-4 text-xs font-semibold text-cor-secundaria transition-colors hover:bg-cor-primaria-hover"
													>
														Agendar
														<ArrowRight
															className="size-3.5"
															strokeWidth={1.75}
															aria-hidden="true"
														/>
													</Link>
												</div>
											</li>
										))}
									</ul>
								</section>
							))}
						</div>
					)}
				</div>

				{horariosAtivos.length > 0 && (
					<SpotlightCard
						theme="light"
						spotlightColor="rgb(32 201 174)"
						intensity={0.18}
						className="!rounded-2xl border border-cor-borda/80 !p-5 !shadow-sutil lg:sticky lg:top-6"
					>
						<aside>
							<h2 className="text-sm font-semibold text-cor-fonte-primaria">
								Horários de atendimento
							</h2>
							<ul className="mt-4 divide-y divide-cor-borda/60 text-xs">
								{DIAS_SEMANA.map((dia) => {
									const config = horariosAtivos.find(
										(item) => item.diaSemana === dia.numero,
									);

									return (
										<li
											key={dia.numero}
											className="flex items-center justify-between py-2"
										>
											<span className="font-medium text-cor-fonte-primaria">
												{dia.nome}
											</span>
											{config ? (
												<span className="text-cor-fonte-secundaria tabular-nums">
													{config.horarioAbertura} – {config.horarioFechamento}
												</span>
											) : (
												<span className="text-cor-fonte-secundaria/70">Fechado</span>
											)}
										</li>
									);
								})}
							</ul>
						</aside>
					</SpotlightCard>
				)}
			</main>
		</div>
	);
}
