import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validarConfiguracao } from './config/configuracao.schema';
import { BancoDadosModule } from './database/banco-dados.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';
import { ConfiguracoesAgendaModule } from './modules/configuracoes-agenda/configuracoes-agenda.module';
import { OrganizacoesModule } from './modules/organizacoes/organizacoes.module';
import { ServicosModule } from './modules/servicos/servicos.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [resolve(process.cwd(), '../.env'), resolve(process.cwd(), '.env')],
			validate: validarConfiguracao,
		}),
		BancoDadosModule,
		AutenticacaoModule,
		OrganizacoesModule,
		ConfiguracoesAgendaModule,
		ServicosModule,
	],
})
export class AppModule {}