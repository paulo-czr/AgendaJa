export type PapelUsuario = 'cliente' | 'prestador';

export interface UsuarioAutenticado {
	id: number;
	papel: PapelUsuario;
}
