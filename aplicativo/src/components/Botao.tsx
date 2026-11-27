import React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

export type VarianteBotao =
	'primario' | 'secundario' | 'outline' | 'ghost' | 'perigo';

export type TamanhoBotao = 'pequeno' | 'medio' | 'grande';

export interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variante?: VarianteBotao;
	tamanho?: TamanhoBotao;
	iconeEsquerda?: LucideIcon;
	iconeDireita?: LucideIcon;
	carregando?: boolean;
	larguraTotal?: boolean;
}

const estilosVariantes: Record<VarianteBotao, string> = {
	primario:
		'bg-cor-primaria text-cor-secundaria font-semibold shadow-sutil hover:shadow-md hover:bg-cor-primaria-hover focus-visible:ring-cor-primaria',
	secundario:
		'bg-cor-secundaria text-cor-fonte-invertida font-semibold shadow-sutil hover:shadow-md hover:bg-cor-secundaria-suave focus-visible:ring-cor-secundaria',
	outline:
		'border border-cor-borda bg-cor-superficie text-cor-fonte-primaria font-medium hover:bg-cor-fundo focus-visible:ring-cor-primaria',
	ghost:
		'bg-transparent text-cor-fonte-secundaria font-medium hover:bg-cor-superficie-neutra hover:text-cor-fonte-primaria focus-visible:ring-cor-primaria',
	perigo:
		'bg-cor-perigo text-cor-fonte-invertida font-semibold shadow-sutil hover:shadow-md hover:bg-cor-perigo/90 focus-visible:ring-cor-perigo',
};

const estilosTamanhos: Record<
	TamanhoBotao,
	{ container: string; tamanhoIcone: number }
> = {
	pequeno: {
		container: 'h-8 px-3 text-xs rounded-lg gap-1.5',
		tamanhoIcone: 14,
	},
	medio: {
		container: 'h-10 px-4 text-[13px] rounded-lg gap-2',
		tamanhoIcone: 16,
	},
	grande: {
		container: 'h-12 px-6 text-sm rounded-xl gap-2.5',
		tamanhoIcone: 18,
	},
};

/**
 * Botão padronizado do AgendaJá com variantes semânticas, suporte a ícones
 * `lucide-react`, estado de carregamento acessível e foco visível.
 */
export const Botao = React.forwardRef<HTMLButtonElement, BotaoProps>(
	(
		{
			variante = 'primario',
			tamanho = 'medio',
			iconeEsquerda: IconeEsquerda,
			iconeDireita: IconeDireita,
			carregando = false,
			larguraTotal = false,
			disabled,
			type = 'button',
			className = '',
			children,
			...props
		},
		ref,
	) => {
		const estaDesabilitado = disabled || carregando;
		const { container, tamanhoIcone } = estilosTamanhos[tamanho];

		const classesFinais = [
			'group inline-flex items-center justify-center whitespace-nowrap',
			'transition-[background-color,color,box-shadow,transform] duration-200 ease-out [touch-action:manipulation]',
			'enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:scale-[0.98]',
			'motion-reduce:transition-none motion-reduce:transform-none',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cor-fundo',
			'disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
			estilosVariantes[variante],
			container,
			larguraTotal ? 'w-full' : '',
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<button
				ref={ref}
				type={type}
				disabled={estaDesabilitado}
				aria-busy={carregando || undefined}
				className={classesFinais}
				{...props}
			>
				{carregando ? (
					<Loader2
						size={tamanhoIcone}
						strokeWidth={1.75}
						className="shrink-0 animate-spin"
						aria-hidden="true"
					/>
				) : (
					IconeEsquerda && (
						<IconeEsquerda
							size={tamanhoIcone}
							strokeWidth={1.5}
							className="shrink-0"
							aria-hidden="true"
						/>
					)
				)}

				{children && <span>{children}</span>}

				{!carregando && IconeDireita && (
					<IconeDireita
						size={tamanhoIcone}
						strokeWidth={1.5}
						className="shrink-0"
						aria-hidden="true"
					/>
				)}
			</button>
		);
	},
);

Botao.displayName = 'Botao';
