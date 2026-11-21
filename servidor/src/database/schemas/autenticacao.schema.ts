import {
	pgTable,
	pgEnum,
	serial,
	text,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { usuarios } from './usuarios.schema';

/**
 * Tipos de tokens temporários emitidos para fluxos de autenticação e segurança.
 */
export const tipoTokenAutenticacaoEnum = pgEnum('tipo_token_autenticacao', [
	'verificacao_email',
	'recuperacao_senha',
	'refresh_token',
]);

/**
 * Tokens de curta duração para validação de e-mail e redefinição de senha.
 */
export const tokensAutenticacao = pgTable('tokens_autenticacao', {
	id: serial('id').primaryKey(),
	idUsuario: integer('id_usuario')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'cascade' }),
	tokenHash: text('token_hash').notNull().unique(),
	tipo: tipoTokenAutenticacaoEnum('tipo').notNull(),
	expiraEm: timestamp('expira_em', { withTimezone: true }).notNull(),
	usadoEm: timestamp('usado_em', { withTimezone: true }),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type TokenAutenticacao = InferSelectModel<typeof tokensAutenticacao>;
