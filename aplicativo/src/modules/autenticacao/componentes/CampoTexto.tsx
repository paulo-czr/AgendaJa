import type { InputHTMLAttributes } from 'react';

interface PropriedadesCampoTexto
	extends InputHTMLAttributes<HTMLInputElement> {
	rotulo: string;
}

/** Campo no padrão do formulário de agendamento do Figma. */
export function CampoTexto({
	rotulo,
	id,
	className = '',
	...propriedades
}: PropriedadesCampoTexto) {
	return (
		<label className="block space-y-2 text-xs font-medium text-tinta" htmlFor={id}>
			{rotulo}
			<input
				id={id}
				className={`h-11 w-full rounded-lg border border-borda bg-superficie px-3 text-[13px] text-tinta transition placeholder:text-tinta-suave focus:border-marca-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-marca-500/25 ${className}`}
				{...propriedades}
			/>
		</label>
	);
}
