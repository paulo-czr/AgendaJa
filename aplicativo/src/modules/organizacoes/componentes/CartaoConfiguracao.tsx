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
 * Estilizado com as variáveis de identidade visual hierárquicas.
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
			className={`rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil sm:p-6 ${className}`}
		>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold leading-6 text-cor-fonte-primaria text-balance">
						{titulo}
					</h2>
					<p className="mt-1 text-xs leading-5 text-cor-fonte-secundaria">{descricao}</p>
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
 * - Foco acessível via :focus-visible com cor-primaria
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
				<label htmlFor={id} className="block text-xs font-medium text-cor-fonte-primaria">
					{rotulo}
				</label>
				{complementoRotulo}
			</div>
			<input
				id={id}
				name={name ?? id}
				aria-invalid={erro ? true : undefined}
				aria-describedby={descricoes}
				className={`mt-2 h-11 w-full rounded-lg border px-3.5 text-[13px] text-cor-fonte-primaria transition-colors placeholder:text-cor-fonte-secundaria read-only:cursor-default read-only:bg-cor-superficie-neutra/70 read-only:text-cor-fonte-secundaria focus-visible:bg-cor-superficie focus-visible:outline-none focus-visible:ring-2 read-only:focus-visible:border-cor-borda read-only:focus-visible:bg-cor-superficie-neutra/70 read-only:focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-60 ${tabular ? 'tabular-nums' : ''
					} ${erro
						? 'border-cor-perigo bg-cor-perigo-fundo/40 focus-visible:border-cor-perigo focus-visible:ring-cor-perigo/25'
						: 'border-cor-borda bg-cor-fundo focus-visible:border-cor-primaria focus-visible:ring-cor-primaria/25'
					}`}
				{...propriedades}
			/>
			{erro ? (
				<p
					id={idErro}
					role="alert"
					className="mt-1.5 text-[11px] font-medium leading-4 text-cor-perigo"
				>
					{erro}
				</p>
			) : (
				ajuda && (
					<p id={idAjuda} className="mt-1.5 text-[11px] leading-4 text-cor-fonte-secundaria">
						{ajuda}
					</p>
				)
			)}
		</div>
	);
}
