import {
	AlertTriangle,
	Briefcase,
	CalendarClock,
	CalendarDays,
	ChevronRight,
	Coffee,
	Copy,
	ExternalLink,
	MessageCircle,
	Plus,
	Star,
	Tags,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
import { LayoutPainel } from '../../../components/LayoutPainel';
import BlurText from '../../../components/reactbits/BlurText';
import CountUp from '../../../components/reactbits/CountUp';
import SpotlightCard from '../../../components/reactbits/SpotlightCard';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import { CalendarioFuncionamento } from '../componentes/CalendarioFuncionamento';
import {
	DonutCatalogo,
	GaugeProntidao,
	MiniGraficoBarras,
	MiniGraficoLinha,
} from '../componentes/GraficosPainel';
import { TimelineExpediente } from '../componentes/TimelineExpediente';
import { usarResumoEmpresa } from '../hooks/usarResumoEmpresa';
import { FaixaDestaques } from '../../../components/FaixaDestaques';
import {
	INTERVALO_MENSAGEM_MS,
	mensagemDoDia,
} from '../constantes/mensagensPorPeriodo';
import { useEffect, useState } from 'react';

export function PaginaHomeEmpresa() {
	const { usuario, sair } = usarAutenticacao();
	const navegar = useNavigate();
	const { data: resumo, isPending, error } = usarResumoEmpresa(true);
	const [mensagem, setMensagem] = useState(() => mensagemDoDia());

	const linkVitrine = resumo
		? `${window.location.origin}/vitrine/${resumo.idOrganizacao}`
		: '';

	async function copiarLinkVitrine(): Promise<void> {
		if (!linkVitrine) {
			return;
		}
		try {
			await navigator.clipboard.writeText(linkVitrine);
			notificar.sucesso('Link da vitrine copiado');
		} catch {
			notificar.info({
				titulo: 'Copie o link da vitrine',
				mensagem: linkVitrine,
			});
		}
	}

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => navegar('/entrar', { replace: true }),
		});
	}

	const totalHorasSemana = resumo
		? resumo.gradeSemanal.reduce((acc, d) => acc + d.horasAbertas, 0)
		: 0;

	const pilares = resumo
		? [
				true,
				resumo.agendaConfigurada,
				resumo.totalServicosAtivos > 0,
				resumo.totalCategorias > 0,
			]
		: [];
	useEffect(() => {
		const timer = setInterval(() => {
			setMensagem(mensagemDoDia());
		}, INTERVALO_MENSAGEM_MS);
		return () => clearInterval(timer);
	}, []);
	const destaquesDoDia = [
		{ Icone: Coffee, texto: 'Pausa para um café' },
		{ Icone: CalendarDays, texto: 'Confira a agenda' },
		{ Icone: MessageCircle, texto: 'Responda os clientes' },
		{ Icone: Star, texto: 'Capriche no atendimento' },
	];
	const concluidos = pilares.filter(Boolean).length;
	const percentualProntidao =
		pilares.length > 0 ? Math.round((concluidos / pilares.length) * 100) : 0;

	const precisaAtivacao =
		resumo && (!resumo.agendaConfigurada || resumo.totalServicosAtivos === 0);

	const atalhos = [
		{
			titulo: 'Serviços',
			rota: '/servicos',
			Icone: Briefcase,
		},
		{
			titulo: 'Horários e agenda',
			rota: '/configuracoes?aba=atendimento',
			Icone: CalendarClock,
		},
		{
			titulo: 'Categorias',
			rota: '/configuracoes?aba=categorias',
			Icone: Tags,
		},
	] as const;

	return (
		<LayoutPainel
			itemAtivo="inicio"
			titulo={resumo ? resumo.nomeFantasia : `Olá, ${usuario?.nome ?? ''}`}
			descricao="Painel operacional com calendário, grade semanal e catálogo"
			empresa={{
				nome: resumo?.nomeFantasia ?? 'Sua empresa',
				detalhe: resumo?.endereco || 'Endereço não informado',
			}}
			acao={
				<div className="flex flex-wrap items-center gap-2 lg:mt-1.5">
					{resumo && (
						<Botao
							variante="outline"
							iconeEsquerda={Copy}
							onClick={() => void copiarLinkVitrine()}
							className="h-11"
						>
							Copiar vitrine
						</Botao>
					)}
					<Link to="/servicos">
						<Botao variante="primario" iconeEsquerda={Plus} className="h-11">
							Novo serviço
						</Botao>
					</Link>
				</div>
			}
			aoSair={encerrarSessao}
			saindo={sair.isPending}
		>
			{error ? (
				<div
					role="alert"
					className="rounded-2xl border border-cor-perigo/20 bg-cor-superficie p-6 text-sm text-cor-perigo"
				>
					<p className="font-semibold">
						Não foi possível carregar o resumo da empresa
					</p>
					<p className="mt-1 text-xs text-cor-fonte-secundaria">
						{obterMensagemErro(error)}
					</p>
				</div>
			) : isPending || !resumo ? (
				<div className="grid gap-4 lg:grid-cols-12">
					<div className="h-72 animate-pulse rounded-2xl bg-cor-superficie lg:col-span-4" />
					<div className="h-72 animate-pulse rounded-2xl bg-cor-superficie lg:col-span-4" />
					<div className="h-72 animate-pulse rounded-2xl bg-cor-superficie lg:col-span-4" />
					<div className="h-64 animate-pulse rounded-2xl bg-cor-superficie lg:col-span-12" />
				</div>
			) : (
				<div className="space-y-6">
					{/* Checklist de Ativação */}
					{precisaAtivacao && (
						<section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cor-alerta/30 bg-cor-alerta-fundo/60 px-5 py-4">
							<div className="flex items-start gap-3">
								<span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-cor-superficie text-cor-alerta">
									<AlertTriangle className="size-4" strokeWidth={1.75} />
								</span>
								<div>
									<h2 className="text-sm font-semibold text-cor-fonte-primaria">
										Complete a ativação da sua empresa
									</h2>
									<p className="mt-0.5 text-xs text-cor-fonte-secundaria">
										{!resumo.agendaConfigurada
											? 'Defina seus dias e horários de atendimento para liberar agendamentos.'
											: 'Cadastre pelo menos um serviço ativo para exibir sua vitrine pública.'}
									</p>
								</div>
							</div>
							<Link
								to={
									!resumo.agendaConfigurada
										? '/configuracoes?aba=atendimento'
										: '/servicos'
								}
							>
								<Botao variante="secundario" tamanho="pequeno">
									{!resumo.agendaConfigurada
										? 'Configurar horários'
										: 'Cadastrar serviço'}
								</Botao>
							</Link>
						</section>
					)}

					{/* Linha 1 do Bento Grid (3 colunas inspiradas na referência) */}
					<section className="grid gap-4 lg:grid-cols-12">
						{/* Coluna 1: Status + 2 Mini-Charts */}
						<div className="flex flex-col gap-4 lg:col-span-4">
							<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil">
								<h2 className="text-xl font-semibold text-cor-fonte-primaria">
									<BlurText
										text={`Olá, ${usuario?.nome?.trim().split(' ')[0] ?? ''}! `}
										delay={60}
										animateBy="words"
										direction="top"
										trigger="load"
									/>
								</h2>
								<p className="mt-1 text-sm text-cor-fonte-secundaria">{mensagem}</p>
								<FaixaDestaques itens={destaquesDoDia} />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-4 shadow-sutil">
									<p className="text-xl font-semibold text-cor-fonte-primaria tabular-nums">
										<CountUp
											to={resumo.totalServicosAtivos}
											duration={0.5}
											trigger="load"
										/>
									</p>
									<MiniGraficoLinha gradeSemanal={resumo.gradeSemanal} />
									<p className="mt-1 text-xs font-medium text-cor-fonte-secundaria">
										Serviços ativos
									</p>
								</div>

								<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-4 shadow-sutil">
									<p className="text-xl font-semibold text-cor-fonte-primaria tabular-nums">
										{totalHorasSemana.toFixed(0)}h
										<span className="text-xs font-normal text-cor-fonte-secundaria">
											/sem
										</span>
									</p>
									<MiniGraficoBarras gradeSemanal={resumo.gradeSemanal} />
									<p className="mt-1 text-xs font-medium text-cor-fonte-secundaria">
										Carga semanal
									</p>
								</div>
							</div>
						</div>

						{/* Coluna 2: Calendário Mensal de Atendimento */}
						<div className="lg:col-span-4">
							<CalendarioFuncionamento gradeSemanal={resumo.gradeSemanal} />
						</div>

						{/* Coluna 3: Informações, Gauge de Prontidão e Cartão da Vitrine */}
						<div className="flex flex-col justify-between gap-4 rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil lg:col-span-4">
							<div>
								<div className="flex items-center justify-between">
									<h2 className="text-sm font-semibold text-cor-fonte-primaria">
										Informações
									</h2>
									<Link
										to="/configuracoes"
										className="text-xs font-medium text-cor-primaria-escura hover:underline"
									>
										Ajustar
									</Link>
								</div>

								<div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-cor-fundo/70 p-3 text-center">
									<div>
										<p className="text-[11px] text-cor-fonte-secundaria">Categorias</p>
										<p className="mt-0.5 text-sm font-semibold text-cor-fonte-primaria tabular-nums">
											{resumo.totalCategorias}
										</p>
									</div>
									<div>
										<p className="text-[11px] text-cor-fonte-secundaria">Vagas/hora</p>
										<p className="mt-0.5 text-sm font-semibold text-cor-fonte-primaria tabular-nums">
											{resumo.capacidadeSimultanea}
										</p>
									</div>
									<div>
										<p className="text-[11px] text-cor-fonte-secundaria">Hoje</p>
										<p className="mt-0.5 text-sm font-semibold text-cor-fonte-primaria tabular-nums">
											0
										</p>
									</div>
								</div>

								<div className="mt-2">
									<GaugeProntidao
										percentual={percentualProntidao}
										concluidos={concluidos}
										total={pilares.length}
									/>
								</div>
							</div>

							<SpotlightCard
								theme="dark"
								spotlightColor="rgb(32 201 174)"
								intensity={0.25}
								className="!rounded-xl !bg-cor-secundaria !p-4 !shadow-none"
							>
								<div className="flex items-center justify-between gap-3">
									<div className="min-w-0">
										<p className="text-[11px] font-medium text-cor-primaria">
											Vitrine pública
										</p>
										<p className="mt-0.5 truncate text-xs text-cor-fonte-invertida-suave">
											{linkVitrine}
										</p>
									</div>
									<Link
										to={`/vitrine/${resumo.idOrganizacao}`}
										target="_blank"
										rel="noreferrer"
										aria-label="Abrir vitrine pública"
										className="grid size-8 shrink-0 place-items-center rounded-lg bg-cor-primaria text-cor-secundaria transition-colors hover:bg-cor-primaria-hover"
									>
										<ExternalLink className="size-3.5" strokeWidth={1.75} />
									</Link>
								</div>
							</SpotlightCard>
						</div>
					</section>

					{/* Linha 2 do Bento Grid: Donut de Categorias + Atalhos | Timeline Semanal */}
					<section className="grid gap-4 lg:grid-cols-12 lg:items-start">
						<div className="space-y-4 lg:col-span-4">
							<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil">
								<h2 className="mb-4 text-sm font-semibold text-cor-fonte-primaria">
									Catálogo por categoria
								</h2>
								<DonutCatalogo servicosPorCategoria={resumo.servicosPorCategoria} />
							</div>

							<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie shadow-sutil">
								<ul className="divide-y divide-cor-borda/70">
									{atalhos.map(({ titulo, rota, Icone }) => (
										<li key={rota}>
											<Link
												to={rota}
												className="flex items-center justify-between px-4 py-3 text-xs font-medium text-cor-fonte-primaria transition-colors hover:bg-cor-fundo/70"
											>
												<span className="flex items-center gap-2.5">
													<Icone
														className="size-4 text-cor-primaria-escura"
														strokeWidth={1.75}
													/>
													{titulo}
												</span>
												<ChevronRight
													className="size-4 text-cor-fonte-secundaria"
													strokeWidth={1.5}
												/>
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="lg:col-span-8">
							<TimelineExpediente gradeSemanal={resumo.gradeSemanal} />
						</div>
					</section>
				</div>
			)}
		</LayoutPainel>
	);
}
