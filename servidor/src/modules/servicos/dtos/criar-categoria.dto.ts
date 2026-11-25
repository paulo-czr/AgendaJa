import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const criarCategoriaSchema = z.object({
	nome: z
		.string({ required_error: 'Informe o nome da categoria.' })
		.trim()
		.min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.')
		.max(60, 'O nome da categoria deve ter no máximo 60 caracteres.'),
});

export class CriarCategoriaDto extends createZodDto(criarCategoriaSchema) {}

export const parametroIdCategoriaSchema = z.object({
	id: z.coerce.number().int().positive('Identificador de categoria inválido.'),
});

export class ParametroIdCategoriaDto extends createZodDto(
	parametroIdCategoriaSchema,
) {}
