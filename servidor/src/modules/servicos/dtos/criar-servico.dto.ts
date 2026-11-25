import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const textoOpcional = (limite: number, mensagem: string) =>
	z
		.string()
		.trim()
		.max(limite, mensagem)
		.nullish()
		.transform((valor) => valor || null);

export const criarServicoSchema = z.object({
	nomeServico: z
		.string()
		.trim()
		.min(2, 'O nome do serviço deve ter pelo menos 2 caracteres.')
		.max(120, 'O nome do serviço deve ter no máximo 120 caracteres.'),
	descricaoServico: textoOpcional(
		500,
		'A descrição deve ter no máximo 500 caracteres.',
	),
	idCategoria: z
		.union([
			z.coerce.number().int().positive('Categoria inválida.'),
			z.null(),
		])
		.optional()
		.transform((valor) => valor ?? null),
	precoCentavos: z
		.number({
			required_error: 'Informe o preço do serviço.',
			invalid_type_error: 'Informe um preço válido em centavos.',
		})
		.int('O preço deve ser um número inteiro em centavos.')
		.min(0, 'O preço não pode ser negativo.'),
	duracaoMinutos: z
		.number({
			required_error: 'Informe a duração do serviço.',
			invalid_type_error: 'Informe uma duração válida em minutos.',
		})
		.int('A duração deve ser um número inteiro de minutos.')
		.min(1, 'A duração deve ser de pelo menos 1 minuto.'),
	ativo: z.boolean().default(true),
});

export class CriarServicoDto extends createZodDto(criarServicoSchema) {}

export const parametroIdServicoSchema = z.object({
	id: z.coerce.number().int().positive('Identificador de serviço inválido.'),
});

export class ParametroIdServicoDto extends createZodDto(
	parametroIdServicoSchema,
) {}

export const parametroIdOrganizacaoSchema = z.object({
	idOrganizacao: z.coerce
		.number()
		.int()
		.positive('Identificador de organização inválido.'),
});

export class ParametroIdOrganizacaoDto extends createZodDto(
	parametroIdOrganizacaoSchema,
) {}
