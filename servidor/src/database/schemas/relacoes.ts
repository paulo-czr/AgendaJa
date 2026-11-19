import { relations } from 'drizzle-orm';
import { usuarios } from './usuarios.schema';
import { organizacoes } from './organizacoes.schema';
import { servicos } from './servicos.schema';
import { agendamentos } from './agendamentos.schema';
import { configuracoesAgenda, bloqueiosAgenda } from './configuracoes-agenda.schema';
import { relatorios } from './relatorios.schema';
import { tokensAutenticacao } from './autenticacao.schema';

// Relações de Usuários
export const usuariosRelations = relations(usuarios, ({ many }) => ({
	organizacoes: many(organizacoes),
	agendamentosComoCliente: many(agendamentos),
	relatoriosComoCliente: many(relatorios, { relationName: 'cliente_relatorio' }),
	relatoriosGerados: many(relatorios, { relationName: 'usuario_relatorio' }),
	tokensAutenticacao: many(tokensAutenticacao),
}));

// Relações de Organizações
export const organizacoesRelations = relations(organizacoes, ({ one, many }) => ({
	usuario: one(usuarios, {
		fields: [organizacoes.idUsuario],
		references: [usuarios.id],
	}),
	servicos: many(servicos),
	configuracoesAgenda: many(configuracoesAgenda),
	bloqueiosAgenda: many(bloqueiosAgenda),
}));

// Relações de Serviços
export const servicosRelations = relations(servicos, ({ one, many }) => ({
	organizacao: one(organizacoes, {
		fields: [servicos.idOrganizacao],
		references: [organizacoes.id],
	}),
	agendamentos: many(agendamentos),
	relatorios: many(relatorios),
}));

// Relações de Agendamentos
export const agendamentosRelations = relations(agendamentos, ({ one }) => ({
	cliente: one(usuarios, {
		fields: [agendamentos.idCliente],
		references: [usuarios.id],
	}),
	servico: one(servicos, {
		fields: [agendamentos.idServico],
		references: [servicos.id],
	}),
	relatorio: one(relatorios, {
		fields: [agendamentos.id],
		references: [relatorios.idAgendamento],
	}),
}));

// Relações de Configurações de Agenda
export const configuracoesAgendaRelations = relations(
	configuracoesAgenda,
	({ one }) => ({
		organizacao: one(organizacoes, {
			fields: [configuracoesAgenda.idOrganizacao],
			references: [organizacoes.id],
		}),
	}),
);

// Relações de Bloqueios de Agenda
export const bloqueiosAgendaRelations = relations(bloqueiosAgenda, ({ one }) => ({
	organizacao: one(organizacoes, {
		fields: [bloqueiosAgenda.idOrganizacao],
		references: [organizacoes.id],
	}),
}));

// Relações de Relatórios
export const relatoriosRelations = relations(relatorios, ({ one }) => ({
	cliente: one(usuarios, {
		fields: [relatorios.idCliente],
		references: [usuarios.id],
		relationName: 'cliente_relatorio',
	}),
	servico: one(servicos, {
		fields: [relatorios.idServico],
		references: [servicos.id],
	}),
	usuario: one(usuarios, {
		fields: [relatorios.idUsuario],
		references: [usuarios.id],
		relationName: 'usuario_relatorio',
	}),
	agendamento: one(agendamentos, {
		fields: [relatorios.idAgendamento],
		references: [agendamentos.id],
	}),
}));

// Relações de Tokens de Autenticação
export const tokensAutenticacaoRelations = relations(
	tokensAutenticacao,
	({ one }) => ({
		usuario: one(usuarios, {
			fields: [tokensAutenticacao.idUsuario],
			references: [usuarios.id],
		}),
	}),
);

