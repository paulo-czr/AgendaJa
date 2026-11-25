import { ConflictException, NotFoundException } from '@nestjs/common';
import type { BancoDados } from '../../database/banco-dados.module';
import type { OrganizacoesServico } from '../organizacoes/organizacoes.service';
import { criarServicoSchema } from './dtos/criar-servico.dto';
import { ServicosServico } from './servicos.service';

describe('validação de serviços (Zod)', () => {
	it('aceita qualquer duração inteira positiva (ex: 15, 25, 45, 90)', () => {
		for (const duracaoMinutos of [1, 15, 25, 45, 90]) {
			const resultado = criarServicoSchema.safeParse({
				nomeServico: 'Corte de Cabelo',
				precoCentavos: 5000,
				duracaoMinutos,
			});

			expect(resultado.success).toBe(true);
		}
	});

	it('rejeita duração zero, negativa ou decimal', () => {
		for (const duracaoMinutos of [0, -10, 30.5]) {
			const resultado = criarServicoSchema.safeParse({
				nomeServico: 'Corte de Cabelo',
				precoCentavos: 5000,
				duracaoMinutos,
			});

			expect(resultado.success).toBe(false);
		}
	});

	it('rejeita preço negativo ou não inteiro', () => {
		for (const precoCentavos of [-1, 49.9]) {
			const resultado = criarServicoSchema.safeParse({
				nomeServico: 'Corte de Cabelo',
				precoCentavos,
				duracaoMinutos: 30,
			});

			expect(resultado.success).toBe(false);
		}
	});
});

