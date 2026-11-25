import {
	Bar,
	BarChart,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
} from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '../../../components/ui/chart';
import { DIAS_SEMANA } from '../../organizacoes/formulario';
import type {
	ResumoCategoriaCatalogo,
	ResumoDiaAgenda,
} from '../servicos/resumoEmpresa.service';

const configMini = {
	horas: { label: 'Horas', color: 'rgb(var(--cor-primaria))' },
} satisfies ChartConfig;

const configDonut = {
	totalServicos: { label: 'Serviços', color: 'rgb(var(--cor-primaria))' },
} satisfies ChartConfig;

const CORES_DONUT = [
	'rgb(var(--cor-primaria))',
	'rgb(var(--cor-secundaria))',
	'rgb(var(--cor-primaria-escura))',
	'rgb(var(--cor-fonte-secundaria))',
];

export function MiniGraficoLinha({
	gradeSemanal,
}: {
	gradeSemanal: ResumoDiaAgenda[];
}) {
	const dados = DIAS_SEMANA.map((dia) => {
		const item = gradeSemanal.find((g) => g.diaSemana === dia.numero);
		return {
			sigla: dia.sigla,
			horas: item?.ativo ? item.horasAbertas : 0,
		};
	});

	return (
		<ChartContainer config={configMini} className="h-14 w-full">
			<LineChart data={dados} margin={{ top: 6, right: 6, left: 6, bottom: 2 }}>
				<Line
					type="monotone"
					dataKey="horas"
					stroke="rgb(var(--cor-secundaria))"
					strokeWidth={2}
					dot={{ r: 2.5, fill: 'rgb(var(--cor-superficie))', strokeWidth: 2 }}
				/>
			</LineChart>
		</ChartContainer>
	);
}

export function MiniGraficoBarras({
	gradeSemanal,
}: {
	gradeSemanal: ResumoDiaAgenda[];
}) {
	const dados = DIAS_SEMANA.map((dia) => {
		const item = gradeSemanal.find((g) => g.diaSemana === dia.numero);
		return {
			sigla: dia.sigla,
			ativo: item?.ativo ?? false,
			horas: item?.ativo ? item.horasAbertas : 0,
		};
	});

	return (
		<ChartContainer config={configMini} className="h-14 w-full">
			<BarChart data={dados} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
				<Bar
					dataKey="horas"
					radius={[4, 4, 4, 4]}
					barSize={7}
					background={{ fill: 'rgb(var(--cor-fundo))', radius: 4 }}
				>
					{dados.map((item) => (
						<Cell
							key={item.sigla}
							fill={
								item.ativo
									? 'rgb(var(--cor-primaria))'
									: 'rgb(var(--cor-superficie-neutra))'
							}
						/>
					))}
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}

export function GaugeProntidao({
	percentual,
	concluidos,
	total,
}: {
	percentual: number;
	concluidos: number;
	total: number;
}) {
	const dados = [
		{ nome: 'Ativo', valor: percentual },
		{ nome: 'Restante', valor: Math.max(0, 100 - percentual) },
	];

	return (
		<div className="relative flex flex-col items-center">
			<ChartContainer config={configMini} className="h-24 w-44">
				<PieChart>
					<Pie
						data={dados}
						dataKey="valor"
						startAngle={180}
						endAngle={0}
						cx="50%"
						cy="85%"
						innerRadius={52}
						outerRadius={68}
						stroke="none"
						cornerRadius={6}
					>
						<Cell fill="rgb(var(--cor-primaria))" />
						<Cell fill="rgb(var(--cor-fundo))" />
					</Pie>
				</PieChart>
			</ChartContainer>
			<div className="-mt-8 text-center">
				<p className="text-lg font-semibold text-cor-fonte-primaria tabular-nums">
					{percentual}%
				</p>
				<p className="text-[11px] text-cor-fonte-secundaria tabular-nums">
					{concluidos} de {total} etapas ativas
				</p>
			</div>
		</div>
	);
}

export function DonutCatalogo({
	servicosPorCategoria,
}: {
	servicosPorCategoria: ResumoCategoriaCatalogo[];
}) {
	const total = servicosPorCategoria.reduce(
		(acc, item) => acc + item.totalServicos,
		0,
	);

	if (servicosPorCategoria.length === 0) {
		return (
			<p className="rounded-xl border border-dashed border-cor-borda bg-cor-fundo/60 p-4 text-center text-xs text-cor-fonte-secundaria">
				Cadastre serviços para visualizar a distribuição.
			</p>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4 sm:flex-row">
			<div className="relative size-36 shrink-0">
				<ChartContainer config={configDonut} className="h-36 w-36">
					<PieChart>
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									formatValue={(valor) =>
										`${valor} ${Number(valor) === 1 ? 'serviço' : 'serviços'}`
									}
								/>
							}
						/>
						<Pie
							data={servicosPorCategoria}
							dataKey="totalServicos"
							nameKey="nome"
							innerRadius={42}
							outerRadius={60}
							paddingAngle={3}
							stroke="none"
						>
							{servicosPorCategoria.map((item, indice) => (
								<Cell
									key={item.nome}
									fill={CORES_DONUT[indice % CORES_DONUT.length]}
								/>
							))}
						</Pie>
					</PieChart>
				</ChartContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-lg font-semibold text-cor-fonte-primaria tabular-nums">
						{total}
					</span>
					<span className="text-[10px] text-cor-fonte-secundaria">ativos</span>
				</div>
			</div>

			<ul className="w-full flex-1 space-y-2 text-xs">
				{servicosPorCategoria.map((item, indice) => (
					<li
						key={item.nome}
						className="flex items-center justify-between gap-2"
					>
						<span className="flex min-w-0 items-center gap-2 text-cor-fonte-primaria">
							<span
								className="size-2 shrink-0 rounded-full"
								style={{
									backgroundColor: CORES_DONUT[indice % CORES_DONUT.length],
								}}
							/>
							<span className="truncate">{item.nome}</span>
						</span>
						<span className="shrink-0 font-medium text-cor-fonte-secundaria tabular-nums">
							{item.totalServicos}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
