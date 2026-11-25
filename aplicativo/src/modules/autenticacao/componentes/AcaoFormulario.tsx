import type { ButtonHTMLAttributes } from 'react';
import { Botao } from '../../../components/Botao';

interface PropriedadesAcaoFormulario
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	carregando?: boolean;
}

export function AcaoFormulario({
	children,
	carregando = false,
	disabled,
	className = '',
	...propriedades
}: PropriedadesAcaoFormulario) {
	return (
		<Botao
			variante="primario"
			larguraTotal
			carregando={carregando}
			disabled={disabled}
			className={`h-11 ${className}`}
			{...propriedades}
		>
			{carregando ? 'Aguarde...' : children}
		</Botao>
	);
}
