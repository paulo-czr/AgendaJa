import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const senhaSchema = z
	.string()
	.min(8)
	.max(72)
	.refine((senha) => Buffer.byteLength(senha, 'utf8') <= 72, {
		message: 'A senha não pode exceder 72 bytes.',
	});

export const cadastrarSchema = z.object({
	nome: z.string().trim().min(2).max(150),
	email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
	senha: senhaSchema,
	telefone: z.string().trim().min(8).max(20),
	role: z.enum(['cliente', 'prestador']).default('cliente'),
});

export class CadastrarDto extends createZodDto(cadastrarSchema) {}
