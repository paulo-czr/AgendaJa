import type { ButtonHTMLAttributes } from 'react';

interface PropriedadesAcaoFormulario
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	carregando?: boolean;
}

export function AcaoFormulario({
	children,
	carregando = false,
	disabled,
	...propriedades
}: PropriedadesAcaoFormulario) {
	return (
		<button
			className="flex h-11 w-full items-center justify-center rounded-lg bg-marca-500 px-4 text-[13px] font-semibold text-petroleo transition hover:bg-marca-600 disabled:cursor-not-allowed disabled:opacity-60"
			disabled={disabled || carregando}
			{...propriedades}
		>
			{carregando ? 'Aguarde...' : children}
		</button>
	);
}
