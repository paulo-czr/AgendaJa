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

// 1. Enums de Papel/Role do Usuário
export const papelUsuarioEnum = pgEnum('papel_usuario', ['cliente', 'prestador']);
export const userRoleEnum = papelUsuarioEnum; // Compatibilidade com a modelagem inicial

// 2. Tabela de Usuários
export const usuarios = pgTable('usuarios', {
	id: serial('id').primaryKey(),
	nome: varchar('nome', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	senhaHash: text('senha_hash').notNull(),
	telefone: varchar('telefone', { length: 20 }),
	role: papelUsuarioEnum('role').default('cliente').notNull(),
	emailVerificado: boolean('email_verificado').default(false).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos inferidos
export type Usuario = InferSelectModel<typeof usuarios>;
export type NovoUsuario = InferInsertModel<typeof usuarios>;

