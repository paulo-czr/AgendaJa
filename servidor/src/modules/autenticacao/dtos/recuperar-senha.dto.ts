import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const solicitarRecuperacaoSenhaSchema = z.object({
	email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
});

export class SolicitarRecuperacaoSenhaDto extends createZodDto(
	solicitarRecuperacaoSenhaSchema,
) {}

export const redefinirSenhaSchema = z.object({
	token: z.string().regex(/^[a-f0-9]{64}$/i),
	senha: z
		.string()
		.min(8)
		.max(72)
		.refine((senha) => Buffer.byteLength(senha, 'utf8') <= 72, {
			message: 'A senha não pode exceder 72 bytes.',
		}),
});

export class RedefinirSenhaDto extends createZodDto(redefinirSenhaSchema) {}
