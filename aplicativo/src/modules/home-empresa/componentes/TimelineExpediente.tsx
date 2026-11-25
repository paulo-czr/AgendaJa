import type { ResumoDiaAgenda } from '../servicos/resumoEmpresa.service';

interface PropriedadesTimelineExpediente {
	gradeSemanal: ResumoDiaAgenda[];
}

const DIAS_ORDEM_DOM_SAB = [
	{ numero: 0, nome: 'Domingo' },
	{ numero: 1, nome: 'Segunda' },
	{ numero: 2, nome: 'Terça' },
	{ numero: 3, nome: 'Quarta' },
	{ numero: 4, nome: 'Quinta' },
	{ numero: 5, nome: 'Sexta' },
	{ numero: 6, nome: 'Sábado' },
] as const;

const MARCOS_HORA = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] as const;
const INICIO_DIA_MIN = 6 * 60;
const FIM_DIA_MIN = 22 * 60;
const AMPLITUDE_MIN = FIM_DIA_MIN - INICIO_DIA_MIN;

function paraMinutos(horario: string | null): number {
	if (!horario) {
		return 0;
	}
	const [horas, minutos] = horario.split(':').map(Number);
	return (horas || 0) * 60 + (minutos || 0);
}

function calcularPosicao(inicio: string | null, fim: string | null) {
	const minInicio = Math.max(INICIO_DIA_MIN, paraMinutos(inicio));
	const minFim = Math.min(FIM_DIA_MIN, paraMinutos(fim));
	const esquerda = ((minInicio - INICIO_DIA_MIN) / AMPLITUDE_MIN) * 100;
	const largura = Math.max(
		6,
		((Math.max(minInicio, minFim) - minInicio) / AMPLITUDE_MIN) * 100,
	);
	return { esquerda, largura };
}

/**
 * Linha do tempo semanal inspirada em agendas operacionais modernas:
 * mostra as janelas de expediente (e pausa) de Domingo a Sábado entre 06h e 22h.
 */
export function TimelineExpediente({
	gradeSemanal,
}: PropriedadesTimelineExpediente) {
	const diaAtual = new Date().getDay();

	return (
		<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-6 shadow-sutil">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold text-cor-fonte-primaria">
						Grade semanal de atendimento
					</h2>
					<p className="mt-0.5 text-xs text-cor-fonte-secundaria">
						Janelas de expediente configuradas por dia da semana
					</p>
				</div>
				<div className="flex items-center gap-4 text-[11px] text-cor-fonte-secundaria">
					<span className="inline-flex items-center gap-1.5">
						<span className="h-2 w-4 rounded-full bg-cor-secundaria" />
						Dia atual
					</span>
					<span className="inline-flex items-center gap-1.5">
						<span className="h-2 w-4 rounded-full bg-cor-primaria" />
						Expediente ativo
					</span>
				</div>
			</div>

			<div className="mt-6">
				<div className="relative space-y-3">
					{/* Linhas verticais tracejadas */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-y-0 left-20 right-0 grid grid-cols-6"
					>
						{MARCOS_HORA.map((hora) => (
							<div
								key={hora}
								className="border-l border-dashed border-cor-borda/70"
							/>
						))}
					</div>

					{DIAS_ORDEM_DOM_SAB.map((dia) => {
						const config = gradeSemanal.find((g) => g.diaSemana === dia.numero);
						const ativo = Boolean(config?.ativo && config.horarioAbertura);
						const ehHoje = dia.numero === diaAtual;
						const { esquerda, largura } = ativo
							? calcularPosicao(
									config?.horarioAbertura ?? null,
									config?.horarioFechamento ?? null,
								)
							: { esquerda: 0, largura: 0 };

						return (
							<div
								key={dia.numero}
								className="relative flex h-7 items-center gap-3"
							>
								<span
									className={`w-20 shrink-0 text-xs ${
										ehHoje
											? 'font-semibold text-cor-fonte-primaria'
											: ativo
												? 'font-medium text-cor-fonte-primaria'
												: 'text-cor-fonte-secundaria/60'
									}`}
								>
									{dia.nome}
								</span>

								<div className="relative h-full flex-1">
									{ativo ? (
										<div
											className={`absolute top-0.5 flex h-6 items-center justify-between rounded-full px-3 text-[11px] font-medium tabular-nums shadow-sutil ${
												ehHoje
													? 'bg-cor-secundaria text-cor-fonte-invertida'
													: 'bg-cor-primaria text-cor-secundaria'
											}`}
											style={{
												left: `${esquerda}%`,
												width: `${largura}%`,
											}}
											title={
												config?.inicioPausa && config?.fimPausa
													? `${config.horarioAbertura}–${config.horarioFechamento} (Pausa ${config.inicioPausa}–${config.fimPausa})`
													: `${config?.horarioAbertura}–${config?.horarioFechamento}`
											}
										>
											<span className="truncate">
												{config?.horarioAbertura} – {config?.horarioFechamento}
											</span>
											{config?.inicioPausa && config?.fimPausa && largura > 28 && (
												<span
													className={`ml-2 hidden text-[10px] sm:inline ${
														ehHoje
															? 'text-cor-fonte-invertida-suave'
															: 'text-cor-secundaria/80'
													}`}
												>
													pausa {config.inicioPausa}–{config.fimPausa}
												</span>
											)}
										</div>
									) : (
										<span className="inline-flex h-6 items-center text-[11px] text-cor-fonte-secundaria/60">
											Fechado
										</span>
									)}
								</div>
							</div>
						);
					})}
				</div>

				{/* Eixo de horas */}
				<div className="mt-3 flex pl-20">
					<div className="grid flex-1 grid-cols-6 text-[11px] text-cor-fonte-secundaria tabular-nums">
						{MARCOS_HORA.map((hora) => (
							<span key={hora}>{hora}</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
