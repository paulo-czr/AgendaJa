/**
 * Ícones do AgendaJá exportados do Figma (página "agendamento geral").
 *
 * Cada import devolve a URL do SVG; use em <img src={icones.inicio} alt="" />.
 * - Desktop: ícones de 28px com círculo de fundo, usados no menu lateral.
 * - `arredondado`: versões do layout mobile (traço arredondado, sem fundo).
 * - Selos e serviços: ilustrações com círculo verde-água de fundo.
 */
import agendamentos from './agendamentos.svg';
import chevron from './chevron.svg';
import clientes from './clientes.svg';
import configuracoes from './configuracoes.svg';
import inicio from './inicio.svg';
import marcaCalendario from './marca-calendario.svg';
import notificacoes from './notificacoes.svg';
import seloAgenda from './selo-agenda.svg';
import seloClientes from './selo-clientes.svg';
import seloContextual from './selo-contextual.svg';
import seloRelogio from './selo-relogio.svg';
import servicoAtendimento from './servico-atendimento.svg';
import servicoAvaliacao from './servico-avaliacao.svg';
import servicoConversa from './servico-conversa.svg';
import servicoCuidado from './servico-cuidado.svg';
import servicoRetorno from './servico-retorno.svg';
import servicos from './servicos.svg';
import statusCancelado from './status-cancelado.svg';
import statusConcluido from './status-concluido.svg';
import statusConfirmado from './status-confirmado.svg';
import adicionarArredondado from './arredondado/adicionar.svg';
import avancarArredondado from './arredondado/avancar.svg';
import buscaArredondado from './arredondado/busca.svg';
import calendarioArredondado from './arredondado/calendario.svg';
import clientesArredondado from './arredondado/clientes.svg';
import configuracoesArredondado from './arredondado/configuracoes.svg';
import confirmarArredondado from './arredondado/confirmar.svg';
import expandirArredondado from './arredondado/expandir.svg';
import fecharArredondado from './arredondado/fechar.svg';
import inicioArredondado from './arredondado/inicio.svg';
import servicosArredondado from './arredondado/servicos.svg';
import sucessoArredondado from './arredondado/sucesso.svg';

export const icones = {
	// Marca
	marcaCalendario,

	// Menu lateral (desktop, 28px)
	inicio,
	agendamentos,
	clientes,
	servicos,
	configuracoes,

	// Cabeçalho e navegação
	notificacoes,
	chevron,

	// Status (14px)
	statusConfirmado,
	statusConcluido,
	statusCancelado,

	// Selos ilustrados
	seloAgenda,
	seloRelogio,
	seloClientes,
	seloContextual,

	// Ícones de serviço (56px)
	servicoConversa,
	servicoAtendimento,
	servicoCuidado,
	servicoAvaliacao,
	servicoRetorno,

	// Mobile (arredondados)
	arredondado: {
		inicio: inicioArredondado,
		calendario: calendarioArredondado,
		clientes: clientesArredondado,
		servicos: servicosArredondado,
		configuracoes: configuracoesArredondado,
		adicionar: adicionarArredondado,
		avancar: avancarArredondado,
		busca: buscaArredondado,
		fechar: fecharArredondado,
		confirmar: confirmarArredondado,
		sucesso: sucessoArredondado,
		expandir: expandirArredondado,
	},
} as const;
