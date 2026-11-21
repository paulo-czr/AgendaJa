import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { CHAVE_PAPEIS } from '../decoradores/papeis.decorator';
import type {
	PapelUsuario,
	UsuarioAutenticado,
} from '../tipos/usuario-autenticado.interface';

interface RequisicaoAutenticada extends Request {
	usuario?: UsuarioAutenticado;
}

@Injectable()
export class GuardaPapeis implements CanActivate {
	constructor(private readonly refletor: Reflector) {}

	canActivate(contexto: ExecutionContext): boolean {
		const papeis = this.refletor.getAllAndOverride<PapelUsuario[]>(
			CHAVE_PAPEIS,
			[contexto.getHandler(), contexto.getClass()],
		);

		if (!papeis?.length) {
			return true;
		}

		const requisicao =
			contexto.switchToHttp().getRequest<RequisicaoAutenticada>();

		if (!requisicao.usuario || !papeis.includes(requisicao.usuario.papel)) {
			throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
		}

		return true;
	}
}
