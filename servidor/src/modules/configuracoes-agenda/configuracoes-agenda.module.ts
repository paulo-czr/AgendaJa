import { Module } from '@nestjs/common';
import { AutenticacaoModule } from '../autenticacao/autenticacao.module';
import { OrganizacoesModule } from '../organizacoes/organizacoes.module';
import { ConfiguracoesAgendaControlador } from './configuracoes-agenda.controller';
import { ConfiguracoesAgendaServico } from './configuracoes-agenda.service';

@Module({
	imports: [AutenticacaoModule, OrganizacoesModule],
	controllers: [ConfiguracoesAgendaControlador],
	providers: [ConfiguracoesAgendaServico],
})
export class ConfiguracoesAgendaModule {}
