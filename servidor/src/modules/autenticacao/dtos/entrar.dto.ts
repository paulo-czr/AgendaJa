import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const entrarSchema = z.object({
	email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
	senha: z
		.string()
		.min(1)
		.max(72)
		.refine((senha) => Buffer.byteLength(senha, 'utf8') <= 72, {
			message: 'A senha não pode exceder 72 bytes.',
		}),
});

export class EntrarDto extends createZodDto(entrarSchema) {}
