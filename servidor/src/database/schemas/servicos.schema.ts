import {
	pgTable,
	serial,
	varchar,
	integer,
	boolean,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { categoriasServicos } from './categorias-servicos.schema';
import { organizacoes } from './organizacoes.schema';

/**
 * Catálogo de serviços oferecidos pelas organizações aos clientes, definindo preço e tempo estimado.
 */
export const servicos = pgTable('servicos', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	idCategoria: integer('id_categoria').references(() => categoriasServicos.id, {
		onDelete: 'set null',
	}),
	nomeServico: varchar('nome_servico', { length: 120 }).notNull(),
	descricaoServico: varchar('descricao_servico', { length: 500 }),
	precoCentavos: integer('preco_centavos').notNull(),
	duracaoMinutos: integer('duracao_minutos').notNull(),
	ativo: boolean('ativo').default(true).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	desativadoEm: timestamp('desativado_em', { withTimezone: true }),
});

export type Servico = InferSelectModel<typeof servicos>;
export type NovoServico = InferInsertModel<typeof servicos>;
