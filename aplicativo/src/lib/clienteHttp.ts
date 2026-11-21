import axios, {
	type InternalAxiosRequestConfig,
	type AxiosError,
} from 'axios';

interface ConfiguracaoComRenovacao extends InternalAxiosRequestConfig {
	tentouRenovar?: boolean;
}

const clienteHttp = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

let renovacaoEmAndamento: Promise<void> | null = null;

clienteHttp.interceptors.response.use(
	(resposta) => resposta,
	async (erro: AxiosError) => {
		const configuracao = erro.config as ConfiguracaoComRenovacao | undefined;
		const rota = configuracao?.url ?? '';
		const rotaDeAutenticacao =
			rota.startsWith('/autenticacao/entrar') ||
			rota.startsWith('/autenticacao/cadastrar') ||
			rota.startsWith('/autenticacao/renovar') ||
			rota.startsWith('/autenticacao/verificar-email') ||
			rota.startsWith('/autenticacao/reenviar-verificacao') ||
			rota.startsWith('/autenticacao/esqueci-senha') ||
			rota.startsWith('/autenticacao/redefinir-senha');

		if (
			erro.response?.status !== 401 ||
			!configuracao ||
			configuracao.tentouRenovar ||
			rotaDeAutenticacao
		) {
			return Promise.reject(erro);
		}

		configuracao.tentouRenovar = true;
		renovacaoEmAndamento ??= clienteHttp
			.post('/autenticacao/renovar')
			.then(() => undefined)
			.finally(() => {
				renovacaoEmAndamento = null;
			});

		try {
			await renovacaoEmAndamento;
			return await clienteHttp(configuracao);
		} catch (erroRenovacao) {
			return Promise.reject(erroRenovacao);
		}
	},
);

export default clienteHttp;
