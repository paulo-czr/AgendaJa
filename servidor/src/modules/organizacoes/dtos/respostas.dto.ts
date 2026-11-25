import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const organizacaoPublicaSchema = z.object({
	id: z.number().int().positive(),
	nomeFantasia: z.string(),
	documento: z.string(),
	telefone: z.string().nullable(),
	endereco: z.string().nullable(),
	capacidadeSimultanea: z.number().int().positive(),
	duracaoPadraoMinutos: z.number().int().positive(),
});

export class OrganizacaoPublicaDto extends createZodDto(
	organizacaoPublicaSchema,
) {}

export const servicoDestaquePublicoSchema = z.object({
	id: z.number().int().positive(),
	nomeServico: z.string(),
	precoCentavos: z.number().int().min(0),
	duracaoMinutos: z.number().int().positive(),
	categoria: z.string().nullable(),
});

export const organizacaoVitrineResumoSchema = z.object({
	id: z.number().int().positive(),
	nomeFantasia: z.string(),
	endereco: z.string().nullable(),
	telefone: z.string().nullable(),
	totalServicosAtivos: z.number().int().min(0),
	servicosDestaque: z.array(servicoDestaquePublicoSchema),
});

export class ListaOrganizacoesPublicasDto extends createZodDto(
	z.array(organizacaoVitrineResumoSchema),
) {}

export const resumoDiaAgendaSchema = z.object({
	diaSemana: z.number().int().min(0).max(6),
	ativo: z.boolean(),
	horasAbertas: z.number().min(0),
	horarioAbertura: z.string().nullable(),
	horarioFechamento: z.string().nullable(),
	inicioPausa: z.string().nullable(),
	fimPausa: z.string().nullable(),
});

export const resumoCategoriaCatalogoSchema = z.object({
	nome: z.string(),
	totalServicos: z.number().int().min(0),
});

export const resumoEmpresaSchema = z.object({
	idOrganizacao: z.number().int().positive(),
	nomeFantasia: z.string(),
	endereco: z.string().nullable(),
	telefone: z.string().nullable(),
	capacidadeSimultanea: z.number().int().positive(),
	totalServicosAtivos: z.number().int().min(0),
	totalCategorias: z.number().int().min(0),
	diasAtivosSemana: z.number().int().min(0).max(7),
	agendaConfigurada: z.boolean(),
	gradeSemanal: z.array(resumoDiaAgendaSchema),
	servicosPorCategoria: z.array(resumoCategoriaCatalogoSchema),
});

export class ResumoEmpresaDto extends createZodDto(resumoEmpresaSchema) {}
