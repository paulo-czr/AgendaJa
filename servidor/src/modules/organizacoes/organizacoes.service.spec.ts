import { ConflictException } from '@nestjs/common';
import type { BancoDados } from '../../database/banco-dados.module';
import {
	criarOrganizacaoSchema,
	documentoValido,
} from './dtos/criar-organizacao.dto';
import { OrganizacoesServico } from './organizacoes.service';

function criarConsulta(resultado: unknown[]) {
	const limit = jest.fn().mockResolvedValue(resultado);
	const where = jest.fn().mockReturnValue({ limit });
	const from = jest.fn().mockReturnValue({ where });

	return { from };
}

const dadosValidos = criarOrganizacaoSchema.parse({
	nomeFantasia: 'Barbearia Central',
	documento: '11.222.333/0001-81',
	telefone: '(81) 3333-4444',
	endereco: 'Boa Viagem, Recife — PE',
});

describe('serviço de organizações', () => {
	let selecionar: jest.Mock;
	let transacao: { insert: jest.Mock };
	let insercaoOrganizacao: { values: jest.Mock };
	let servico: OrganizacoesServico;

	beforeEach(() => {
		selecionar = jest.fn();
		const returning = jest
			.fn()
			.mockResolvedValue([{ id: 7, idUsuario: 1, ...dadosValidos }]);
		insercaoOrganizacao = { values: jest.fn().mockReturnValue({ returning }) };
		transacao = { insert: jest.fn().mockReturnValue(insercaoOrganizacao) };

		const banco = {
			select: selecionar,
			transaction: jest.fn(
				(executar: (executor: typeof transacao) => Promise<unknown>) =>
					executar(transacao),
			),
		} as unknown as BancoDados;

		servico = new OrganizacoesServico(banco);
	});

	it('impede um segundo cadastro de empresa para o mesmo prestador', async () => {
		selecionar.mockReturnValueOnce(criarConsulta([{ id: 3 }]));

		await expect(servico.criar(1, dadosValidos)).rejects.toBeInstanceOf(
			ConflictException,
		);
	});

	it('rejeita CPF/CNPJ já cadastrado por outra empresa', async () => {
		selecionar
			.mockReturnValueOnce(criarConsulta([]))
			.mockReturnValueOnce(criarConsulta([{ id: 5 }]));

		await expect(servico.criar(1, dadosValidos)).rejects.toBeInstanceOf(
			ConflictException,
		);
	});

	it('cria a empresa junto com a grade semanal padrão', async () => {
		selecionar
			.mockReturnValueOnce(criarConsulta([]))
			.mockReturnValueOnce(criarConsulta([]));
		const valoresGrade = jest.fn().mockResolvedValue([]);
		transacao.insert
			.mockReturnValueOnce(insercaoOrganizacao)
			.mockReturnValueOnce({ values: valoresGrade });

		const organizacao = await servico.criar(1, dadosValidos);
		const grade = valoresGrade.mock.calls[0][0] as Array<{
			idOrganizacao: number;
			diaSemana: number;
			ativo: boolean;
		}>;

		expect(organizacao.id).toBe(7);
		expect(organizacao.documento).toBe('11222333000181');
		expect(grade).toHaveLength(7);
		expect(grade.every((dia) => dia.idOrganizacao === 7)).toBe(true);
		expect(grade.filter((dia) => dia.ativo).map((dia) => dia.diaSemana)).toEqual(
			[1, 2, 3, 4, 5],
		);
	});
});

describe('validação de CPF/CNPJ', () => {
	it.each(['529.982.247-25', '11.222.333/0001-81'])('aceita %s', (documento) => {
		expect(documentoValido(documento.replace(/\D/g, ''))).toBe(true);
	});

	it.each(['529.982.247-26', '11.111.111/1111-11', '123'])(
		'rejeita %s',
		(documento) => {
			expect(documentoValido(documento.replace(/\D/g, ''))).toBe(false);
		},
	);
});
