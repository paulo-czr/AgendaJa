import type { DiaGrade } from './servicos/configuracoesAgendaServico';
import type {
	DadosOrganizacao,
	Organizacao,
} from './servicos/organizacoesServico';

export const DURACOES_PADRAO = [15, 30, 45, 60, 90, 120] as const;

/** Ordem de exibição do Figma (Seg → Dom), com o número usado pela API. */
export const DIAS_SEMANA = [
	{ numero: 1, sigla: 'Seg', nome: 'Segunda-feira' },
	{ numero: 2, sigla: 'Ter', nome: 'Terça-feira' },
	{ numero: 3, sigla: 'Qua', nome: 'Quarta-feira' },
	{ numero: 4, sigla: 'Qui', nome: 'Quinta-feira' },
	{ numero: 5, sigla: 'Sex', nome: 'Sexta-feira' },
	{ numero: 6, sigla: 'Sáb', nome: 'Sábado' },
	{ numero: 0, sigla: 'Dom', nome: 'Domingo' },
] as const;

export interface FormularioConfiguracoes {
	nomeFantasia: string;
	documento: string;
	telefone: string;
	endereco: string;
	capacidadeSimultanea: string;
	duracaoPadraoMinutos: number;
	diasAtivos: number[];
	horarioAbertura: string;
	horarioFechamento: string;
	inicioPausa: string;
	fimPausa: string;
}

export type ErrosFormularioConfiguracoes = Partial<
	Record<keyof FormularioConfiguracoes, string>
>;

/** Mapeamento do campo do formulário para o ID do elemento DOM para foco automático. */
export const ID_CAMPO_FORMULARIO: Record<
	keyof FormularioConfiguracoes,
	string
> = {
	nomeFantasia: 'nome-empresa',
	documento: 'documento-empresa',
	telefone: 'telefone-empresa',
	endereco: 'endereco-empresa',
	capacidadeSimultanea: 'capacidade-empresa',
	duracaoPadraoMinutos: 'duracao-padrao',
	diasAtivos: 'grupo-dias-atendimento',
	horarioAbertura: 'horario-abertura',
	horarioFechamento: 'horario-encerramento',
	inicioPausa: 'inicio-pausa',
	fimPausa: 'fim-pausa',
};

export function criarFormularioInicial(
	telefoneUsuario = '',
): FormularioConfiguracoes {
	return {
		nomeFantasia: '',
		documento: '',
		telefone: formatarTelefone(telefoneUsuario),
		endereco: '',
		capacidadeSimultanea: '1',
		duracaoPadraoMinutos: 30,
		diasAtivos: [1, 2, 3, 4, 5],
		horarioAbertura: '08:00',
		horarioFechamento: '18:00',
		inicioPausa: '12:00',
		fimPausa: '13:00',
	};
}

/**
 * Monta o formulário a partir da API. Como a tela usa um expediente único,
 * os horários vêm do primeiro dia ativo (ou de Segunda, se nenhum estiver ativo).
 */
export function formularioDaApi(
	organizacao: Organizacao,
	grade: DiaGrade[],
): FormularioConfiguracoes {
	const referencia =
		grade.find((dia) => dia.ativo) ??
		grade.find((dia) => dia.diaSemana === 1) ??
		grade[0];

	return {
		nomeFantasia: organizacao.nomeFantasia,
		documento: formatarDocumento(organizacao.documento),
		telefone: formatarTelefone(organizacao.telefone ?? ''),
		endereco: organizacao.endereco ?? '',
		capacidadeSimultanea: String(organizacao.capacidadeSimultanea),
		duracaoPadraoMinutos: organizacao.duracaoPadraoMinutos,
		diasAtivos: grade.filter((dia) => dia.ativo).map((dia) => dia.diaSemana),
		horarioAbertura: referencia?.horarioAbertura ?? '08:00',
		horarioFechamento: referencia?.horarioFechamento ?? '18:00',
		inicioPausa: referencia?.inicioPausa ?? '',
		fimPausa: referencia?.fimPausa ?? '',
	};
}

