import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { AcaoFormulario } from '../componentes/AcaoFormulario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CartaoAutenticacao } from '../componentes/CartaoAutenticacao';
import { usarAutenticacao } from '../hooks/usarAutenticacao';

export function PaginaRecuperarSenha() {
	const [parametros] = useSearchParams();
	const token = parametros.get('token') ?? '';
	const [email, definirEmail] = useState('');
	const [senha, definirSenha] = useState('');
	const autenticacao = usarAutenticacao();

	function solicitar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.solicitarRecuperacaoSenha.mutate(email);
	}

	function redefinir(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.redefinirSenha.mutate({ token, senha });
	}

	return (
		<CartaoAutenticacao
			titulo={token ? 'Defina uma nova senha' : 'Recupere sua senha'}
			descricao={
				token
					? 'Escolha uma senha segura para voltar a acessar sua conta.'
					: 'Informe seu e-mail. Enviaremos instruções para redefinir sua senha.'
			}
		>
			{token ? (
				<form className="space-y-5" onSubmit={redefinir}>
					<CampoTexto
						id="senha"
						rotulo="Nova senha (mínimo de 8 caracteres)"
						type="password"
						autoComplete="new-password"
						value={senha}
						onChange={(evento) => definirSenha(evento.target.value)}
						minLength={8}
						maxLength={72}
						required
					/>
					{autenticacao.redefinirSenha.isSuccess && (
						<p className="rounded-xl bg-marca-50 px-3 py-2 text-sm text-marca-700" role="status">
							{autenticacao.redefinirSenha.data.mensagem}{' '}
							<Link className="font-semibold underline" to="/entrar">
								Entrar
							</Link>
						</p>
					)}
					{autenticacao.redefinirSenha.isError && (
						<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
							{obterMensagemErro(autenticacao.redefinirSenha.error)}
						</p>
					)}
					<AcaoFormulario
						type="submit"
						carregando={autenticacao.redefinirSenha.isPending}
					>
						Redefinir senha
					</AcaoFormulario>
				</form>
			) : (
				<form className="space-y-5" onSubmit={solicitar}>
					<CampoTexto
						id="email"
						rotulo="E-mail cadastrado"
						type="email"
						placeholder="exemplo@estudante.ifto.edu.br"
						autoComplete="email"
						value={email}
						onChange={(evento) => definirEmail(evento.target.value)}
						required
					/>
					{autenticacao.solicitarRecuperacaoSenha.isSuccess && (
						<p className="rounded-xl bg-marca-50 px-3 py-2 text-sm text-marca-700" role="status">
							{autenticacao.solicitarRecuperacaoSenha.data.mensagem}
						</p>
					)}
					{autenticacao.solicitarRecuperacaoSenha.isError && (
						<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
							{obterMensagemErro(autenticacao.solicitarRecuperacaoSenha.error)}
						</p>
					)}
					<AcaoFormulario
						type="submit"
						carregando={autenticacao.solicitarRecuperacaoSenha.isPending}
					>
						Enviar instruções
					</AcaoFormulario>
				</form>
			)}
			<p className="mt-6 text-center text-sm text-slate-500">
				<Link className="font-semibold text-marca-700" to="/entrar">
					Voltar para entrar
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
