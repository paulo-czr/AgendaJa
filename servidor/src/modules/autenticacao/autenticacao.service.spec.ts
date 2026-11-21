import {
	ConflictException,
	ForbiddenException,
	BadRequestException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import bcrypt = require('bcrypt');
import type { BancoDados } from '../../database/banco-dados.module';
import type { EmailServico } from '../../common/servicos/email.service';
import { AutenticacaoServico } from './autenticacao.service';
import { cadastrarSchema } from './dtos/cadastrar.dto';

function criarConsulta(resultado: unknown[]) {
	const limit = jest.fn().mockResolvedValue(resultado);
	const where = jest.fn().mockReturnValue({ limit });
	const from = jest.fn().mockReturnValue({ where });

	return { from, where, limit };
}

describe('serviço de autenticação', () => {
	let servico: AutenticacaoServico;
	let selecionar: jest.Mock;
	let inserir: jest.Mock;
	let valoresInsercao: jest.Mock;
	let jwt: Pick<JwtService, 'signAsync' | 'verifyAsync'>;

	beforeEach(() => {
		selecionar = jest.fn();
		inserir = jest.fn();
		valoresInsercao = jest.fn().mockResolvedValue([]);
		inserir.mockReturnValue({ values: valoresInsercao });
		jwt = {
			signAsync: jest
				.fn()
				.mockResolvedValueOnce('atualizacao')
				.mockResolvedValueOnce('acesso'),
			verifyAsync: jest.fn(),
		};

		const banco = {
			select: selecionar,
			insert: inserir,
		} as unknown as BancoDados;
		const configuracao = {
			getOrThrow: jest.fn().mockReturnValue('segredo-de-teste-com-mais-de-32-caracteres'),
		} as unknown as ConfigService;
		const email = {
			enviarVerificacao: jest.fn(),
			enviarRecuperacao: jest.fn(),
		} as unknown as EmailServico;

		servico = new AutenticacaoServico(
			banco,
			jwt as JwtService,
			configuracao,
			email,
		);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('rejeita cadastro com e-mail já existente', async () => {
		selecionar.mockReturnValue(criarConsulta([{ id: 1 }]));

		await expect(
			servico.cadastrar(
				cadastrarSchema.parse({
					nome: 'Pessoa Cliente',
					email: 'pessoa@example.com',
					senha: 'senha-segura-123',
					telefone: '11999999999',
					role: 'cliente',
				}),
			),
		).rejects.toBeInstanceOf(ConflictException);
	});

	it('bloqueia login de conta ainda não verificada', async () => {
		selecionar.mockReturnValue(
			criarConsulta([
				{
					id: 1,
					nome: 'Pessoa Cliente',
					email: 'pessoa@example.com',
					senhaHash: 'hash',
					telefone: '11999999999',
					role: 'cliente',
					emailVerificado: false,
				},
			]),
		);
		jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

		await expect(
			servico.entrar({ email: 'pessoa@example.com', senha: 'senha-segura' }),
		).rejects.toBeInstanceOf(ForbiddenException);
	});

	it('cria sessão para credenciais válidas sem retornar o hash da senha', async () => {
		selecionar.mockReturnValue(
			criarConsulta([
				{
					id: 1,
					nome: 'Pessoa Cliente',
					email: 'pessoa@example.com',
					senhaHash: 'hash',
					telefone: '11999999999',
					role: 'cliente',
					emailVerificado: true,
				},
			]),
		);
		jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

		const sessao = await servico.entrar({
			email: 'pessoa@example.com',
			senha: 'senha-segura',
		});

		expect(sessao.usuario).toEqual({
			id: 1,
			nome: 'Pessoa Cliente',
			email: 'pessoa@example.com',
			telefone: '11999999999',
			role: 'cliente',
		});
		expect(sessao.tokenAcesso).toBe('acesso');
		expect(sessao.tokenAtualizacao).toBe('atualizacao');
		expect(valoresInsercao).toHaveBeenCalledWith(
			expect.objectContaining({ tipo: 'refresh_token' }),
		);
	});

	it('rejeita token de recuperação expirado', async () => {
		const consultaTokenExpirado = criarConsulta([
			{
				id: 1,
				idUsuario: 1,
				expiraEm: new Date(Date.now() - 1_000),
			},
		]);
		const transacao = {
			select: jest.fn().mockReturnValue(consultaTokenExpirado),
		};
		const banco = {
			transaction: jest.fn(
				(operacao: (transacao: unknown) => Promise<unknown>) =>
					operacao(transacao),
			),
		} as unknown as BancoDados;
		const configuracao = {
			getOrThrow: jest.fn().mockReturnValue('segredo-de-teste-com-mais-de-32-caracteres'),
		} as unknown as ConfigService;
		const email = {
			enviarVerificacao: jest.fn(),
			enviarRecuperacao: jest.fn(),
		} as unknown as EmailServico;
		servico = new AutenticacaoServico(
			banco,
			jwt as JwtService,
			configuracao,
			email,
		);
		await expect(
			servico.redefinirSenha({
				token: 'a'.repeat(64),
				senha: 'senha-segura-123',
			}),
		).rejects.toBeInstanceOf(BadRequestException);
	});
});
