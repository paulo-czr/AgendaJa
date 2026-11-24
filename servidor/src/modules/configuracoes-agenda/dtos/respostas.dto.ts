import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const diaGradePublicoSchema = z.object({
	diaSemana: z.number().int().min(0).max(6),
	ativo: z.boolean(),
	horarioAbertura: z.string(),
	horarioFechamento: z.string(),
	inicioPausa: z.string().nullable(),
	fimPausa: z.string().nullable(),
});

export const gradePublicaSchema = z.object({
	dias: z.array(diaGradePublicoSchema),
});

export class GradePublicaDto extends createZodDto(gradePublicaSchema) {}

export const bloqueioPublicoSchema = z.object({
	id: z.number().int().positive(),
	dataHoraInicio: z.date(),
	dataHoraFim: z.date(),
	motivo: z.string().nullable(),
});

export class BloqueioPublicoDto extends createZodDto(bloqueioPublicoSchema) {}

export class ListaBloqueiosDto extends createZodDto(
	z.array(bloqueioPublicoSchema),
) {}
