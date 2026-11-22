import { render } from '@react-email/render';
import { createElement } from 'react';
import { RecuperacaoSenha } from './templates/recuperacao-senha';
import { VerificacaoEmail } from './templates/verificacao-email';

describe('templates de e-mail', () => {
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
});
