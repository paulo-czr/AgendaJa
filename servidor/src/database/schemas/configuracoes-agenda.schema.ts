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

// 1. Tabela de Configurações Semanais de Atendimento da Agenda
export const configuracoesAgenda = pgTable('configuracoes_agenda', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	diaSemana: integer('dia_semana').notNull(), // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
	horarioAbertura: varchar('horario_abertura', { length: 5 }).notNull(), // Formato "HH:MM" (ex: "08:00")
	horarioFechamento: varchar('horario_fechamento', { length: 5 }).notNull(), // Formato "HH:MM" (ex: "18:00")
	ativo: boolean('ativo').default(true).notNull(),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
	atualizadoEm: timestamp('atualizado_em', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Tabela de Bloqueios Pontuais de Horário/Data da Agenda
export const bloqueiosAgenda = pgTable('bloqueios_agenda', {
	id: serial('id').primaryKey(),
	idOrganizacao: integer('id_organizacao')
		.notNull()
		.references(() => organizacoes.id, { onDelete: 'cascade' }),
	dataHoraInicio: timestamp('data_hora_inicio', { withTimezone: true }).notNull(),
	dataHoraFim: timestamp('data_hora_fim', { withTimezone: true }).notNull(),
	motivo: varchar('motivo', { length: 255 }),
	criadoEm: timestamp('criado_em', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos inferidos
export type ConfiguracaoAgenda = InferSelectModel<typeof configuracoesAgenda>;
export type NovaConfiguracaoAgenda = InferInsertModel<typeof configuracoesAgenda>;

export type BloqueioAgenda = InferSelectModel<typeof bloqueiosAgenda>;
export type NovoBloqueioAgenda = InferInsertModel<typeof bloqueiosAgenda>;

