import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const usuarioPublicoSchema = z.object({
	id: z.number().int().positive(),
	nome: z.string(),
	email: z.string().email(),
	telefone: z.string(),
	role: z.enum(['cliente', 'prestador']),
});

export class UsuarioPublicoDto extends createZodDto(usuarioPublicoSchema) {}

export const respostaSessaoSchema = z.object({
	usuario: usuarioPublicoSchema,
});

export class RespostaSessaoDto extends createZodDto(respostaSessaoSchema) {}

export const respostaMensagemSchema = z.object({
	mensagem: z.string(),
});

export class RespostaMensagemDto extends createZodDto(
	respostaMensagemSchema,
) {}
