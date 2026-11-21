import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { PapelUsuario } from '../servicos/autenticacaoServico';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { AcaoFormulario } from '../componentes/AcaoFormulario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CartaoAutenticacao } from '../componentes/CartaoAutenticacao';
import { usarAutenticacao } from '../hooks/usarAutenticacao';

export function PaginaCadastro() {
	const [nome, definirNome] = useState('');
	const [email, definirEmail] = useState('');
	const [senha, definirSenha] = useState('');
	const [telefone, definirTelefone] = useState('');
	const [role, definirRole] = useState<PapelUsuario>('cliente');
	const autenticacao = usarAutenticacao();
	const navegar = useNavigate();

	function enviarFormulario(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.cadastrar.mutate(
			{ nome, email, senha, telefone, role },
			{ onSuccess: () => navegar('/verificar-email', { replace: true }) },
		);
	}

	return (
		<CartaoAutenticacao
			titulo="Crie sua conta"
			descricao="Preencha seus dados. Enviaremos um link para confirmar seu e-mail."
		>
			<form className="space-y-4" onSubmit={enviarFormulario}>
				<CampoTexto
					id="nome"
					rotulo="Nome completo"
					autoComplete="name"
					value={nome}
					onChange={(evento) => definirNome(evento.target.value)}
					maxLength={150}
					required
				/>
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
					id="telefone"
					rotulo="Telefone"
					type="tel"
					autoComplete="tel"
					value={telefone}
					onChange={(evento) => definirTelefone(evento.target.value)}
					maxLength={20}
					required
				/>
				<CampoTexto
					id="senha"
					rotulo="Senha (mínimo de 8 caracteres)"
					type="password"
					autoComplete="new-password"
					value={senha}
					onChange={(evento) => definirSenha(evento.target.value)}
					minLength={8}
					maxLength={72}
					required
				/>
				<label className="block space-y-2 text-sm font-medium text-slate-700" htmlFor="role">
					Tipo de conta
					<select
						id="role"
						className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3"
						value={role}
						onChange={(evento) => {
							if (
								evento.target.value === 'cliente' ||
								evento.target.value === 'prestador'
							) {
								definirRole(evento.target.value);
							}
						}}
					>
						<option value="cliente">Cliente</option>
						<option value="prestador">Prestador</option>
					</select>
				</label>
				{autenticacao.cadastrar.isError && (
					<p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{obterMensagemErro(autenticacao.cadastrar.error)}
					</p>
				)}
				<AcaoFormulario
					type="submit"
					carregando={autenticacao.cadastrar.isPending}
				>
					Criar conta
				</AcaoFormulario>
			</form>
			<p className="mt-6 text-center text-sm text-slate-500">
				Já tem uma conta?{' '}
				<Link className="font-semibold text-marca-700" to="/entrar">
					Entrar
				</Link>
			</p>
		</CartaoAutenticacao>
	);
}
