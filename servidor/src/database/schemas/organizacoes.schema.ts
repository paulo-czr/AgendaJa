import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { usuarios } from './usuarios.schema';

// Tabela de Organizações
export const organizacoes = pgTable('organizacoes', {
	id: serial('id').primaryKey(),
	idUsuario: integer('id_usuario')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'cascade' }),
	nomeFantasia: varchar('nome_fantasia', { length: 255 }).notNull(),
	documento: varchar('documento', { length: 20 }).notNull().unique(),
	endereco: text('endereco'),
	capacidadeSimultanea: integer('capacidade_simultanea').default(1).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos inferidos
export type Organizacao = InferSelectModel<typeof organizacoes>;
export type NovaOrganizacao = InferInsertModel<typeof organizacoes>;

