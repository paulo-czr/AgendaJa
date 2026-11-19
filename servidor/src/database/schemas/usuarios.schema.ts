import {
	pgTable,
	pgEnum,
	serial,
	varchar,
	text,
	boolean,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

/**
 * Papéis de acesso disponíveis no sistema, determinando privilégios e fluxos de navegação.
 */
export const papelUsuarioEnum = pgEnum('papel_usuario', [
	'cliente',
	'prestador',
]);
export const userRoleEnum = papelUsuarioEnum;

/**
 * Entidade central de usuários da plataforma (clientes e prestadores).
 */
export const usuarios = pgTable('usuarios', {
	id: serial('id').primaryKey(),
	nome: varchar('nome', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	senhaHash: text('senha_hash').notNull(),
	telefone: varchar('telefone', { length: 20 }),
	role: papelUsuarioEnum('role').default('cliente').notNull(),
	emailVerificado: boolean('email_verificado').default(false).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Usuario = InferSelectModel<typeof usuarios>;
export type NovoUsuario = InferInsertModel<typeof usuarios>;
