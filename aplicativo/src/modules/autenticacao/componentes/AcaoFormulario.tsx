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
			className="flex w-full items-center justify-center rounded-xl bg-marca-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-marca-700 disabled:cursor-not-allowed disabled:opacity-60"
			disabled={disabled || carregando}
			{...propriedades}
		>
			{carregando ? 'Aguarde...' : children}
		</button>
	);
}
