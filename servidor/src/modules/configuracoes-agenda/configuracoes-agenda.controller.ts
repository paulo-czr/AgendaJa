import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Papeis } from '../../common/decoradores/papeis.decorator';
import { UsuarioAtual } from '../../common/decoradores/usuario-atual.decorator';
import { GuardaAutenticacao } from '../../common/guardas/guarda-autenticacao.guard';
import { GuardaPapeis } from '../../common/guardas/guarda-papeis.guard';
import type { UsuarioAutenticado } from '../../common/tipos/usuario-autenticado.interface';
import { RespostaMensagemDto } from '../autenticacao/dtos/respostas.dto';
import { ConfiguracoesAgendaServico } from './configuracoes-agenda.service';
import { CriarBloqueioDto, ParametroIdDto } from './dtos/criar-bloqueio.dto';
import {
	BloqueioPublicoDto,
	GradePublicaDto,
	ListaBloqueiosDto,
} from './dtos/respostas.dto';
import { SalvarGradeDto } from './dtos/salvar-grade.dto';

@Controller('configuracoes-agenda')
@UseGuards(GuardaAutenticacao, GuardaPapeis)
@Papeis('prestador')
export class ConfiguracoesAgendaControlador {
	constructor(private readonly configuracoes: ConfiguracoesAgendaServico) {}

	@Get()
	@ZodSerializerDto(GradePublicaDto)
	buscarGrade(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.configuracoes.buscarGrade(usuario.id);
	}

	@Put()
	@ZodSerializerDto(GradePublicaDto)
	salvarGrade(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: SalvarGradeDto,
	) {
		return this.configuracoes.salvarGrade(usuario.id, dados);
	}

	@Get('bloqueios')
	@ZodSerializerDto(ListaBloqueiosDto)
	listarBloqueios(@UsuarioAtual() usuario: UsuarioAutenticado) {
		return this.configuracoes.listarBloqueios(usuario.id);
	}

	@Post('bloqueios')
	@ZodSerializerDto(BloqueioPublicoDto)
	criarBloqueio(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Body() dados: CriarBloqueioDto,
	) {
		return this.configuracoes.criarBloqueio(usuario.id, dados);
	}

	@Delete('bloqueios/:id')
	@ZodSerializerDto(RespostaMensagemDto)
	removerBloqueio(
		@UsuarioAtual() usuario: UsuarioAutenticado,
		@Param() parametros: ParametroIdDto,
	) {
		return this.configuracoes.removerBloqueio(usuario.id, parametros.id);
	}
}
