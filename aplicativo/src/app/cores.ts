/**
 * Identidade Visual do AgendaJá — Tokens e Constantes Globais de Cor
 * 
 * Nomes descritivos organizados por hierarquia:
 * - primaria: Ações principais, destaques da marca e estados ativos.
 * - secundaria: Estrutura escura (sidebar, cabeçalho e superfícies escuras).
 * - fonte: Tipografia com contraste acessível para fundo claro e escuro.
 * - superficie / fundo: Planos de fundo da tela, cartões e elementos neutros.
 * - borda / sombra: Linhas divisórias e elevações.
 * - perigo / sucesso / alerta: Mensagens semânticas e feedbacks operacionais.
 */

export const CORES_HEX = {
	// Ação e Destaques
	primaria: '#20c9ae',
	primariaHover: '#1bb59c',
	primariaSuave: '#dff8f2',
	primariaEscura: '#087d70',

	// Estrutura
	secundaria: '#0e2939',
	secundariaSuave: '#173747',
	secundariaBorda: '#294756',

	// Fontes
	fontePrimaria: '#123449',
	fonteSecundaria: '#657d8a',
	fonteInvertida: '#ffffff',
	fonteInvertidaSuave: '#b5cad4',
	fonteInvertidaMedia: '#aac0cb',
	fonteInvertidaMutada: '#8ca9b5',

	// Fundo e Superfícies
	fundo: '#f4f8f8',
	superficie: '#ffffff',
	superficieNeutra: '#edf2f4',
	borda: '#e4ecee',

	// Feedback
	perigo: '#b34253',
	perigoFundo: '#fdecee',
	sucesso: '#16a34a',
	sucessoFundo: '#dcfce7',
	alerta: '#d97706',
	alertaFundo: '#fef3c7',

	// Sombras
	sombra: 'rgba(14, 41, 57, 0.08)',
	sombraForte: 'rgba(14, 41, 57, 0.35)',
} as const;

export const VARIAVEIS_CSS = {
	primaria: 'var(--cor-primaria)',
	primariaHover: 'var(--cor-primaria-hover)',
	primariaSuave: 'var(--cor-primaria-suave)',
	primariaEscura: 'var(--cor-primaria-escura)',

	secundaria: 'var(--cor-secundaria)',
	secundariaSuave: 'var(--cor-secundaria-suave)',
	secundariaBorda: 'var(--cor-secundaria-borda)',

	fontePrimaria: 'var(--cor-fonte-primaria)',
	fonteSecundaria: 'var(--cor-fonte-secundaria)',
	fonteInvertida: 'var(--cor-fonte-invertida)',
	fonteInvertidaSuave: 'var(--cor-fonte-invertida-suave)',
	fonteInvertidaMedia: 'var(--cor-fonte-invertida-media)',
	fonteInvertidaMutada: 'var(--cor-fonte-invertida-mutada)',

	fundo: 'var(--cor-fundo)',
	superficie: 'var(--cor-superficie)',
	superficieNeutra: 'var(--cor-superficie-neutra)',
	borda: 'var(--cor-borda)',

	perigo: 'var(--cor-perigo)',
	perigoFundo: 'var(--cor-perigo-fundo)',
	sucesso: 'var(--cor-sucesso)',
	sucessoFundo: 'var(--cor-sucesso-fundo)',
	alerta: 'var(--cor-alerta)',
	alertaFundo: 'var(--cor-alerta-fundo)',
} as const;
