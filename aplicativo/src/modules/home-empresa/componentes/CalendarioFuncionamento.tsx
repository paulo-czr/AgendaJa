import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ResumoDiaAgenda } from '../servicos/resumoEmpresa.service';

interface PropriedadesCalendarioFuncionamento {
	gradeSemanal: ResumoDiaAgenda[];
}

const NOMES_MESES = [
	'Janeiro',
	'Fevereiro',
	'Março',
	'Abril',
	'Maio',
	'Junho',
	'Julho',
	'Agosto',
	'Setembro',
	'Outubro',
	'Novembro',
	'Dezembro',
] as const;

const SIGLAS_DOM_SAB = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

export function CalendarioFuncionamento({
	gradeSemanal,
}: PropriedadesCalendarioFuncionamento) {
	const hoje = useMemo(() => new Date(), []);
	const [mesReferencia, definirMesReferencia] = useState(
		() => new Date(hoje.getFullYear(), hoje.getMonth(), 1),
	);

	const diasAtivosSet = useMemo(
		() =>
			new Set(
				gradeSemanal.filter((dia) => dia.ativo).map((dia) => dia.diaSemana),
			),
		[gradeSemanal],
	);

	const celulas = useMemo(() => {
		const ano = mesReferencia.getFullYear();
		const mes = mesReferencia.getMonth();
		const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
		const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
		const totalDiasAnterior = new Date(ano, mes, 0).getDate();

		const lista: Array<{
			dia: number;
			mesAtual: boolean;
			ehHoje: boolean;
			atende: boolean;
		}> = [];

		for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
			lista.push({
				dia: totalDiasAnterior - i,
				mesAtual: false,
				ehHoje: false,
				atende: false,
			});
		}

		for (let dia = 1; dia <= totalDiasMes; dia++) {
			const data = new Date(ano, mes, dia);
			const ehHoje =
				data.getDate() === hoje.getDate() &&
				data.getMonth() === hoje.getMonth() &&
				data.getFullYear() === hoje.getFullYear();
			lista.push({
				dia,
				mesAtual: true,
				ehHoje,
				atende: diasAtivosSet.has(data.getDay()),
			});
		}

		const restante = (7 - (lista.length % 7)) % 7;
		for (let dia = 1; dia <= restante; dia++) {
			lista.push({
				dia,
				mesAtual: false,
				ehHoje: false,
				atende: false,
			});
		}

		return lista;
	}, [mesReferencia, hoje, diasAtivosSet]);

	function mudarMes(delta: number): void {
		definirMesReferencia(
			(atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1),
		);
	}

	return (
		<section className="flex h-full flex-col justify-between rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil">
			<div>
				<div className="flex items-center justify-between gap-2">
					<h2 className="text-sm font-semibold text-cor-fonte-primaria">
						Calendário
					</h2>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => mudarMes(-1)}
							aria-label="Mês anterior"
							className="grid size-7 place-items-center rounded-lg border border-cor-borda text-cor-fonte-secundaria transition-colors hover:bg-cor-fundo hover:text-cor-fonte-primaria"
						>
							<ChevronLeft className="size-3.5" strokeWidth={1.75} />
						</button>
						<span className="min-w-[108px] text-center text-xs font-medium text-cor-fonte-primaria">
							{NOMES_MESES[mesReferencia.getMonth()]}{' '}
							{mesReferencia.getFullYear()}
						</span>
						<button
							type="button"
							onClick={() => mudarMes(1)}
							aria-label="Próximo mês"
							className="grid size-7 place-items-center rounded-lg border border-cor-borda text-cor-fonte-secundaria transition-colors hover:bg-cor-fundo hover:text-cor-fonte-primaria"
						>
							<ChevronRight className="size-3.5" strokeWidth={1.75} />
						</button>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-7 gap-1 text-center">
					{SIGLAS_DOM_SAB.map((sigla, indice) => (
						<span
							key={sigla}
							className={`pb-1.5 text-[11px] font-medium ${
								diasAtivosSet.has(indice)
									? 'text-cor-primaria-escura'
									: 'text-cor-fonte-secundaria/70'
							}`}
						>
							{sigla}
						</span>
					))}

					{celulas.map((celula, idx) => (
						<div
							key={idx}
							className="flex h-8 items-center justify-center text-xs tabular-nums"
						>
							<span
								className={`grid size-7 place-items-center rounded-full transition-colors ${
									celula.ehHoje
										? 'bg-cor-primaria font-semibold text-cor-secundaria'
										: celula.mesAtual
											? celula.atende
												? 'font-medium text-cor-fonte-primaria'
												: 'text-cor-fonte-secundaria/45'
											: 'text-cor-fonte-secundaria/25'
								}`}
							>
								{celula.dia}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="mt-3 flex items-center justify-between border-t border-cor-borda/60 pt-3 text-[11px] text-cor-fonte-secundaria">
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-cor-primaria" />
					Hoje
				</span>
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-cor-fonte-primaria" />
					Dias com atendimento
				</span>
			</div>
		</section>
	);
}
