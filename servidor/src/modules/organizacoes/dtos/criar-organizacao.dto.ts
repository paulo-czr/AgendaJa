import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Durações aceitas para os atendimentos, em minutos (RF05). */
export const DURACOES_PADRAO = [15, 30, 45, 60, 90, 120] as const;

function calcularDigito(digitos: number[], pesos: number[]): number {
	const soma = digitos.reduce(
		(total, digito, indice) => total + digito * pesos[indice],
		0,
	);
	const resto = soma % 11;

	return resto < 2 ? 0 : 11 - resto;
}

function cpfValido(cpf: string): boolean {
	const digitos = [...cpf].map(Number);
	const primeiro = calcularDigito(digitos.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
	const segundo = calcularDigito(
		digitos.slice(0, 10),
		[11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
	);

	return primeiro === digitos[9] && segundo === digitos[10];
}

function cnpjValido(cnpj: string): boolean {
	const digitos = [...cnpj].map(Number);
	const primeiro = calcularDigito(
		digitos.slice(0, 12),
		[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
	);
	const segundo = calcularDigito(
		digitos.slice(0, 13),
		[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
	);

	return primeiro === digitos[12] && segundo === digitos[13];
}

/** Valida CPF (11 dígitos) ou CNPJ (14 dígitos) pelos dígitos verificadores. */
export function documentoValido(documento: string): boolean {
	if (/^(\d)\1+$/.test(documento)) {
		return false;
	}

	if (documento.length === 11) {
		return cpfValido(documento);
	}

	if (documento.length === 14) {
		return cnpjValido(documento);
	}

	return false;
}

/** Aceita o documento com ou sem máscara e devolve somente os dígitos. */
export const documentoSchema = z
	.string()
	.trim()
	.transform((documento) => documento.replace(/\D/g, ''))
	.refine(documentoValido, { message: 'Informe um CPF ou CNPJ válido.' });

export const telefoneSchema = z
	.string()
	.trim()
	.min(8, 'Informe um telefone válido.')
	.max(20, 'Informe um telefone válido.');

const enderecoSchema = z
	.string()
	.trim()
	.max(500)
	.nullish()
	.transform((endereco) => endereco || null);

export const capacidadeSimultaneaSchema = z.coerce
	.number()
	.int('A capacidade deve ser um número inteiro.')
	.min(1, 'A capacidade simultânea deve ser de pelo menos 1.')
	.max(100, 'A capacidade simultânea deve ser de no máximo 100.');

export const duracaoPadraoSchema = z.coerce
	.number()
	.refine(
		(duracao) => (DURACOES_PADRAO as readonly number[]).includes(duracao),
		{ message: 'Escolha uma duração de 15, 30, 45, 60, 90 ou 120 minutos.' },
	);

export const criarOrganizacaoSchema = z.object({
	nomeFantasia: z
		.string()
		.trim()
		.min(2, 'Informe o nome da empresa.')
		.max(255),
	documento: documentoSchema,
	telefone: telefoneSchema,
	endereco: enderecoSchema,
	capacidadeSimultanea: capacidadeSimultaneaSchema.default(1),
	duracaoPadraoMinutos: duracaoPadraoSchema.default(30),
});

export class CriarOrganizacaoDto extends createZodDto(criarOrganizacaoSchema) {}
