import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const dataHoraSchema = z
	.string()
	.datetime({ offset: true, message: 'Informe uma data e hora válidas.' })
	.transform((valor) => new Date(valor));

export const criarBloqueioSchema = z
	.object({
		dataHoraInicio: dataHoraSchema,
		dataHoraFim: dataHoraSchema,
		motivo: z
			.string()
			.trim()
			.max(255)
			.nullish()
			.transform((motivo) => motivo || null),
	})
	.refine((dados) => dados.dataHoraFim > dados.dataHoraInicio, {
		path: ['dataHoraFim'],
		message: 'O fim do bloqueio deve ser depois do início.',
	});

export class CriarBloqueioDto extends createZodDto(criarBloqueioSchema) {}

export const parametroIdSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export class ParametroIdDto extends createZodDto(parametroIdSchema) {}
