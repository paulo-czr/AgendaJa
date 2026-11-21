import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type {
	PapelUsuario,
	UsuarioAutenticado,
} from '../tipos/usuario-autenticado.interface';

interface CargaJwt {
	sub?: string;
	tipo?: string;
	papel?: PapelUsuario;
}

interface RequisicaoAutenticada extends Request {
	usuario?: UsuarioAutenticado;
}

@Injectable()
export class GuardaAutenticacao implements CanActivate {
	constructor(
		private readonly jwt: JwtService,
		private readonly configuracao: ConfigService,
	) {}

	async canActivate(contexto: ExecutionContext): Promise<boolean> {
		const requisicao =
			contexto.switchToHttp().getRequest<RequisicaoAutenticada>();
		const token = requisicao.cookies?.token_acesso;

		if (!token) {
			throw new UnauthorizedException('Sessão não autenticada.');
		}

		let carga: CargaJwt;

		try {
			carga = await this.jwt.verifyAsync<CargaJwt>(token, {
				secret: this.configuracao.getOrThrow<string>('JWT_SEGREDO'),
			});
		} catch (erro) {
			if (this.ehErroToken(erro)) {
				throw new UnauthorizedException('Sessão inválida ou expirada.');
			}

			throw erro;
		}

		const id = Number(carga.sub);
		if (
			carga.tipo !== 'acesso' ||
			!Number.isSafeInteger(id) ||
			id <= 0 ||
			(carga.papel !== 'cliente' && carga.papel !== 'prestador')
		) {
			throw new UnauthorizedException('Sessão inválida.');
		}

		requisicao.usuario = { id, papel: carga.papel };
		return true;
	}

	private ehErroToken(erro: unknown): boolean {
		return (
			erro instanceof Error &&
			['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(
				erro.name,
			)
		);
	}
}
