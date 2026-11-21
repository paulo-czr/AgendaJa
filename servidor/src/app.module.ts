import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validarConfiguracao } from './config/configuracao.schema';
import { BancoDadosModule } from './database/banco-dados.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [resolve(process.cwd(), '../.env'), resolve(process.cwd(), '.env')],
			validate: validarConfiguracao,
		}),
		BancoDadosModule,
		AutenticacaoModule,
	],
})
export class AppModule {}