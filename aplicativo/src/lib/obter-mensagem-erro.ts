import axios from 'axios';

interface RespostaErro {
	message?: string | string[];
	/** Detalhes enviados pelo `ZodValidationPipe` (nestjs-zod) em erros 400. */
	errors?: Array<{ message?: string }>;
}

export function obterMensagemErro(erro: unknown): string {
	if (axios.isAxiosError<RespostaErro>(erro)) {
		const mensagemValidacao = erro.response?.data?.errors?.[0]?.message;
		if (mensagemValidacao) {
			return mensagemValidacao;
		}

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
