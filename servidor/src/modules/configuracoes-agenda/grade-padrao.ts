/** Dia da grade semanal: 0 = Domingo … 6 = Sábado. */
export interface DiaGrade {
	diaSemana: number;
	ativo: boolean;
	horarioAbertura: string;
	horarioFechamento: string;
	inicioPausa: string | null;
	fimPausa: string | null;
}

/**
 * Grade criada junto com a organização: Seg a Sex das 08:00 às 18:00 com
 * pausa das 12:00 às 13:00; Sábado e Domingo inativos.
 */
export function criarGradePadrao(): DiaGrade[] {
	return Array.from({ length: 7 }, (_valor, diaSemana) => ({
		diaSemana,
		ativo: diaSemana >= 1 && diaSemana <= 5,
		horarioAbertura: '08:00',
		horarioFechamento: '18:00',
		inicioPausa: '12:00',
		fimPausa: '13:00',
	}));
}
