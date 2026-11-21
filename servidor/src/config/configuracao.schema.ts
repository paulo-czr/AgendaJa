import { z } from 'zod';

export const configuracaoAmbienteSchema = z
	.object({
		DATABASE_URL: z
			.string()
			.url()
			.refine(
				(valor) =>
					valor.startsWith('postgres://') ||
					valor.startsWith('postgresql://'),
				{ message: 'DATABASE_URL precisa apontar para PostgreSQL.' },
			),
		PORTA_SERVIDOR: z.coerce.number().int().positive().default(3000),
		URL_APLICATIVO: z.string().url(),
		JWT_SEGREDO: z.string().min(32),
		JWT_EXPIRACAO: z.literal('15m'),
		JWT_REFRESH_SEGREDO: z.string().min(32),
		JWT_REFRESH_EXPIRACAO: z.literal('7d'),
		RESEND_API_KEY: z.string().min(1),
		RESEND_REMETENTE: z
			.string()
			.refine(
				(valor) =>
					/^(?:[^<>]+<[^<>]+@[^<>]+>|[^@\s]+@[^@\s]+\.[^@\s]+)$/.test(valor),
				'RESEND_REMETENTE precisa ser um e-mail ou nome seguido de um e-mail.',
			),
	})
	.passthrough();

export function validarConfiguracao(
	ambiente: Record<string, unknown>,
): Record<string, unknown> {
	return configuracaoAmbienteSchema.parse(ambiente);
}
