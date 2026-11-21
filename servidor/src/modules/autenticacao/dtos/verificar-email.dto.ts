import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const verificarEmailSchema = z.object({
	token: z.string().regex(/^[a-f0-9]{64}$/i),
});

export class VerificarEmailDto extends createZodDto(verificarEmailSchema) {}

export const reenviarVerificacaoSchema = z.object({
	email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
});

export class ReenviarVerificacaoDto extends createZodDto(
	reenviarVerificacaoSchema,
) {}
