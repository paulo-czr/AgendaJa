import clienteHttp from '../../../lib/clienteHttp';

export type PapelUsuario = 'cliente' | 'prestador';

export interface UsuarioPublico {
	id: number;
	nome: string;
	email: string;
	telefone: string;
	role: PapelUsuario;
}

interface RespostaSessao {
	usuario: UsuarioPublico;
}

interface RespostaMensagem {
	mensagem: string;
}

interface Credenciais {
	email: string;
	senha: string;
}

interface DadosCadastro extends Credenciais {
	nome: string;
	telefone: string;
	role: PapelUsuario;
}

export const autenticacaoServico = {
	async buscarUsuarioAtual(): Promise<UsuarioPublico> {
		const resposta = await clienteHttp.get<UsuarioPublico>('/autenticacao/eu');
		return resposta.data;
	},

	async entrar(dados: Credenciais): Promise<UsuarioPublico> {
		const resposta = await clienteHttp.post<RespostaSessao>(
			'/autenticacao/entrar',
			dados,
		);
		return resposta.data.usuario;
	},

	async cadastrar(dados: DadosCadastro): Promise<RespostaMensagem> {
		const resposta = await clienteHttp.post<RespostaMensagem>(
			'/autenticacao/cadastrar',
			dados,
		);
		return resposta.data;
	},

	async sair(): Promise<void> {
		await clienteHttp.post('/autenticacao/sair');
	},

	async verificarEmail(token: string): Promise<RespostaMensagem> {
		const resposta = await clienteHttp.post<RespostaMensagem>(
			'/autenticacao/verificar-email',
			{ token },
		);
		return resposta.data;
	},

	async reenviarVerificacao(email: string): Promise<RespostaMensagem> {
		const resposta = await clienteHttp.post<RespostaMensagem>(
			'/autenticacao/reenviar-verificacao',
			{ email },
		);
		return resposta.data;
	},

	async solicitarRecuperacaoSenha(email: string): Promise<RespostaMensagem> {
		const resposta = await clienteHttp.post<RespostaMensagem>(
			'/autenticacao/esqueci-senha',
			{ email },
		);
		return resposta.data;
	},

	async redefinirSenha(
		token: string,
		senha: string,
	): Promise<RespostaMensagem> {
		const resposta = await clienteHttp.post<RespostaMensagem>(
			'/autenticacao/redefinir-senha',
			{ token, senha },
		);
		return resposta.data;
	},
};
