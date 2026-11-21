import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
		autenticacao.verificarEmail.mutate(token);
	}

	function reenviar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.reenviarVerificacao.mutate(email);
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
				{autenticacao.verificarEmail.isSuccess && (
					<p className="rounded-xl bg-marca-50 px-3 py-2 text-sm text-marca-700" role="status">
						{autenticacao.verificarEmail.data.mensagem}
					</p>
				)}
				{autenticacao.verificarEmail.isError && (
					<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{obterMensagemErro(autenticacao.verificarEmail.error)}
					</p>
				)}
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.verificarEmail.isPending}
				>
					Verificar e-mail
				</AcaoFormulario>
			</form>
			<div className="my-6 border-t border-slate-100" />
			<form className="space-y-4" onSubmit={reenviar}>
				<p className="text-sm text-slate-500">Não recebeu o link? Solicite outro.</p>
				<CampoTexto
					id="email-reenvio"
					rotulo="E-mail cadastrado"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(evento) => definirEmail(evento.target.value)}
					required
				/>
				{autenticacao.reenviarVerificacao.isSuccess && (
					<p className="rounded-xl bg-marca-50 px-3 py-2 text-sm text-marca-700" role="status">
						{autenticacao.reenviarVerificacao.data.mensagem}
					</p>
				)}
				{autenticacao.reenviarVerificacao.isError && (
					<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{obterMensagemErro(autenticacao.reenviarVerificacao.error)}
					</p>
				)}
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.reenviarVerificacao.isPending}
				>
					Reenviar link
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-sm text-slate-500">
				<Link className="font-semibold text-marca-700" to="/entrar">
					Voltar para entrar
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