export function dadosOrganizacao(
	formulario: FormularioConfiguracoes,
): DadosOrganizacao {
	return {
		nomeFantasia: formulario.nomeFantasia.trim(),
		telefone: formulario.telefone.trim(),
		endereco: formulario.endereco.trim() || null,
		capacidadeSimultanea: Number(formulario.capacidadeSimultanea),
		duracaoPadraoMinutos: formulario.duracaoPadraoMinutos,
	};
}

/** Aplica o mesmo expediente e a mesma pausa aos 7 dias da semana. */
export function gradeDoFormulario(
	formulario: FormularioConfiguracoes,
): DiaGrade[] {
	const possuiPausa = Boolean(formulario.inicioPausa && formulario.fimPausa);

	return Array.from({ length: 7 }, (_valor, diaSemana) => ({
		diaSemana,
		ativo: formulario.diasAtivos.includes(diaSemana),
		horarioAbertura: formulario.horarioAbertura,
		horarioFechamento: formulario.horarioFechamento,
		inicioPausa: possuiPausa ? formulario.inicioPausa : null,
		fimPausa: possuiPausa ? formulario.fimPausa : null,
	}));
}

/** Compara dois estados de formulário para detectar alterações não salvas (dirty state). */
export function formulariosIguais(
	a: FormularioConfiguracoes | null,
	b: FormularioConfiguracoes | null,
): boolean {
	if (!a || !b) {
		return false;
	}

	const diasA = [...a.diasAtivos].sort((x, y) => x - y).join(',');
	const diasB = [...b.diasAtivos].sort((x, y) => x - y).join(',');

	return (
		a.nomeFantasia.trim() === b.nomeFantasia.trim() &&
		a.documento.replace(/\D/g, '') === b.documento.replace(/\D/g, '') &&
		a.telefone.trim() === b.telefone.trim() &&
		a.endereco.trim() === b.endereco.trim() &&
		a.capacidadeSimultanea === b.capacidadeSimultanea &&
		a.duracaoPadraoMinutos === b.duracaoPadraoMinutos &&
		diasA === diasB &&
		a.horarioAbertura === b.horarioAbertura &&
		a.horarioFechamento === b.horarioFechamento &&
		a.inicioPausa === b.inicioPausa &&
		a.fimPausa === b.fimPausa
	);
}

/** Validação detalhada por campo para feedback inline e foco automático. */
export function validarCamposFormulario(
	formulario: FormularioConfiguracoes,
	cadastrando: boolean,
): ErrosFormularioConfiguracoes {
	const erros: ErrosFormularioConfiguracoes = {};

	if (formulario.nomeFantasia.trim().length < 2) {
		erros.nomeFantasia = 'Informe o nome da empresa (mínimo de 2 caracteres).';
	}

	if (cadastrando) {
		const digitos = formulario.documento.replace(/\D/g, '');
		if (digitos.length !== 11 && digitos.length !== 14) {
			erros.documento = 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).';
		}
	}

	const digitosTelefone = formulario.telefone.replace(/\D/g, '');
	if (digitosTelefone.length < 10 || digitosTelefone.length > 11) {
		erros.telefone = 'Informe um telefone com DDD (10 ou 11 dígitos).';
	}

	const capacidade = Number(formulario.capacidadeSimultanea);
	if (!Number.isInteger(capacidade) || capacidade < 1 || capacidade > 100) {
		erros.capacidadeSimultanea = 'Informe um número inteiro de 1 a 100.';
	}

	if (formulario.diasAtivos.length === 0) {
		erros.diasAtivos = 'Selecione pelo menos um dia de atendimento.';
	}

	if (!formulario.horarioAbertura) {
		erros.horarioAbertura = 'Informe o horário de abertura.';
	}

	if (!formulario.horarioFechamento) {
		erros.horarioFechamento = 'Informe o horário de encerramento.';
	}

	if (
		formulario.horarioAbertura &&
		formulario.horarioFechamento &&
		formulario.horarioAbertura >= formulario.horarioFechamento
	) {
		erros.horarioFechamento = 'O encerramento deve ser depois da abertura.';
	}

	if (Boolean(formulario.inicioPausa) !== Boolean(formulario.fimPausa)) {
		if (!formulario.inicioPausa) {
			erros.inicioPausa = 'Informe o início da pausa ou remova o intervalo.';
		} else {
			erros.fimPausa = 'Informe o fim da pausa ou remova o intervalo.';
		}
	} else if (formulario.inicioPausa && formulario.fimPausa) {
		if (formulario.inicioPausa >= formulario.fimPausa) {
			erros.fimPausa = 'O fim da pausa deve ser depois do início.';
		} else if (
			formulario.horarioAbertura &&
			formulario.inicioPausa < formulario.horarioAbertura
		) {
			erros.inicioPausa = 'A pausa deve começar após a abertura.';
		} else if (
			formulario.horarioFechamento &&
			formulario.fimPausa > formulario.horarioFechamento
		) {
			erros.fimPausa = 'A pausa deve terminar antes do encerramento.';
		}
	}

	return erros;
}

