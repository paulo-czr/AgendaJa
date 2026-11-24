import type { InputHTMLAttributes, ReactNode } from 'react';

interface PropriedadesCartaoConfiguracao {
	titulo: string;
	descricao: string;
	acaoCabecalho?: ReactNode;
	children: ReactNode;
	className?: string;
}

/**
 * Cartão branco das Configurações: raio de 16px (rounded-2xl), borda sutil,
 * padding de 24px na grade de 4px e cabeçalho com opção de ação contextual.
 */
export function CartaoConfiguracao({
	titulo,
	descricao,
	acaoCabecalho,
	children,
	className = '',
}: PropriedadesCartaoConfiguracao) {
	return (
		<section
			className={`rounded-2xl border border-borda/80 bg-white p-5 shadow-[0_1px_2px_rgba(14,41,57,0.04)] sm:p-6 ${className}`}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold leading-6 text-tinta text-balance">
						{titulo}
					</h2>
					<p className="mt-1 text-xs leading-5 text-tinta-suave">{descricao}</p>
				</div>
				{acaoCabecalho}
			</div>
			<div className="mt-6">{children}</div>
		</section>
	);
}

interface PropriedadesCampoConfiguracao
	extends InputHTMLAttributes<HTMLInputElement> {
	rotulo: string;
	complementoRotulo?: ReactNode;
	ajuda?: string;
	erro?: string;
	tabular?: boolean;
}

/**
 * Campo padronizado na grade de 4px:
 * - Altura de 44px (h-11) e raio de 8px (rounded-lg, aninhado ao cartão de 16px)
 * - Foco acessível via :focus-visible
 * - Vínculo semântico aria-invalid e aria-describedby para erro e ajuda
 */
export function CampoConfiguracao({
	rotulo,
	complementoRotulo,
	ajuda,
	erro,
	tabular = false,
	id,
	name,
	className = '',
	...propriedades
}: PropriedadesCampoConfiguracao) {
	const idErro = id && erro ? `${id}-erro` : undefined;
	const idAjuda = id && ajuda ? `${id}-ajuda` : undefined;
	const descricoes = [idErro, idAjuda].filter(Boolean).join(' ') || undefined;

	return (
		<div className={className}>
			<div className="flex items-center justify-between gap-2">
				<label htmlFor={id} className="block text-xs font-medium text-tinta">
					{rotulo}
				</label>
				{complementoRotulo}
			</div>
			<input
				id={id}
				name={name ?? id}
				aria-invalid={erro ? true : undefined}
				aria-describedby={descricoes}
				className={`mt-2 h-11 w-full rounded-lg border px-3.5 text-[13px] text-tinta transition-colors placeholder:text-tinta-suave read-only:cursor-default read-only:bg-superficie-neutra/70 read-only:text-tinta-suave focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 read-only:focus-visible:border-borda read-only:focus-visible:bg-superficie-neutra/70 read-only:focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${
					tabular ? 'tabular-nums' : ''
				} ${
					erro
						? 'border-perigo bg-perigo-fundo/40 focus-visible:border-perigo focus-visible:ring-perigo/25'
						: 'border-borda bg-superficie focus-visible:border-marca-500 focus-visible:ring-marca-500/25'
				}`}
				{...propriedades}
			/>
			{erro ? (
				<p
					id={idErro}
					role="alert"
					className="mt-1.5 text-[11px] font-medium leading-4 text-perigo"
				>
					{erro}
				</p>
			) : (
				ajuda && (
					<p id={idAjuda} className="mt-1.5 text-[11px] leading-4 text-tinta-suave">
						{ajuda}
					</p>
				)
			)}
		</div>
	);
}
