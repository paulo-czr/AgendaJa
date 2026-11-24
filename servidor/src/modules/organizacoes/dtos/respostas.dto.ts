import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const organizacaoPublicaSchema = z.object({
	id: z.number().int().positive(),
	nomeFantasia: z.string(),
	documento: z.string(),
	telefone: z.string().nullable(),
	endereco: z.string().nullable(),
	capacidadeSimultanea: z.number().int().positive(),
	duracaoPadraoMinutos: z.number().int().positive(),
});

export class OrganizacaoPublicaDto extends createZodDto(
	organizacaoPublicaSchema,
) {}
