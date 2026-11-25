import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Papeis } from '../../common/decoradores/papeis.decorator';
import { UsuarioAtual } from '../../common/decoradores/usuario-atual.decorator';
import { GuardaAutenticacao } from '../../common/guardas/guarda-autenticacao.guard';
import { GuardaPapeis } from '../../common/guardas/guarda-papeis.guard';
import type { UsuarioAutenticado } from '../../common/tipos/usuario-autenticado.interface';
import { RespostaMensagemDto } from '../autenticacao/dtos/respostas.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { AtualizarServicoDto } from './dtos/atualizar-servico.dto';
import {
	CriarCategoriaDto,
	ParametroIdCategoriaDto,
} from './dtos/criar-categoria.dto';
import {
	CriarServicoDto,
	ParametroIdOrganizacaoDto,
	ParametroIdServicoDto,
} from './dtos/criar-servico.dto';
import {
	CategoriaPublicaDto,
	ListaCategoriasDto,
	ListaServicosDto,
	ServicoPublicoDto,
	VitrinePublicaDto,
} from './dtos/respostas.dto';
import { ServicosServico } from './servicos.service';

@Controller('servicos')
@UseGuards(GuardaAutenticacao, GuardaPapeis)
@Papeis('prestador')
export class ServicosControlador {
	constructor(private readonly servicos: ServicosServico) {}

	@Post('categorias')
	@ZodSerializerDto(CategoriaPublicaDto)
	criarCategoria(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: CriarCategoriaDto,
	) {
		return this.servicos.criarCategoria(usuario.id, dados);
	}

	@Get('categorias')
	@ZodSerializerDto(ListaCategoriasDto)
	listarCategorias(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.servicos.listarCategorias(usuario.id);
	}

	@Patch('categorias/:id')
	@ZodSerializerDto(CategoriaPublicaDto)
	atualizarCategoria(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Param() parametros: ParametroIdCategoriaDto,
		@Body() dados: AtualizarCategoriaDto,
	) {
		return this.servicos.atualizarCategoria(usuario.id, parametros.id, dados);
	}

	@Delete('categorias/:id')
	@ZodSerializerDto(RespostaMensagemDto)
	removerCategoria(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Param() parametros: ParametroIdCategoriaDto,
	) {
		return this.servicos.removerCategoria(usuario.id, parametros.id);
	}

	@Post()
	@ZodSerializerDto(ServicoPublicoDto)
	criar(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: CriarServicoDto,
	) {
		return this.servicos.criar(usuario.id, dados);
	}

	@Get('meus')
	@ZodSerializerDto(ListaServicosDto)
	listarMeus(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.servicos.listarMeus(usuario.id);
	}

	@Patch(':id')
	@ZodSerializerDto(ServicoPublicoDto)
	atualizar(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Param() parametros: ParametroIdServicoDto,
		@Body() dados: AtualizarServicoDto,
	) {
		return this.servicos.atualizar(usuario.id, parametros.id, dados);
	}

	@Delete(':id')
	@ZodSerializerDto(RespostaMensagemDto)
	desativar(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Param() parametros: ParametroIdServicoDto,
	) {
		return this.servicos.desativar(usuario.id, parametros.id);
	}
}

@Controller('vitrine')
export class VitrineControlador {
	constructor(private readonly servicos: ServicosServico) {}

	@Get(':idOrganizacao')
	@ZodSerializerDto(VitrinePublicaDto)
	buscarVitrine(@Param() parametros: ParametroIdOrganizacaoDto) {
		return this.servicos.buscarVitrinePublica(parametros.idOrganizacao);
	}
}
