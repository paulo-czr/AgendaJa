import { NotFoundException } from '@nestjs/common';
import type { BancoDados } from '../../database/banco-dados.module';
import type { OrganizacoesServico } from '../organizacoes/organizacoes.service';
import { ConfiguracoesAgendaServico } from './configuracoes-agenda.service';
import { criarBloqueioSchema } from './dtos/criar-bloqueio.dto';
import { salvarGradeSchema } from './dtos/salvar-grade.dto';
import { criarGradePadrao } from './grade-padrao';

function gradeCom(alteracoes: Record<string, unknown>) {
	return {
		dias: criarGradePadrao().map((dia) =>
			dia.diaSemana === 1 ? { ...dia, ...alteracoes } : dia,
		),
	};
}

describe('regras da grade de funcionamento', () => {
	it('aceita a grade padrão', () => {
		const resultado = salvarGradeSchema.safeParse({ dias: criarGradePadrao() });

		expect(resultado.success).toBe(true);
	});

	it('rejeita abertura igual ou posterior ao encerramento', () => {
		const resultado = salvarGradeSchema.safeParse(
			gradeCom({ horarioAbertura: '18:00', horarioFechamento: '08:00' }),
		);

		expect(resultado.success).toBe(false);
	});

	it('rejeita pausa fora do expediente', () => {
		const resultado = salvarGradeSchema.safeParse(
			gradeCom({ inicioPausa: '07:00', fimPausa: '08:30' }),
		);

		expect(resultado.success).toBe(false);
	});

	it('rejeita pausa com apenas um dos horários informado', () => {
		const resultado = salvarGradeSchema.safeParse(
			gradeCom({ inicioPausa: '12:00', fimPausa: null }),
		);

		expect(resultado.success).toBe(false);
	});

	it('rejeita horário fora do formato HH:MM', () => {
		const resultado = salvarGradeSchema.safeParse(
			gradeCom({ horarioAbertura: '24:00' }),
		);

		expect(resultado.success).toBe(false);
	});

	it('rejeita grade com dia da semana repetido', () => {
		const dias = criarGradePadrao();
		dias[6] = { ...dias[6], diaSemana: 0 };

		expect(salvarGradeSchema.safeParse({ dias }).success).toBe(false);
	});
});

describe('regras dos bloqueios', () => {
	it('rejeita bloqueio que termina antes de começar', () => {
		const resultado = criarBloqueioSchema.safeParse({
			dataHoraInicio: '2026-12-25T18:00:00-03:00',
			dataHoraFim: '2026-12-25T08:00:00-03:00',
		});

		expect(resultado.success).toBe(false);
	});

	it('não remove bloqueio de outra organização', async () => {
		const returning = jest.fn().mockResolvedValue([]);
		const where = jest.fn().mockReturnValue({ returning });
		const banco = {
			delete: jest.fn().mockReturnValue({ where }),
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 10 }),
		} as unknown as OrganizacoesServico;
		const servico = new ConfiguracoesAgendaServico(banco, organizacoes);

		await expect(servico.removerBloqueio(1, 99)).rejects.toBeInstanceOf(
			NotFoundException,
		);
		expect(organizacoes.buscarPorUsuario).toHaveBeenCalledWith(1);
	});
});
