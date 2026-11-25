import { createZodDto } from 'nestjs-zod';
import { criarServicoSchema } from './criar-servico.dto';

export const atualizarServicoSchema = criarServicoSchema
	.partial()
	.strict()
	.refine((dados) => Object.keys(dados).length > 0, {
		message: 'Informe ao menos um campo para atualizar.',
	});

export class AtualizarServicoDto extends createZodDto(atualizarServicoSchema) {}
