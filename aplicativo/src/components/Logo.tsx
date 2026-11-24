import { icones } from '../assets/icones';

interface PropriedadesLogo {
	/** `claro` para fundos escuros (menu lateral); `escuro` para fundos claros. */
	variante?: 'claro' | 'escuro';
	className?: string;
}

/** Marca do AgendaJá conforme o Figma: selo verde-água + "Agenda" + "Já". */
export function Logo({ variante = 'escuro', className = '' }: PropriedadesLogo) {
	const corTexto = variante === 'claro' ? 'text-white' : 'text-tinta';

	return (
		<span className={`inline-flex items-center gap-2.5 ${className}`}>
			<span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-marca-500">
				<img src={icones.marcaCalendario} alt="" width={18} height={18} />
			</span>
			<span className={`text-[22px] font-bold leading-none ${corTexto}`}>
				Agenda<span className="text-marca-500">Já</span>
			</span>
		</span>
	);
}
