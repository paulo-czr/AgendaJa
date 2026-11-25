import { createZodDto } from 'nestjs-zod';
import { criarCategoriaSchema } from './criar-categoria.dto';

export const atualizarCategoriaSchema = criarCategoriaSchema;

export class AtualizarCategoriaDto extends createZodDto(
	atualizarCategoriaSchema,
) {}
