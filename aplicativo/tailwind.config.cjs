/**
 * Identidade visual do AgendaJá — valores extraídos do Figma
 * (arquivo "Interfaces ADS 2026", página "agendamento geral").
 */
module.exports = {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Verde-água da marca (botões, destaques, "Já" do logo)
				marca: {
					50: '#dff8f2', // fundos suaves: status confirmado, selos, horários
					500: '#20c9ae', // cor principal: botões, menu ativo, acentos
					600: '#1bb59c', // hover dos botões (variação mais escura do 500)
					700: '#087d70', // texto de destaque, links, rótulos em caixa alta
				},
				// Azul-petróleo (menu lateral, cartão de boas-vindas, texto dos botões)
				petroleo: {
					DEFAULT: '#0e2939',
					800: '#173747', // cartão sobre o fundo escuro
					700: '#294756', // divisórias sobre o fundo escuro
				},
				// Textos sobre fundo claro
				tinta: {
					DEFAULT: '#123449', // títulos e texto principal
					suave: '#657d8a', // descrições, legendas, cabeçalhos de tabela
				},
				// Textos sobre fundo escuro (menu lateral e boas-vindas)
				nevoa: {
					DEFAULT: '#d1e0e5', // itens do menu
					clara: '#b5cad4', // data no cartão de boas-vindas
					media: '#aac0cb', // subtítulo da empresa
					escura: '#8ca9b5', // rótulos em caixa alta
				},
				superficie: {
					DEFAULT: '#f4f8f8', // fundo da página e dos campos
					neutra: '#edf2f4', // status concluído
				},
				borda: '#e4ecee',
				perigo: {
					DEFAULT: '#b34253', // status cancelado, erros
					fundo: '#fdecee',
				},
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
			},
			boxShadow: {
				painel: '0 24px 70px -35px rgba(14, 41, 57, 0.35)',
			},
		},
	},
	plugins: [],
};
