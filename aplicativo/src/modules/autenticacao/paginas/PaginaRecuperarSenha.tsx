import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { AcaoFormulario } from '../componentes/AcaoFormulario';
import { CampoTexto } from '../componentes/CampoTexto';
import { CartaoAutenticacao } from '../componentes/CartaoAutenticacao';
import { usarAutenticacao } from '../hooks/usarAutenticacao';

export function PaginaRecuperarSenha() {
	const [parametros] = useSearchParams();
	const navegar = useNavigate();
	const token = parametros.get('token') ?? '';
	const [email, definirEmail] = useState('');
	const [senha, definirSenha] = useState('');
	const autenticacao = usarAutenticacao();

	function solicitar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.solicitarRecuperacaoSenha.mutate(email, {
			onSuccess: (resposta) => notificar.sucesso(resposta.mensagem),
			onError: (falha) => notificar.erro(obterMensagemErro(falha)),
		});
	}

	function redefinir(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		autenticacao.redefinirSenha.mutate(
			{ token, senha },
			{
				onSuccess: (resposta) => {
					notificar.sucesso(resposta.mensagem);
					navegar('/entrar', { replace: true });
				},
				onError: (falha) => notificar.erro(obterMensagemErro(falha)),
			},
		);
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
					<AcaoFormulario
						type="submit"
						carregando={autenticacao.solicitarRecuperacaoSenha.isPending}
					>
						Enviar instruções
					</AcaoFormulario>
				</form>
			)}
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
