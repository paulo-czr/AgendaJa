import {
	Injectable,
	ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { VerificacaoEmail } from './templates/verificacao-email';
import { RecuperacaoSenha } from './templates/recuperacao-senha';

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
			subject: 'Confirme seu e-mail no AgendaJá',
			react: VerificacaoEmail({
				nomeUsuario: nome,
				linkVerificacao: link,
			}),
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
			react: RecuperacaoSenha({
				nomeUsuario: nome,
				linkRecuperacao: link,
			}),
		});

		if (resultado.error) {
			throw new ServiceUnavailableException(
				'Não foi possível enviar o e-mail de recuperação.',
			);
		}
	}
}