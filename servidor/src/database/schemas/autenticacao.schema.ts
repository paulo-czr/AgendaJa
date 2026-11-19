import {
	pgTable,
	pgEnum,
	serial,
	varchar,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { usuarios } from './usuarios.schema';

// 1. Enums de Tipos de Token de Autenticação
export const tipoTokenAutenticacaoEnum = pgEnum('tipo_token_autenticacao', [
	'verificacao_email',
	'recuperacao_senha',
]);

// 2. Tabela de Tokens de Autenticação
export const tokensAutenticacao = pgTable('tokens_autenticacao', {
	id: serial('id').primaryKey(),
	idUsuario: integer('id_usuario')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'cascade' }),
	token: varchar('token', { length: 255 }).notNull().unique(),
	tipo: tipoTokenAutenticacaoEnum('tipo').notNull(),
	expiraEm: timestamp('expira_em', { withTimezone: true }).notNull(),
	usadoEm: timestamp('usado_em', { withTimezone: true }),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos inferidos
export type TokenAutenticacao = InferSelectModel<typeof tokensAutenticacao>;
export type NovoTokenAutenticacao = InferInsertModel<typeof tokensAutenticacao>;

