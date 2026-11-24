import { ServiceUnavailableException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { createElement } from 'react';
import { EmailServico } from './email.service';
import { RecuperacaoSenha } from './templates/recuperacao-senha';
import { VerificacaoEmail } from './templates/verificacao-email';

jest.mock('nodemailer');

describe('serviço e templates de e-mail', () => {
	let enviarEmailMock: jest.Mock;
	let configuracaoMock: ConfigService;

	beforeEach(() => {
		enviarEmailMock = jest.fn().mockResolvedValue({ messageId: 'id-teste' });
		(nodemailer.createTransport as jest.Mock).mockReturnValue({
			sendMail: enviarEmailMock,
		} as unknown as Transporter);

		const valoresConfiguracao: Record<string, unknown> = {
			SMTP_HOST: 'smtp.gmail.com',
			SMTP_PORTA: 587,
			SMTP_SEGURO: false,
			SMTP_USUARIO: 'sistema@estudante.ifto.edu.br',
			SMTP_SENHA: 'senha-app-teste',
			SMTP_REMETENTE: 'AgendaJá <sistema@estudante.ifto.edu.br>',
		};

		configuracaoMock = {
			getOrThrow: jest.fn((chave: string) => valoresConfiguracao[chave]),
			get: jest.fn((chave: string) => valoresConfiguracao[chave]),
		} as unknown as ConfigService;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renderiza a verificação de e-mail para HTML sem erro de dispatcher', async () => {
		const html = await render(
			createElement(VerificacaoEmail, {
				nomeUsuario: 'Pessoa Cliente',
				linkVerificacao: 'https://agendaja.example/verificar-email?token=abc',
			}),
		);

		expect(html).toContain('Pessoa Cliente');
		expect(html).toContain('Verificar meu e-mail');
		expect(html).toContain('https://agendaja.example/verificar-email?token=abc');
	});

	it('renderiza a recuperação de senha para HTML', async () => {
		const html = await render(
			createElement(RecuperacaoSenha, {
				nomeUsuario: 'Pessoa Cliente',
				linkRecuperacao: 'https://agendaja.example/recuperar-senha?token=xyz',
			}),
		);

		expect(html).toContain('Pessoa Cliente');
		expect(html).toContain('Redefinir minha senha');
		expect(html).toContain('https://agendaja.example/recuperar-senha?token=xyz');
	});

	it('envia e-mail de verificação via Nodemailer com HTML e texto puro', async () => {
		const servico = new EmailServico(configuracaoMock);

		await servico.enviarVerificacao(
			'aluno@estudante.ifto.edu.br',
			'Aluno IFTO',
			'https://agendaja.example/verificar-email?token=123',
		);

		expect(enviarEmailMock).toHaveBeenCalledTimes(1);
		expect(enviarEmailMock).toHaveBeenCalledWith(
			expect.objectContaining({
				from: 'AgendaJá <sistema@estudante.ifto.edu.br>',
				to: 'aluno@estudante.ifto.edu.br',
				subject: 'Confirme seu e-mail no AgendaJá',
				html: expect.stringContaining('Aluno IFTO'),
				text: expect.stringContaining('ALUNO IFTO'),
			}),
		);
	});

	it('lança ServiceUnavailableException quando o transporte SMTP falha', async () => {
		enviarEmailMock.mockRejectedValueOnce(new Error('Falha de conexão SMTP'));
		const servico = new EmailServico(configuracaoMock);

		await expect(
			servico.enviarRecuperacao(
				'aluno@estudante.ifto.edu.br',
				'Aluno IFTO',
				'https://agendaja.example/recuperar-senha?token=123',
			),
		).rejects.toBeInstanceOf(ServiceUnavailableException);
	});
});