/** Validação local com mensagem amigável; retorna o primeiro erro encontrado. */
export function validarFormulario(
	formulario: FormularioConfiguracoes,
	cadastrando: boolean,
): string | null {
	const erros = validarCamposFormulario(formulario, cadastrando);
	const primeiraChave = Object.keys(erros)[0] as
		| keyof FormularioConfiguracoes
		| undefined;

	return primeiraChave ? (erros[primeiraChave] ?? null) : null;
}

/** Formata progressivamente CPF (000.000.000-00) ou CNPJ (00.000.000/0000-00). */
export function formatarDocumento(documento: string): string {
	const digitos = documento.replace(/\D/g, '').slice(0, 14);

	if (digitos.length <= 11) {
		return digitos
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
	}

	return digitos
		.replace(/^(\d{2})(\d)/, '$1.$2')
		.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
		.replace(/\.(\d{3})(\d)/, '.$1/$2')
		.replace(/(\d{4})(\d)/, '$1-$2');
}

/** Formata progressivamente telefone fixo (81) 3333-4444 ou celular (81) 99999-9999. */
export function formatarTelefone(telefone: string): string {
	const digitos = telefone.replace(/\D/g, '').slice(0, 11);

	if (digitos.length === 0) {
		return '';
	}

	if (digitos.length <= 2) {
		return `(${digitos}`;
	}

	if (digitos.length <= 6) {
		return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
	}

	if (digitos.length <= 10) {
		return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
	}

	return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

function horarioParaMinutos(horario: string): number | null {
	if (!/^\d{2}:\d{2}$/.test(horario)) {
		return null;
	}
	const [horas, minutos] = horario.split(':').map(Number);
	if (Number.isNaN(horas) || Number.isNaN(minutos)) {
		return null;
	}
	return horas * 60 + minutos;
}

export interface ResumoExpediente {
	valido: boolean;
	minutosBrutos: number;
	minutosPausa: number;
	minutosLiquidos: number;
	horasFormatadas: string;
	horariosPorDia: number;
	atendimentosPorDia: number;
	percentualAntesPausa: number;
	percentualPausa: number;
	percentualDepoisPausa: number;
	rotuloDias: string;
}

/**
 * Calcula métricas reais do expediente para alimentar a Régua Viva do Expediente.
 */
export function calcularResumoExpediente(
	formulario: FormularioConfiguracoes,
): ResumoExpediente {
	const abertura = horarioParaMinutos(formulario.horarioAbertura);
	const fechamento = horarioParaMinutos(formulario.horarioFechamento);
	const inicioPausa = horarioParaMinutos(formulario.inicioPausa);
	const fimPausa = horarioParaMinutos(formulario.fimPausa);

	const diasOrdenados = DIAS_SEMANA.filter((d) =>
		formulario.diasAtivos.includes(d.numero),
	);
	let rotuloDias = 'Nenhum dia selecionado';
	if (diasOrdenados.length === 7) {
		rotuloDias = 'Todos os dias (Seg a Dom)';
	} else if (
		diasOrdenados.length === 5 &&
		[1, 2, 3, 4, 5].every((d) => formulario.diasAtivos.includes(d))
	) {
		rotuloDias = 'Segunda a Sexta';
	} else if (
		diasOrdenados.length === 6 &&
		[1, 2, 3, 4, 5, 6].every((d) => formulario.diasAtivos.includes(d))
	) {
		rotuloDias = 'Segunda a Sábado';
	} else if (diasOrdenados.length > 0) {
		rotuloDias = diasOrdenados.map((d) => d.sigla).join(', ');
	}

	if (abertura === null || fechamento === null || fechamento <= abertura) {
		return {
			valido: false,
			minutosBrutos: 0,
			minutosPausa: 0,
			minutosLiquidos: 0,
			horasFormatadas: '0h',
			horariosPorDia: 0,
			atendimentosPorDia: 0,
			percentualAntesPausa: 100,
			percentualPausa: 0,
			percentualDepoisPausa: 0,
			rotuloDias,
		};
	}

	const minutosBrutos = fechamento - abertura;
	const pausaValida =
		inicioPausa !== null &&
		fimPausa !== null &&
		fimPausa > inicioPausa &&
		inicioPausa >= abertura &&
		fimPausa <= fechamento;

	const minutosPausa = pausaValida ? fimPausa - inicioPausa : 0;
	const minutosLiquidos = Math.max(0, minutosBrutos - minutosPausa);

	const horas = Math.floor(minutosLiquidos / 60);
	const minutosRestantes = minutosLiquidos % 60;
	const horasFormatadas =
		minutosRestantes > 0 ? `${horas}h ${minutosRestantes}min` : `${horas}h`;

	const duracao = Math.max(5, formulario.duracaoPadraoMinutos || 30);
	const capacidade = Math.max(
		1,
		Math.min(100, Number(formulario.capacidadeSimultanea) || 1),
	);

	const horariosPorDia = pausaValida
		? Math.floor((inicioPausa - abertura) / duracao) +
			Math.floor((fechamento - fimPausa) / duracao)
		: Math.floor(minutosLiquidos / duracao);

	const atendimentosPorDia = horariosPorDia * capacidade;

	const percentualAntesPausa = pausaValida
		? Math.round(((inicioPausa - abertura) / minutosBrutos) * 100)
		: 100;
	const percentualPausa = pausaValida
		? Math.max(6, Math.round((minutosPausa / minutosBrutos) * 100))
		: 0;
	const percentualDepoisPausa = pausaValida
		? Math.max(0, 100 - percentualAntesPausa - percentualPausa)
		: 0;

	return {
		valido: true,
		minutosBrutos,
		minutosPausa,
		minutosLiquidos,
		horasFormatadas,
		horariosPorDia,
		atendimentosPorDia,
		percentualAntesPausa,
		percentualPausa,
		percentualDepoisPausa,
		rotuloDias,
	};
}

export type AbaConfiguracoes = 'empresa' | 'atendimento' | 'bloqueios';

/** Determina qual aba da tela de configurações contém determinado campo. */
export function obterAbaDoCampo(
	campo: keyof FormularioConfiguracoes,
): 'empresa' | 'atendimento' {
	if (
		campo === 'nomeFantasia' ||
		campo === 'documento' ||
		campo === 'telefone' ||
		campo === 'endereco'
	) {
		return 'empresa';
	}
	return 'atendimento';
}
