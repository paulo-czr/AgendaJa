import { z } from 'zod';

const REGEX_REMETENTE_EMAIL =
	/^(?:[^<>]+<[^<>]+@[^<>]+>|[^@\s]+@[^@\s]+\.[^@\s]+)$/;

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
		SMTP_HOST: z.string().trim().min(1),
		SMTP_PORTA: z.coerce.number().int().positive().default(587),
		SMTP_SEGURO: z
			.enum(['true', 'false'])
			.default('false')
			.transform((valor) => valor === 'true'),
		SMTP_USUARIO: z.string().trim().min(1),
		SMTP_SENHA: z.string().min(1),
		SMTP_REMETENTE: z
			.string()
			.refine(
				(valor) => REGEX_REMETENTE_EMAIL.test(valor),
				'SMTP_REMETENTE precisa ser um e-mail ou nome seguido de um e-mail.',
			),
	})
	.passthrough();

export function validarConfiguracao(
	ambiente: Record<string, unknown>,
): Record<string, unknown> {
	return configuracaoAmbienteSchema.parse(ambiente);
}
