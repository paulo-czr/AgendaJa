/**
 * Identidade visual do AgendaJá — Cores hierárquicas mapeadas para variáveis CSS.
 * Permite sintaxe com opacidade Tailwind: ex. `bg-cor-primaria/50`, `text-cor-fonte-primaria/80`.
 */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Hierarquia Semântica Baseada em Variáveis Fixas Globais
				'cor-primaria': {
					DEFAULT: 'rgb(var(--cor-primaria) / <alpha-value>)',
					hover: 'rgb(var(--cor-primaria-hover) / <alpha-value>)',
					suave: 'rgb(var(--cor-primaria-suave) / <alpha-value>)',
					escura: 'rgb(var(--cor-primaria-escura) / <alpha-value>)',
				},
				'cor-secundaria': {
					DEFAULT: 'rgb(var(--cor-secundaria) / <alpha-value>)',
					suave: 'rgb(var(--cor-secundaria-suave) / <alpha-value>)',
					borda: 'rgb(var(--cor-secundaria-borda) / <alpha-value>)',
				},
				'cor-fonte': {
					primaria: 'rgb(var(--cor-fonte-primaria) / <alpha-value>)',
					secundaria: 'rgb(var(--cor-fonte-secundaria) / <alpha-value>)',
					invertida: 'rgb(var(--cor-fonte-invertida) / <alpha-value>)',
					'invertida-suave': 'rgb(var(--cor-fonte-invertida-suave) / <alpha-value>)',
					'invertida-media': 'rgb(var(--cor-fonte-invertida-media) / <alpha-value>)',
					'invertida-mutada': 'rgb(var(--cor-fonte-invertida-mutada) / <alpha-value>)',
				},
				'cor-fundo': 'rgb(var(--cor-fundo) / <alpha-value>)',
				'cor-superficie': {
					DEFAULT: 'rgb(var(--cor-superficie) / <alpha-value>)',
					neutra: 'rgb(var(--cor-superficie-neutra) / <alpha-value>)',
				},
				'cor-borda': 'rgb(var(--cor-borda) / <alpha-value>)',
				'cor-perigo': {
					DEFAULT: 'rgb(var(--cor-perigo) / <alpha-value>)',
					fundo: 'rgb(var(--cor-perigo-fundo) / <alpha-value>)',
				},
				'cor-sucesso': {
					DEFAULT: 'rgb(var(--cor-sucesso) / <alpha-value>)',
					fundo: 'rgb(var(--cor-sucesso-fundo) / <alpha-value>)',
				},
				'cor-alerta': {
					DEFAULT: 'rgb(var(--cor-alerta) / <alpha-value>)',
					fundo: 'rgb(var(--cor-alerta-fundo) / <alpha-value>)',
				},

				// Aliases para compatibilidade total com código existente
				marca: {
					50: 'rgb(var(--cor-primaria-suave) / <alpha-value>)',
					500: 'rgb(var(--cor-primaria) / <alpha-value>)',
					600: 'rgb(var(--cor-primaria-hover) / <alpha-value>)',
					700: 'rgb(var(--cor-primaria-escura) / <alpha-value>)',
				},
				petroleo: {
					DEFAULT: 'rgb(var(--cor-secundaria) / <alpha-value>)',
					800: 'rgb(var(--cor-secundaria-suave) / <alpha-value>)',
					700: 'rgb(var(--cor-secundaria-borda) / <alpha-value>)',
				},
				tinta: {
					DEFAULT: 'rgb(var(--cor-fonte-primaria) / <alpha-value>)',
					suave: 'rgb(var(--cor-fonte-secundaria) / <alpha-value>)',
				},
				nevoa: {
					DEFAULT: 'rgb(var(--cor-fonte-invertida) / <alpha-value>)',
					clara: 'rgb(var(--cor-fonte-invertida-suave) / <alpha-value>)',
					media: 'rgb(var(--cor-fonte-invertida-media) / <alpha-value>)',
					escura: 'rgb(var(--cor-fonte-invertida-mutada) / <alpha-value>)',
				},
				superficie: {
					DEFAULT: 'rgb(var(--cor-fundo) / <alpha-value>)',
					neutra: 'rgb(var(--cor-superficie-neutra) / <alpha-value>)',
				},
				borda: 'rgb(var(--cor-borda) / <alpha-value>)',
				perigo: {
					DEFAULT: 'rgb(var(--cor-perigo) / <alpha-value>)',
					fundo: 'rgb(var(--cor-perigo-fundo) / <alpha-value>)',
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
			},
			boxShadow: {
				painel: '0 24px 70px -35px rgb(var(--cor-sombra) / 0.35)',
				sutil: '0 1px 2px rgb(var(--cor-sombra) / 0.04)',
				card: '0 1px 3px rgb(var(--cor-sombra) / 0.08)',
				flutuante: '0 8px 30px rgb(var(--cor-sombra) / 0.12)',
			},
		},
	},
	plugins: [],
};
