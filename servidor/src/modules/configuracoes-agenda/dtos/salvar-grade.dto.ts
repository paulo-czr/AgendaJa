import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/** Horário no formato `HH:MM`, de 00:00 a 23:59. */
export const horarioSchema = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use o formato HH:MM (00:00 a 23:59).');

/** Converte `HH:MM` em minutos desde a meia-noite para comparar horários. */
export function paraMinutos(horario: string): number {
	const [horas, minutos] = horario.split(':').map(Number);
	return horas * 60 + minutos;
}

export const diaGradeSchema = z
	.object({
		diaSemana: z.number().int().min(0).max(6),
		ativo: z.boolean(),
		horarioAbertura: horarioSchema,
		horarioFechamento: horarioSchema,
		inicioPausa: horarioSchema.nullable().default(null),
		fimPausa: horarioSchema.nullable().default(null),
	})
	.superRefine((dia, contexto) => {
		const abertura = paraMinutos(dia.horarioAbertura);
		const fechamento = paraMinutos(dia.horarioFechamento);

		if (abertura >= fechamento) {
			contexto.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['horarioFechamento'],
				message: 'O encerramento deve ser depois da abertura.',
			});
		}

		if ((dia.inicioPausa === null) !== (dia.fimPausa === null)) {
			contexto.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['fimPausa'],
				message: 'Informe o início e o fim da pausa, ou deixe os dois vazios.',
			});
			return;
		}

		if (dia.inicioPausa !== null && dia.fimPausa !== null) {
			const inicioPausa = paraMinutos(dia.inicioPausa);
			const fimPausa = paraMinutos(dia.fimPausa);

			if (
				inicioPausa >= fimPausa ||
				inicioPausa < abertura ||
				fimPausa > fechamento
			) {
				contexto.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['inicioPausa'],
					message: 'A pausa deve começar e terminar dentro do expediente.',
				});
			}
		}
	});

/** Grade completa: exatamente um registro para cada dia da semana. */
export const salvarGradeSchema = z.object({
	dias: z
		.array(diaGradeSchema)
		.length(7, 'Envie os 7 dias da semana.')
		.refine(
			(dias) => new Set(dias.map((dia) => dia.diaSemana)).size === 7,
			{ message: 'Cada dia da semana deve aparecer uma única vez.' },
		),
});

export class SalvarGradeDto extends createZodDto(salvarGradeSchema) {}
