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
import { servicos } from './servicos.schema';
import { agendamentos } from './agendamentos.schema';

// Tabela de Relatórios Pós-Atendimento
export const relatorios = pgTable('relatorios', {
	id: serial('id').primaryKey(),
	idCliente: integer('id_cliente')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'restrict' }),
	idServico: integer('id_servico')
		.notNull()
		.references(() => servicos.id, { onDelete: 'restrict' }),
	idUsuario: integer('id_usuario')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'restrict' }),
	idAgendamento: integer('id_agendamento')
		.references(() => agendamentos.id, { onDelete: 'set null' }),
	nomePrestador: varchar('nome_prestador', { length: 255 }).notNull(),
	observacao: text('observacao'),
	descricaoRelatorio: text('descricao_relatorio').notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos inferidos
export type Relatorio = InferSelectModel<typeof relatorios>;
export type NovoRelatorio = InferInsertModel<typeof relatorios>;

