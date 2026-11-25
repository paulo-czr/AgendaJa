import {
	pgTable,
	serial,
	varchar,
	integer,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { organizacoes } from './organizacoes.schema';

/**
 * Categorias padronizadas de serviços pertencentes a uma organização.
 */
export const categoriasServicos = pgTable(
	'categorias_servicos',
	{
		id: serial('id').primaryKey(),
		idOrganizacao: integer('id_organizacao')
			.notNull()
			.references(() => organizacoes.id, { onDelete: 'cascade' }),
		nome: varchar('nome', { length: 60 }).notNull(),
		criadoEm: timestamp('criado_em', { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(tabela) => [
		uniqueIndex('categorias_servicos_organizacao_nome_unico').on(
			tabela.idOrganizacao,
			tabela.nome,
		),
	],
);

export type CategoriaServico = InferSelectModel<typeof categoriasServicos>;
export type NovaCategoriaServico = InferInsertModel<typeof categoriasServicos>;
