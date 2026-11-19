import {
	pgTable,
	serial,
	varchar,
	integer,
	boolean,
	timestamp,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { organizacoes } from './organizacoes.schema';

/**
 * Grade de funcionamento semanal da organização para controle de disponibilidade de agendamentos.
 */
export const configuracoesAgenda = pgTable('configuracoes_agenda', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	diaSemana: integer('dia_semana').notNull(), // 0 = Domingo a 6 = Sábado
	horarioAbertura: varchar('horario_abertura', { length: 5 }).notNull(), // Formato "HH:MM"
	horarioFechamento: varchar('horario_fechamento', { length: 5 }).notNull(), // Formato "HH:MM"
	ativo: boolean('ativo').default(true).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * Bloqueios pontuais de datas e horários (ex.: feriados, férias, manutenções) que sobrepõem a grade semanal.
 */
export const bloqueiosAgenda = pgTable('bloqueios_agenda', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	dataHoraInicio: timestamp('data_hora_inicio', {
		withTimezone: true,
	}).notNull(),
	dataHoraFim: timestamp('data_hora_fim', { withTimezone: true }).notNull(),
	motivo: varchar('motivo', { length: 255 }),
	criadoEm: timestamp('criado_em', { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type ConfiguracaoAgenda = InferSelectModel<typeof configuracoesAgenda>;
export type NovaConfiguracaoAgenda = InferInsertModel<
	typeof configuracoesAgenda
>;

export type BloqueioAgenda = InferSelectModel<typeof bloqueiosAgenda>;
export type NovoBloqueioAgenda = InferInsertModel<typeof bloqueiosAgenda>;
