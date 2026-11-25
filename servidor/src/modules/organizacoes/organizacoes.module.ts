import { Module } from '@nestjs/common';
import { AutenticacaoModule } from '../autenticacao/autenticacao.module';
import {
	OrganizacoesControlador,
	OrganizacoesPublicasControlador,
} from './organizacoes.controller';
import { OrganizacoesServico } from './organizacoes.service';

@Module({
	imports: [AutenticacaoModule],
	controllers: [OrganizacoesPublicasControlador, OrganizacoesControlador],
	providers: [OrganizacoesServico],
	exports: [OrganizacoesServico],
})
export class OrganizacoesModule {}
