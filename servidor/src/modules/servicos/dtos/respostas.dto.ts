import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const categoriaPublicaSchema = z.object({
	id: z.number().int().positive(),
	nome: z.string(),
	criadoEm: z.date(),
});

export class CategoriaPublicaDto extends createZodDto(
	categoriaPublicaSchema,
) {}

export class ListaCategoriasDto extends createZodDto(
	z.array(categoriaPublicaSchema),
) {}

const categoriaResumoSchema = z
	.object({
		id: z.number().int().positive(),
		nome: z.string(),
	})
	.nullable();

export const servicoPublicoSchema = z.object({
	id: z.number().int().positive(),
	idOrganizacao: z.number().int().positive(),
	idCategoria: z.number().int().positive().nullable(),
	categoria: categoriaResumoSchema,
	nomeServico: z.string(),
	descricaoServico: z.string().nullable(),
	precoCentavos: z.number().int().min(0),
	duracaoMinutos: z.number().int().positive(),
	ativo: z.boolean(),
	criadoEm: z.date(),
	atualizadoEm: z.date(),
	desativadoEm: z.date().nullable(),
});

export class ServicoPublicoDto extends createZodDto(servicoPublicoSchema) {}

export class ListaServicosDto extends createZodDto(
	z.array(servicoPublicoSchema),
) {}

const horarioVitrineSchema = z.object({
	diaSemana: z.number().int().min(0).max(6),
	ativo: z.boolean(),
	horarioAbertura: z.string(),
	horarioFechamento: z.string(),
	inicioPausa: z.string().nullable(),
	fimPausa: z.string().nullable(),
});

const servicoVitrineSchema = z.object({
	id: z.number().int().positive(),
	nomeServico: z.string(),
	descricaoServico: z.string().nullable(),
	categoria: categoriaResumoSchema,
	precoCentavos: z.number().int().min(0),
	duracaoMinutos: z.number().int().positive(),
});

export const vitrinePublicaSchema = z.object({
	organizacao: z.object({
		id: z.number().int().positive(),
		nomeFantasia: z.string(),
		telefone: z.string().nullable(),
		endereco: z.string().nullable(),
		horarios: z.array(horarioVitrineSchema),
	}),
	servicos: z.array(servicoVitrineSchema),
});

export class VitrinePublicaDto extends createZodDto(vitrinePublicaSchema) {}
