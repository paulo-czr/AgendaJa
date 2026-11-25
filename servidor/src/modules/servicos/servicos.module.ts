import { Module } from '@nestjs/common';
import { AutenticacaoModule } from '../autenticacao/autenticacao.module';
import { OrganizacoesModule } from '../organizacoes/organizacoes.module';
import {
	ServicosControlador,
	VitrineControlador,
} from './servicos.controller';
import { ServicosServico } from './servicos.service';

@Module({
	imports: [AutenticacaoModule, OrganizacoesModule],
	controllers: [ServicosControlador, VitrineControlador],
	providers: [ServicosServico],
	exports: [ServicosServico],
})
export class ServicosModule {}
