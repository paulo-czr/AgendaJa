import type { InputHTMLAttributes, ReactNode } from 'react';

interface PropriedadesCampoTexto
	extends InputHTMLAttributes<HTMLInputElement> {
	rotulo: string;
	icone?: ReactNode;
}

export function CampoTexto({
	rotulo,
	id,
	icone,
	className = '',
	...propriedades
}: PropriedadesCampoTexto) {
	return (
		<label
			className="block space-y-2 text-xs font-medium text-cor-fonte-primaria"
			htmlFor={id}
		>
			{rotulo}
			<div className="relative">
				{icone && (
					<span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-cor-fonte-secundaria">
						{icone}
					</span>
				)}
				<input
					id={id}
					className={`h-11 w-full rounded-lg border border-cor-borda bg-cor-fundo px-3 text-[13px] text-cor-fonte-primaria transition-colors placeholder:text-cor-fonte-secundaria focus:border-cor-primaria focus:bg-cor-superficie focus:outline-none focus:ring-2 focus:ring-cor-primaria/20 ${icone ? 'pl-9' : ''} ${className}`}
					{...propriedades}
				/>
			</div>
		</label>
	);
}
