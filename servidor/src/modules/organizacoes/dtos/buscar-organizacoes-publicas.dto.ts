import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const buscarOrganizacoesPublicasSchema = z.object({
	busca: z
		.string()
		.trim()
		.max(120, 'O termo de busca deve ter no máximo 120 caracteres.')
		.optional()
		.transform((valor) => valor || undefined),
});

export class BuscarOrganizacoesPublicasDto extends createZodDto(
	buscarOrganizacoesPublicasSchema,
) {}
