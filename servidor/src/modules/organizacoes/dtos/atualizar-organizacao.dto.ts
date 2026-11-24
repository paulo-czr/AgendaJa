import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { criarOrganizacaoSchema } from './criar-organizacao.dto';

/**
 * Edição parcial da organização. O `documento` fica de fora porque não pode
 * ser alterado após o cadastro (RF02); `strict` rejeita campos desconhecidos.
 */
export const atualizarOrganizacaoSchema = criarOrganizacaoSchema
	.omit({ documento: true })
	.partial()
	.strict()
	.refine((dados) => Object.keys(dados).length > 0, {
		message: 'Informe ao menos um campo para atualizar.',
	});

export class AtualizarOrganizacaoDto extends createZodDto(
	atualizarOrganizacaoSchema,
) {}
