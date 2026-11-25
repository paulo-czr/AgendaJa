import {
	Body,
	Controller,
	Get,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Papeis } from '../../common/decoradores/papeis.decorator';
import { UsuarioAtual } from '../../common/decoradores/usuario-atual.decorator';
import { GuardaAutenticacao } from '../../common/guardas/guarda-autenticacao.guard';
import { GuardaPapeis } from '../../common/guardas/guarda-papeis.guard';
import type { UsuarioAutenticado } from '../../common/tipos/usuario-autenticado.interface';
import { AtualizarOrganizacaoDto } from './dtos/atualizar-organizacao.dto';
import { BuscarOrganizacoesPublicasDto } from './dtos/buscar-organizacoes-publicas.dto';
import { CriarOrganizacaoDto } from './dtos/criar-organizacao.dto';
import {
	ListaOrganizacoesPublicasDto,
	OrganizacaoPublicaDto,
	ResumoEmpresaDto,
} from './dtos/respostas.dto';
import { OrganizacoesServico } from './organizacoes.service';

@Controller('organizacoes')
export class OrganizacoesPublicasControlador {
	constructor(private readonly organizacoes: OrganizacoesServico) {}

	@Get('publicas')
	@ZodSerializerDto(ListaOrganizacoesPublicasDto)
	listarPublicas(@Query() consulta: BuscarOrganizacoesPublicasDto) {
		return this.organizacoes.listarPublicas(consulta.busca);
	}
}

/** A organização é sempre a do prestador logado; nenhuma rota recebe `id`. */
@Controller('organizacoes')
@UseGuards(GuardaAutenticacao, GuardaPapeis)
@Papeis('prestador')
export class OrganizacoesControlador {
	constructor(private readonly organizacoes: OrganizacoesServico) {}

	@Post()
	@ZodSerializerDto(OrganizacaoPublicaDto)
	criar(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: CriarOrganizacaoDto,
	) {
		return this.organizacoes.criar(usuario.id, dados);
	}

	@Get('minha')
	@ZodSerializerDto(OrganizacaoPublicaDto)
	buscarMinha(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.organizacoes.buscarMinha(usuario.id);
	}

	@Get('minha/resumo')
	@ZodSerializerDto(ResumoEmpresaDto)
	obterResumoEmpresa(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.organizacoes.obterResumoEmpresa(usuario.id);
	}

	@Patch('minha')
	@ZodSerializerDto(OrganizacaoPublicaDto)
	atualizarMinha(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: AtualizarOrganizacaoDto,
	) {
		return this.organizacoes.atualizarMinha(usuario.id, dados);
	}
}
