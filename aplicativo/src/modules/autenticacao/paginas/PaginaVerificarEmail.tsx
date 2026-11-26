import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { AcaoFormulario } from '../componentes/AcaoFormulario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CartaoAutenticacao } from '../componentes/CartaoAutenticacao';
import { usarAutenticacao } from '../hooks/usarAutenticacao';

export function PaginaVerificarEmail() {
	const [parametros] = useSearchParams();
	const [token, definirToken] = useState(parametros.get('token') ?? '');
	const [email, definirEmail] = useState('');
	const autenticacao = usarAutenticacao();

	function verificar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.verificarEmail.mutate(token, {
			onSuccess: (resposta) => notificar.sucesso(resposta.mensagem),
			onError: (falha) => notificar.erro(obterMensagemErro(falha)),
		});
	}

	function reenviar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.reenviarVerificacao.mutate(email, {
			onSuccess: (resposta) => notificar.sucesso(resposta.mensagem),
			onError: (falha) => notificar.erro(obterMensagemErro(falha)),
		});
	}

	return (
		<CartaoAutenticacao
			titulo="Confirme seu e-mail"
			descricao="Use o link recebido por e-mail para ativar sua conta. Se preferir, cole o código abaixo."
		>
			<form className="space-y-4" onSubmit={verificar}>
				<CampoTexto
					id="token"
					rotulo="Código de verificação"
					value={token}
					onChange={(evento) => definirToken(evento.target.value)}
					autoComplete="one-time-code"
					required
				/>
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.verificarEmail.isPending}
				>
					Verificar e-mail
				</AcaoFormulario>
			</form>
			<div className="my-6 border-t border-cor-borda" />
			<form className="space-y-4" onSubmit={reenviar}>
				<p className="text-xs text-cor-fonte-secundaria">
					Não recebeu o link? Solicite outro.
				</p>
				<CampoTexto
					id="email-reenvio"
					rotulo="E-mail cadastrado"
					type="email"
					placeholder="exemplo@estudante.ifto.edu.br"
					autoComplete="email"
					value={email}
					onChange={(evento) => definirEmail(evento.target.value)}
					required
				/>
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.reenviarVerificacao.isPending}
				>
					Reenviar link
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-[13px] text-cor-fonte-secundaria">
				<Link
					className="font-semibold text-cor-primaria-escura hover:underline"
					to="/entrar"
				>
					Voltar para entrar
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
