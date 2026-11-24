export type NomeIconeMenu =
	| 'inicio'
	| 'agendamentos'
	| 'clientes'
	| 'servicos'
	| 'configuracoes';

interface PropriedadesIconeMenu {
	nome: NomeIconeMenu;
	/** Item selecionado: o ícone inteiro assume a cor do texto (azul-petróleo). */
	ativo?: boolean;
	className?: string;
}

const COR_DESTAQUE = '#20C9AE';

/**
 * Ícones do menu lateral exportados do Figma (20px). Ficam em SVG inline para
 * herdar a cor do texto (`currentColor`) e trocar de cor no item ativo.
 */
export function IconeMenu({ nome, ativo = false, className = '' }: PropriedadesIconeMenu) {
	const destaque = ativo ? 'currentColor' : COR_DESTAQUE;
	const comum = {
		className: `w-[18px] shrink-0 ${className}`,
		fill: 'none',
		'aria-hidden': true,
	} as const;

	switch (nome) {
		case 'inicio':
			return (
				<svg viewBox="0 0 18 16.52" {...comum}>
					<path d="M12.6 0.32H15.3V5.72H12.6V0.32Z" fill={destaque} />
					<path
						d="M0 7.07L8.1 0.32C8.36 0.11 8.67 0 9 0C9.33 0 9.64 0.11 9.9 0.32L18 7.07L16.2 8.87L14.85 7.79V15.62C14.85 15.85 14.76 16.08 14.59 16.25C14.42 16.42 14.19 16.52 13.95 16.52H10.8V10.22H7.2V16.52H4.05C3.81 16.52 3.58 16.42 3.41 16.25C3.24 16.08 3.15 15.85 3.15 15.62V7.79L1.8 8.87L0 7.07Z"
						fill="currentColor"
					/>
				</svg>
			);
		case 'agendamentos':
			return (
				<svg viewBox="0 0 18 19.5" {...comum}>
					<path
						d="M2 2.5H16C16.53 2.5 17.04 2.71 17.41 3.09C17.79 3.46 18 3.97 18 4.5V17.5C18 18.03 17.79 18.54 17.41 18.91C17.04 19.29 16.53 19.5 16 19.5H2C1.47 19.5 0.96 19.29 0.59 18.91C0.21 18.54 0 18.03 0 17.5V4.5C0 3.97 0.21 3.46 0.59 3.09C0.96 2.71 1.47 2.5 2 2.5ZM3 7.5V16.5H15V7.5H3Z"
						fillRule="evenodd"
						clipRule="evenodd"
						fill="currentColor"
					/>
					<path d="M5 1.5V4.5M13 1.5V4.5" strokeWidth="3" strokeLinecap="round" stroke="currentColor" />
					<path
						d="M5.5 12L8 14.5L12.5 10"
						strokeWidth="2.3"
						strokeLinecap="round"
						strokeLinejoin="round"
						stroke={destaque}
					/>
				</svg>
			);
		case 'clientes':
			return (
				<svg viewBox="0 0 18 16.2" {...comum}>
					<circle cx="13.05" cy="3.6" r="2.88" fill={destaque} />
					<path
						d="M13.05 7.65C16.11 7.65 18 9.9 18 12.6V13.95C18 14.19 17.91 14.42 17.74 14.59C17.57 14.76 17.34 14.85 17.1 14.85H9V12.6C9 10.53 8.46 9.45 7.83 8.73C9.18 8.01 10.62 7.65 13.05 7.65Z"
						fill={destaque}
					/>
					<circle cx="5.85" cy="3.15" r="3.15" fill="currentColor" />
					<path
						d="M5.85 8.1C9.27 8.1 11.7 10.62 11.7 13.95V15.3C11.7 15.54 11.61 15.77 11.44 15.94C11.27 16.11 11.04 16.2 10.8 16.2H0.9C0.66 16.2 0.43 16.11 0.26 15.94C0.09 15.77 0 15.54 0 15.3V13.95C0 10.62 2.43 8.1 5.85 8.1Z"
						fill="currentColor"
					/>
				</svg>
			);
		case 'servicos':
			return (
				<svg viewBox="0 0 18 15.53" {...comum}>
					<path
						d="M5.4 4.73V2.03C5.4 1.79 5.49 1.56 5.66 1.39C5.83 1.22 6.06 1.13 6.3 1.13H11.7C11.94 1.13 12.17 1.22 12.34 1.39C12.51 1.56 12.6 1.79 12.6 2.03V4.73"
						strokeWidth="2.25"
						strokeLinejoin="round"
						stroke="currentColor"
					/>
					<path
						d="M1.8 3.83H16.2C16.68 3.83 17.14 4.01 17.47 4.35C17.81 4.69 18 5.15 18 5.63V13.73C18 14.2 17.81 14.66 17.47 15C17.14 15.34 16.68 15.53 16.2 15.53H1.8C1.32 15.53 0.86 15.34 0.53 15C0.19 14.66 0 14.2 0 13.73V5.63C0 5.15 0.19 4.69 0.53 4.35C0.86 4.01 1.32 3.83 1.8 3.83Z"
						fill="currentColor"
					/>
					<path d="M0.9 8.78H17.1" strokeWidth="0.9" stroke={destaque} />
					<rect x="7.2" y="7.43" width="3.6" height="3.6" rx="0.63" fill={destaque} />
				</svg>
			);
		case 'configuracoes':
			return (
				<svg viewBox="0 0 18 18.95" {...comum}>
					<path
						d="M2.37 0.95V18M9 0.95V18M15.63 0.95V18"
						strokeWidth="1.89"
						strokeLinecap="round"
						stroke="currentColor"
					/>
					<rect x="0" y="3.79" width="4.74" height="5.68" rx="0.95" fill="currentColor" />
					<rect x="6.63" y="10.42" width="4.74" height="5.68" rx="0.95" fill={destaque} />
					<rect x="13.26" y="2.84" width="4.74" height="5.68" rx="0.95" fill="currentColor" />
				</svg>
			);
	}
}
