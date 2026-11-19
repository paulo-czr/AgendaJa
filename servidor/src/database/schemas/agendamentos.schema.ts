import {
	pgTable,
	pgEnum,
	serial,
	text,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { usuarios } from './usuarios.schema';
import { servicos } from './servicos.schema';

/**
 * Ciclo de vida operacional de um agendamento.
 */
export const agendamentoStatusEnum = pgEnum('agendamento_status', [
	'pendente',
	'confirmado',
	'cancelado',
	'concluido',
]);

/**
 * Registro de agendamento vinculando cliente e serviço em um intervalo de data e hora.
 */
export const agendamentos = pgTable('agendamentos', {
	id: serial('id').primaryKey(),
	idCliente: integer('id_cliente')
		.notNull()
		.references(() => usuarios.id, { onDelete: 'restrict' }),
	idServico: integer('id_servico')
		.notNull()
		.references(() => servicos.id, { onDelete: 'restrict' }),
	dataHoraInicio: timestamp('data_hora_inicio', {
		withTimezone: true,
	}).notNull(),
	dataHoraFim: timestamp('data_hora_fim', {
		withTimezone: true,
	}).notNull(),
	status: agendamentoStatusEnum('status').default('pendente').notNull(),
	observacoes: text('observacoes'),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Agendamento = InferSelectModel<typeof agendamentos>;
export type NovoAgendamento = InferInsertModel<typeof agendamentos>;
