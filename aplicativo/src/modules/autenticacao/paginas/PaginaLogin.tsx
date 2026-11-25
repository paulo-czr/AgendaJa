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
			{
				onSuccess: (usuarioLogado) => {
					const rotaDestino =
						destino === '/' && usuarioLogado.role === 'prestador'
							? '/empresa'
							: destino;
					navegar(rotaDestino, { replace: true });
				},
			},
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
					placeholder="exemplo@estudante.ifto.edu.br"
					autoComplete="email"
					value={email}
					onChange={(evento) => definirEmail(evento.target.value)}
					icone={
						<svg
							className="size-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.8}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
							/>
						</svg>
					}
					required
				/>
				<CampoTexto
					id="senha"
					rotulo="Senha"
					type="password"
					placeholder="************"
					autoComplete="current-password"
					value={senha}
					onChange={(evento) => definirSenha(evento.target.value)}
					icone={
						<svg
							className="size-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.8}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
					}
					required
				/>
				<div className="-mt-2 text-right">
					<Link
						className="text-xs font-semibold text-marca-700 hover:underline"
						to="/recuperar-senha"
					>
						Esqueceu a senha?
					</Link>
				</div>
				{autenticacao.entrar.isError && (
					<p
						className="rounded-lg bg-perigo-fundo px-3 py-2.5 text-xs text-perigo"
						role="alert"
					>
						{obterMensagemErro(autenticacao.entrar.error)}
					</p>
				)}
				<AcaoFormulario type="submit" carregando={autenticacao.entrar.isPending}>
					Entrar
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-[13px] text-tinta-suave">
				Ainda não tem uma conta?{' '}
				<Link
					className="font-semibold text-marca-700 hover:underline"
					to="/cadastro"
				>
					Cadastre-se
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
