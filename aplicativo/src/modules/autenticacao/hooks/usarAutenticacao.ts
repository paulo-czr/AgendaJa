import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { autenticacaoServico } from '../servicos/autenticacaoServico';

export const CHAVE_USUARIO_ATUAL = ['usuario-atual'] as const;

export function usarAutenticacao() {
	const clienteConsultas = useQueryClient();
	const usuarioAtual = useQuery({
		queryKey: CHAVE_USUARIO_ATUAL,
		queryFn: async () => {
			try {
				return await autenticacaoServico.buscarUsuarioAtual();
			} catch (erro) {
				if (axios.isAxiosError(erro) && erro.response?.status === 401) {
					return null;
				}

				throw erro;
			}
		},
		retry: false,
		staleTime: 60_000,
	});

	const entrar = useMutation({
		mutationFn: autenticacaoServico.entrar,
		onSuccess: (usuario) => {
			clienteConsultas.setQueryData(CHAVE_USUARIO_ATUAL, usuario);
		},
	});
	const cadastrar = useMutation({
		mutationFn: autenticacaoServico.cadastrar,
	});
	const sair = useMutation({
		mutationFn: autenticacaoServico.sair,
		onSuccess: () => {
			clienteConsultas.setQueryData(CHAVE_USUARIO_ATUAL, null);
			clienteConsultas.removeQueries({ queryKey: CHAVE_USUARIO_ATUAL });
		},
	});
	const verificarEmail = useMutation({
		mutationFn: autenticacaoServico.verificarEmail,
	});
	const reenviarVerificacao = useMutation({
		mutationFn: autenticacaoServico.reenviarVerificacao,
	});
	const solicitarRecuperacaoSenha = useMutation({
		mutationFn: autenticacaoServico.solicitarRecuperacaoSenha,
	});
	const redefinirSenha = useMutation({
		mutationFn: ({
			token,
			senha,
		}: {
			token: string;
			senha: string;
		}) => autenticacaoServico.redefinirSenha(token, senha),
	});

	return {
		usuario: usuarioAtual.data ?? null,
		carregando: usuarioAtual.isPending,
		erroUsuario: usuarioAtual.error,
		entrar,
		cadastrar,
		sair,
		verificarEmail,
		reenviarVerificacao,
		solicitarRecuperacaoSenha,
		redefinirSenha,
	};
}
