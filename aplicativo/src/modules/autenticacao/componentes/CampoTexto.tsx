import type { InputHTMLAttributes } from 'react';

interface PropriedadesCampoTexto
	extends InputHTMLAttributes<HTMLInputElement> {
	rotulo: string;
}

export function CampoTexto({
	rotulo,
	id,
	className = '',
	...propriedades
}: PropriedadesCampoTexto) {
	return (
		<label className="block space-y-2 text-sm font-medium text-slate-700" htmlFor={id}>
			{rotulo}
			<input
				id={id}
				className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-slate-900 transition placeholder:text-slate-400 focus:border-marca-500 focus:outline-none ${className}`}
				{...propriedades}
			/>
		</label>
	);
}
