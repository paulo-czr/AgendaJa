import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

export type ChartConfig = {
	[k in string]: {
		label?: React.ReactNode;
		color?: string;
	};
};

type ChartContextProps = {
	config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
	const context = React.useContext(ChartContext);
	if (!context) {
		throw new Error('useChart must be used within a <ChartContainer />');
	}
	return context;
}

export const ChartContainer = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<'div'> & {
		config: ChartConfig;
		children: React.ComponentProps<
			typeof RechartsPrimitive.ResponsiveContainer
		>['children'];
	}
>(({ id, className = '', children, config, ...props }, ref) => {
	const uniqueId = React.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

	const styleVars = React.useMemo(() => {
		const vars: Record<string, string> = {};
		for (const [key, item] of Object.entries(config)) {
			if (item.color) {
				vars[`--color-${key}`] = item.color;
			}
		}
		return vars as React.CSSProperties;
	}, [config]);

	return (
		<ChartContext.Provider value={{ config }}>
			<div
				data-chart={chartId}
				ref={ref}
				style={styleVars}
				className={`flex w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-cor-fonte-secundaria [&_.recharts-cartesian-grid_line]:stroke-cor-borda/70 [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-cor-fundo/80 [&_.recharts-surface]:outline-none ${className}`}
				{...props}
			>
				<RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
					{children}
				</RechartsPrimitive.ResponsiveContainer>
			</div>
		</ChartContext.Provider>
	);
});
ChartContainer.displayName = 'ChartContainer';

export const ChartTooltip = RechartsPrimitive.Tooltip;

interface PayloadTooltipItem {
	name?: string;
	dataKey?: string | number;
	value?: number | string;
	color?: string;
	payload?: Record<string, unknown>;
}

interface PropriedadesChartTooltipContent {
	active?: boolean;
	payload?: PayloadTooltipItem[];
	label?: string | number;
	hideLabel?: boolean;
	unitLabel?: string;
	formatValue?: (value: number | string) => string;
}

export function ChartTooltipContent({
	active,
	payload,
	label,
	hideLabel = false,
	unitLabel = '',
	formatValue,
}: PropriedadesChartTooltipContent) {
	const { config } = useChart();

	if (!active || !payload?.length) {
		return null;
	}

	return (
		<div className="min-w-[140px] rounded-xl border border-cor-borda bg-cor-superficie px-3 py-2 text-xs shadow-flutuante">
			{!hideLabel && label !== undefined && (
				<p className="mb-1.5 font-semibold text-cor-fonte-primaria">{label}</p>
			)}
			<div className="space-y-1">
				{payload.map((item, indice) => {
					const chave = String(item.dataKey ?? item.name ?? indice);
					const itemConfig = config[chave];
					const cor = itemConfig?.color || item.color || 'rgb(var(--cor-primaria))';
					const rotulo = itemConfig?.label ?? item.name ?? chave;
					const valorFormatado =
						formatValue && item.value !== undefined
							? formatValue(item.value)
							: `${item.value ?? ''}${unitLabel}`;

					return (
						<div
							key={`${chave}-${indice}`}
							className="flex items-center justify-between gap-4"
						>
							<span className="flex items-center gap-2 text-cor-fonte-secundaria">
								<span
									className="size-2 shrink-0 rounded-[2px]"
									style={{ backgroundColor: cor }}
								/>
								{rotulo}
							</span>
							<span className="font-semibold text-cor-fonte-primaria tabular-nums">
								{valorFormatado}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
