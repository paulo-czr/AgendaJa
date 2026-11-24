import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	timestamp,
	uniqueIndex,
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
	// CPF (11 dígitos) ou CNPJ (14 dígitos), armazenado somente com números.
	documento: varchar('documento', { length: 20 }).notNull().unique(),
	telefone: varchar('telefone', { length: 20 }),
	endereco: text('endereco'),
	// Teto de atendimentos simultâneos aceitos pela organização antes de bloquear novos agendamentos no horário.
	capacidadeSimultanea: integer('capacidade_simultanea').default(1).notNull(),
	// Duração sugerida ao cadastrar serviços (15, 30, 45, 60, 90 ou 120 minutos).
	duracaoPadraoMinutos: integer('duracao_padrao_minutos').default(30).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
},
(tabela) => [
	// Nesta versão, cada prestador possui uma única organização.
	uniqueIndex('organizacoes_id_usuario_unico').on(tabela.idUsuario),
]);

export type Organizacao = InferSelectModel<typeof organizacoes>;
export type NovaOrganizacao = InferInsertModel<typeof organizacoes>;
