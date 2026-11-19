import {
	pgTable,
	serial,
	varchar,
	text,
	integer,
	numeric,
	boolean,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { organizacoes } from './organizacoes.schema';

/**
 * Catálogo de serviços oferecidos pelas organizações aos clientes, definindo preço e tempo estimado.
 */
export const servicos = pgTable('servicos', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	nomeServico: varchar('nome_servico', { length: 255 }).notNull(),
	descricaoServico: text('descricao_servico'),
	preco: numeric('preco', { precision: 10, scale: 2 }).notNull(),
	duracaoMinutos: integer('duracao_minutos').notNull(),
	ativo: boolean('ativo').default(true).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Servico = InferSelectModel<typeof servicos>;
export type NovoServico = InferInsertModel<typeof servicos>;
