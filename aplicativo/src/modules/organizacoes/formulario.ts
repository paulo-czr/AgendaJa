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

export function criarFormularioInicial(telefoneUsuario = ''): FormularioConfiguracoes {
	return {
		nomeFantasia: '',
		documento: '',
		telefone: telefoneUsuario,
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
		telefone: organizacao.telefone ?? '',
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

export function dadosOrganizacao(formulario: FormularioConfiguracoes): DadosOrganizacao {
	return {
		nomeFantasia: formulario.nomeFantasia.trim(),
		telefone: formulario.telefone.trim(),
		endereco: formulario.endereco.trim() || null,
		capacidadeSimultanea: Number(formulario.capacidadeSimultanea),
		duracaoPadraoMinutos: formulario.duracaoPadraoMinutos,
	};
}

/** Aplica o mesmo expediente e a mesma pausa aos 7 dias da semana. */
export function gradeDoFormulario(formulario: FormularioConfiguracoes): DiaGrade[] {
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

/** Validação local com mensagens amigáveis; o servidor revalida tudo. */
export function validarFormulario(
	formulario: FormularioConfiguracoes,
	cadastrando: boolean,
): string | null {
	if (formulario.nomeFantasia.trim().length < 2) {
		return 'Informe o nome da empresa.';
	}

	if (cadastrando) {
		const digitos = formulario.documento.replace(/\D/g, '');
		if (digitos.length !== 11 && digitos.length !== 14) {
			return 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).';
		}
	}

	if (formulario.telefone.trim().length < 8) {
		return 'Informe um telefone válido.';
	}

	const capacidade = Number(formulario.capacidadeSimultanea);
	if (!Number.isInteger(capacidade) || capacidade < 1 || capacidade > 100) {
		return 'A capacidade simultânea deve ser um número de 1 a 100.';
	}

	if (formulario.diasAtivos.length === 0) {
		return 'Selecione pelo menos um dia de atendimento.';
	}

	if (!formulario.horarioAbertura || !formulario.horarioFechamento) {
		return 'Informe os horários de abertura e encerramento.';
	}

	if (formulario.horarioAbertura >= formulario.horarioFechamento) {
		return 'O encerramento deve ser depois da abertura.';
	}

	if (Boolean(formulario.inicioPausa) !== Boolean(formulario.fimPausa)) {
		return 'Informe o início e o fim da pausa, ou deixe os dois vazios.';
	}

	if (
		formulario.inicioPausa &&
		(formulario.inicioPausa >= formulario.fimPausa ||
			formulario.inicioPausa < formulario.horarioAbertura ||
			formulario.fimPausa > formulario.horarioFechamento)
	) {
		return 'A pausa deve começar e terminar dentro do expediente.';
	}

	return null;
}

/** 52998224725 → 529.982.247-25; 11222333000181 → 11.222.333/0001-81. */
export function formatarDocumento(documento: string): string {
	const digitos = documento.replace(/\D/g, '');

	if (digitos.length === 11) {
		return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	if (digitos.length === 14) {
		return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
	}

	return documento;
}
