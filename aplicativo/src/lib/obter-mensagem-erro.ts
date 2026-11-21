import axios from 'axios';

interface RespostaErro {
	message?: string | string[];
}

export function obterMensagemErro(erro: unknown): string {
	if (axios.isAxiosError<RespostaErro>(erro)) {
		const mensagem = erro.response?.data?.message;
		if (Array.isArray(mensagem)) {
			return mensagem.join(' ');
		}

		if (mensagem) {
			return mensagem;
		}
	}

	return 'Não foi possível concluir a solicitação. Tente novamente.';
}
