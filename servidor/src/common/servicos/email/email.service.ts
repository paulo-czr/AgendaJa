import {
	Injectable,
	ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { VerificacaoEmail } from './templates/verificacao-email';
import { RecuperacaoSenha } from './templates/recuperacao-senha';

@Injectable()
export class EmailServico {
	private readonly transportador: Transporter;
	private readonly remetente: string;

	constructor(private readonly configuracao: ConfigService) {
		this.remetente = this.configuracao.getOrThrow<string>('SMTP_REMETENTE');
		this.transportador = nodemailer.createTransport({
			host: this.configuracao.getOrThrow<string>('SMTP_HOST'),
			port: this.configuracao.getOrThrow<number>('SMTP_PORTA'),
			secure: this.configuracao.get<boolean>('SMTP_SEGURO') ?? false,
			auth: {
				user: this.configuracao.getOrThrow<string>('SMTP_USUARIO'),
				pass: this.configuracao.getOrThrow<string>('SMTP_SENHA'),
			},
		});
	}

	async enviarVerificacao(
		email: string,
		nome: string,
		link: string,
	): Promise<void> {
		const elementoTemplate = VerificacaoEmail({
			nomeUsuario: nome,
			linkVerificacao: link,
		});

		const [corpoHtml, corpoTexto] = await Promise.all([
			render(elementoTemplate),
			render(elementoTemplate, { plainText: true }),
		]);

		try {
			await this.transportador.sendMail({
				from: this.remetente,
				to: email,
				subject: 'Confirme seu e-mail no AgendaJá',
				html: corpoHtml,
				text: corpoTexto,
			});
		} catch {
			throw new ServiceUnavailableException(
				'Não foi possível enviar o e-mail de verificação.',
			);
		}
	}

	async enviarRecuperacao(
		email: string,
		nome: string,
		link: string,
	): Promise<void> {
		const elementoTemplate = RecuperacaoSenha({
			nomeUsuario: nome,
			linkRecuperacao: link,
		});

		const [corpoHtml, corpoTexto] = await Promise.all([
			render(elementoTemplate),
			render(elementoTemplate, { plainText: true }),
		]);

		try {
			await this.transportador.sendMail({
				from: this.remetente,
				to: email,
				subject: 'Redefina sua senha do AgendaJá',
				html: corpoHtml,
				text: corpoTexto,
			});
		} catch {
			throw new ServiceUnavailableException(
				'Não foi possível enviar o e-mail de recuperação.',
			);
		}
	}
}