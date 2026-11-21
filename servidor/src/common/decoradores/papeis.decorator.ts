import { SetMetadata } from '@nestjs/common';
import type { PapelUsuario } from '../tipos/usuario-autenticado.interface';

export const CHAVE_PAPEIS = 'papeis_permitidos';

export const Papeis = (...papeis: PapelUsuario[]) =>
	SetMetadata(CHAVE_PAPEIS, papeis);
