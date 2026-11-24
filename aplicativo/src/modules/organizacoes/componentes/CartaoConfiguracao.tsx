import type { InputHTMLAttributes, ReactNode } from 'react';

interface PropriedadesCartaoConfiguracao {
	titulo: string;
	descricao: string;
	children: ReactNode;
	className?: string;
}

/** Cartão branco das Configurações (título 18px + descrição), conforme o Figma. */
export function CartaoConfiguracao({
	titulo,
	descricao,
	children,
	className = '',
}: PropriedadesCartaoConfiguracao) {
	return (
		<section className={`rounded-[14px] bg-white p-5 sm:p-6 ${className}`}>
			<h2 className="text-lg font-bold text-tinta">{titulo}</h2>
			<p className="mt-2 text-xs text-tinta-suave">{descricao}</p>
			<div className="mt-7">{children}</div>
		</section>
	);
}

interface PropriedadesCampoConfiguracao
	extends InputHTMLAttributes<HTMLInputElement> {
	rotulo: string;
	ajuda?: string;
}

/** Campo com rótulo (12px) e caixa de 46px no padrão dos cartões. */
export function CampoConfiguracao({
	rotulo,
	ajuda,
	id,
	className = '',
	...propriedades
}: PropriedadesCampoConfiguracao) {
	return (
		<div className={className}>
			<label htmlFor={id} className="block text-xs font-medium text-tinta">
				{rotulo}
			</label>
			<input
				id={id}
				className="mt-3 h-[46px] w-full rounded-lg border border-borda bg-superficie px-3 text-[13px] text-tinta transition placeholder:text-tinta-suave read-only:cursor-default read-only:text-tinta-suave focus:border-marca-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-marca-500/25 read-only:focus:border-borda read-only:focus:bg-superficie read-only:focus:ring-0"
				{...propriedades}
			/>
			{ajuda && <p className="mt-2 text-[11px] text-tinta-suave">{ajuda}</p>}
		</div>
	);
}