describe('serviço de catálogo e vitrine', () => {
	it('vincula criação exclusivamente à organização do prestador autenticado', async () => {
		const registroCriado = {
			id: 1,
			idOrganizacao: 42,
			idCategoria: null,
			nomeServico: 'Lavagem Completa',
			descricaoServico: null,
			precoCentavos: 8000,
			duracaoMinutos: 60,
			ativo: true,
			criadoEm: new Date(),
			atualizadoEm: new Date(),
			desativadoEm: null,
		};
		const returning = jest.fn().mockResolvedValue([registroCriado]);
		const values = jest.fn().mockReturnValue({ returning });
		const banco = {
			insert: jest.fn().mockReturnValue({ values }),
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 42 }),
		} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);
		const criado = await servico.criar(7, {
			nomeServico: 'Lavagem Completa',
			descricaoServico: null,
			idCategoria: null,
			precoCentavos: 8000,
			duracaoMinutos: 60,
			ativo: true,
		});

		expect(organizacoes.buscarPorUsuario).toHaveBeenCalledWith(7);
		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({ idOrganizacao: 42 }),
		);
		expect(criado.idOrganizacao).toBe(42);
	});

	it('bloqueia edição quando o serviço pertence a outra organização', async () => {
		const returning = jest.fn().mockResolvedValue([]);
		const where = jest.fn().mockReturnValue({ returning });
		const set = jest.fn().mockReturnValue({ where });
		const banco = {
			update: jest.fn().mockReturnValue({ set }),
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 10 }),
		} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);

		await expect(
			servico.atualizar(1, 99, { nomeServico: 'Novo nome' }),
		).rejects.toBeInstanceOf(NotFoundException);
	});

	it('executa exclusão lógica sem usar DELETE físico e bloqueia outra organização', async () => {
		const returning = jest.fn().mockResolvedValue([{ id: 5 }]);
		const where = jest.fn().mockReturnValue({ returning });
		const set = jest.fn().mockReturnValue({ where });
		const deleteFn = jest.fn();
		const banco = {
			update: jest.fn().mockReturnValue({ set }),
			delete: deleteFn,
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 10 }),
		} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);
		const resposta = await servico.desativar(1, 5);

		expect(deleteFn).not.toHaveBeenCalled();
		expect(set).toHaveBeenCalledWith(
			expect.objectContaining({
				ativo: false,
				desativadoEm: expect.any(Date),
			}),
		);
		expect(resposta.mensagem).toContain('desativado');

		returning.mockResolvedValueOnce([]);
		await expect(servico.desativar(1, 99)).rejects.toBeInstanceOf(
			NotFoundException,
		);
	});

	it('retorna apenas serviços ativos na vitrine pública com categoria vinculada', async () => {
		const limitOrg = jest.fn().mockResolvedValue([
			{
				id: 10,
				nomeFantasia: 'Barbearia Central',
				telefone: '11999999999',
				endereco: 'Rua A, 100',
			},
		]);
		const whereOrg = jest.fn().mockReturnValue({ limit: limitOrg });
		const fromOrg = jest.fn().mockReturnValue({ where: whereOrg });

		const orderByHorarios = jest.fn().mockResolvedValue([]);
		const whereHorarios = jest
			.fn()
			.mockReturnValue({ orderBy: orderByHorarios });
		const fromHorarios = jest.fn().mockReturnValue({ where: whereHorarios });

		const linhasServicos = [
			{
				id: 1,
				nomeServico: 'Corte',
				descricaoServico: null,
				precoCentavos: 4500,
				duracaoMinutos: 30,
				categoriaId: 3,
				categoriaNome: 'Cabelo',
			},
		];
		const orderByServicos = jest.fn().mockResolvedValue(linhasServicos);
		const whereServicos = jest
			.fn()
			.mockReturnValue({ orderBy: orderByServicos });
		const leftJoinServicos = jest
			.fn()
			.mockReturnValue({ where: whereServicos });
		const fromServicos = jest
			.fn()
			.mockReturnValue({ leftJoin: leftJoinServicos });

		const select = jest
			.fn()
			.mockReturnValueOnce({ from: fromOrg })
			.mockReturnValueOnce({ from: fromHorarios })
			.mockReturnValueOnce({ from: fromServicos });

		const banco = { select } as unknown as BancoDados;
		const organizacoes = {} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);
		const vitrine = await servico.buscarVitrinePublica(10);

		expect(vitrine.organizacao.nomeFantasia).toBe('Barbearia Central');
		expect(vitrine.servicos).toEqual([
			{
				id: 1,
				nomeServico: 'Corte',
				descricaoServico: null,
				categoria: { id: 3, nome: 'Cabelo' },
				precoCentavos: 4500,
				duracaoMinutos: 30,
			},
		]);
		expect(leftJoinServicos).toHaveBeenCalledTimes(1);
		expect(whereServicos).toHaveBeenCalledTimes(1);
	});
});

describe('categorias de serviços e vínculo de posse', () => {
	it('impede cadastro de categoria duplicada na mesma organização', async () => {
		const limit = jest.fn().mockResolvedValue([{ id: 1 }]);
		const where = jest.fn().mockReturnValue({ limit });
		const from = jest.fn().mockReturnValue({ where });
		const banco = {
			select: jest.fn().mockReturnValue({ from }),
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 10 }),
		} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);

		await expect(
			servico.criarCategoria(1, { nome: 'Cabelo' }),
		).rejects.toBeInstanceOf(ConflictException);
	});

	it('rejeita vincular serviço a categoria de outra organização', async () => {
		const limit = jest.fn().mockResolvedValue([]);
		const where = jest.fn().mockReturnValue({ limit });
		const from = jest.fn().mockReturnValue({ where });
		const banco = {
			select: jest.fn().mockReturnValue({ from }),
		} as unknown as BancoDados;
		const organizacoes = {
			buscarPorUsuario: jest.fn().mockResolvedValue({ id: 10 }),
		} as unknown as OrganizacoesServico;

		const servico = new ServicosServico(banco, organizacoes);

		await expect(
			servico.criar(1, {
				nomeServico: 'Barba',
				descricaoServico: null,
				idCategoria: 999,
				precoCentavos: 3500,
				duracaoMinutos: 30,
				ativo: true,
			}),
		).rejects.toBeInstanceOf(NotFoundException);
	});
});
