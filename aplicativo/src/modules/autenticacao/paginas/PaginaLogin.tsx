import { useState, type FormEvent } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { notificar } from '../../../lib/notificacoes';
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
				onError: (falha) => notificar.erro(obterMensagemErro(falha)),
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
					icone={<Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />}
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
					icone={<Lock className="size-4" strokeWidth={1.75} aria-hidden="true" />}
					required
				/>
				<div className="-mt-2 text-right">
					<Link
						className="text-xs font-semibold text-cor-primaria-escura hover:underline"
						to="/recuperar-senha"
					>
						Esqueceu a senha?
					</Link>
				</div>
				<AcaoFormulario type="submit" carregando={autenticacao.entrar.isPending}>
					Entrar
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-[13px] text-cor-fonte-secundaria">
				Ainda não tem uma conta?{' '}
				<Link
					className="font-semibold text-cor-primaria-escura hover:underline"
					to="/cadastro"
				>
					Cadastre-se
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
