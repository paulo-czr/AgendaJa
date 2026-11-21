import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { UsuarioAutenticado } from '../tipos/usuario-autenticado.interface';

interface RequisicaoAutenticada extends Request {
	usuario: UsuarioAutenticado;
}

export const UsuarioAtual = createParamDecorator(
	(_dados: unknown, contexto: ExecutionContext): UsuarioAutenticado => {
		const requisicao =
			contexto.switchToHttp().getRequest<RequisicaoAutenticada>();

		return requisicao.usuario;
	},
);
