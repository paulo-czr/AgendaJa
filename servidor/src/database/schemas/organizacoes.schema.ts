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

/**
 * Organização prestadora de serviços (ex.: barbearia, clínica, lava-jato).
 * Vinculada a um usuário prestador proprietário.
 */
export const organizacoes = pgTable('organizacoes', {
	id: serial('id').primaryKey(),
	idUsuario: integer('id_usuario')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'cascade' }),
	nomeFantasia: varchar('nome_fantasia', { length: 255 }).notNull(),
	documento: varchar('documento', { length: 20 }).notNull().unique(),
	endereco: text('endereco'),
	// Teto de atendimentos simultâneos aceitos pela organização antes de bloquear novos agendamentos no horário.
	capacidadeSimultanea: integer('capacidade_simultanea').default(1).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Organizacao = InferSelectModel<typeof organizacoes>;
export type NovaOrganizacao = InferInsertModel<typeof organizacoes>;
