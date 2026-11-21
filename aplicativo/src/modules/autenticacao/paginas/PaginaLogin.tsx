import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { AcaoFormulario } from '../componentes/AcaoFormulario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CartaoAutenticacao } from '../componentes/CartaoAutenticacao';
import { usarAutenticacao } from '../hooks/usarAutenticacao';

export function PaginaLogin() {
	const [email, definirEmail] = useState('');
	const [senha, definirSenha] = useState('');
	const autenticacao = usarAutenticacao();
	const navegar = useNavigate();
	const localizacao = useLocation();
	const estado: unknown = localizacao.state;
	const destino =
		typeof estado === 'object' &&
		estado !== null &&
		'de' in estado &&
		typeof estado.de === 'string'
			? estado.de
			: '/';

	function enviarFormulario(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.entrar.mutate(
			{ email, senha },
			{ onSuccess: () => navegar(destino, { replace: true }) },
		);
	}

	return (
		<CartaoAutenticacao
			titulo="Entre na sua conta"
			descricao="Acesse seus agendamentos e continue de onde parou."
		>
			<form className="space-y-5" onSubmit={enviarFormulario}>
				<CampoTexto
					id="email"
					rotulo="E-mail"
					type="email"
					autoComplete="email"
					value={email}
					onChange={(evento) => definirEmail(evento.target.value)}
					required
				/>
				<CampoTexto
					id="senha"
					rotulo="Senha"
					type="password"
					autoComplete="current-password"
					value={senha}
					onChange={(evento) => definirSenha(evento.target.value)}
					required
				/>
				<div className="-mt-2 text-right">
					<Link
						className="text-sm font-medium text-marca-700 hover:text-marca-600"
						to="/recuperar-senha"
					>
						Esqueceu a senha?
					</Link>
				</div>
				{autenticacao.entrar.isError && (
					<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{obterMensagemErro(autenticacao.entrar.error)}
					</p>
				)}
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.entrar.isPending}
				>
					Entrar
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-sm text-slate-500">
				Ainda não tem uma conta?{' '}
				<Link className="font-semibold text-marca-700" to="/cadastro">
					Cadastre-se
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
