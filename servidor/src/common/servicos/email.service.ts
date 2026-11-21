import {
	Injectable,
	ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailServico {
	private readonly resend: Resend;

	constructor(private readonly configuracao: ConfigService) {
		this.resend = new Resend(
			this.configuracao.getOrThrow<string>('RESEND_API_KEY'),
		);
	}

	async enviarVerificacao(
		email: string,
		nome: string,
		link: string,
	): Promise<void> {
		const resultado = await this.resend.emails.send({
			from: this.configuracao.getOrThrow<string>('RESEND_REMETENTE'),
			to: email,
			subject: 'Verifique seu e-mail no AgendaJá',
			html: `<p>Olá, ${this.escaparHtml(nome)}.</p><p><a href="${link}">Verificar meu e-mail</a></p><p>O link expira em 24 horas.</p>`,
			text: `Olá, ${nome}. Verifique seu e-mail acessando: ${link}\nO link expira em 24 horas.`,
		});

		if (resultado.error) {
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
		const resultado = await this.resend.emails.send({
			from: this.configuracao.getOrThrow<string>('RESEND_REMETENTE'),
			to: email,
			subject: 'Redefina sua senha do AgendaJá',
			html: `<p>Olá, ${this.escaparHtml(nome)}.</p><p><a href="${link}">Redefinir minha senha</a></p><p>O link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail.</p>`,
			text: `Olá, ${nome}. Redefina sua senha acessando: ${link}\nO link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail.`,
		});

		if (resultado.error) {
			throw new ServiceUnavailableException(
				'Não foi possível enviar o e-mail de recuperação.',
			);
		}
	}

	private escaparHtml(valor: string): string {
		return valor.replace(/[&<>"']/g, (caractere) => {
			const entidades: Record<string, string> = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			};

			return entidades[caractere];
		});
	}
}
