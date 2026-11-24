import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../../common/servicos/email/email.module';
import { GuardaAutenticacao } from '../../common/guardas/guarda-autenticacao.guard';
import { GuardaPapeis } from '../../common/guardas/guarda-papeis.guard';
import { AutenticacaoControlador } from './autenticacao.controller';
import { AutenticacaoServico } from './autenticacao.service';

@Module({
	imports: [
		EmailModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configuracao: ConfigService) => ({
				secret: configuracao.getOrThrow<string>('JWT_SEGREDO'),
				signOptions: { expiresIn: '15m' },
			}),
		}),
	],
	controllers: [AutenticacaoControlador],
	providers: [AutenticacaoServico, GuardaAutenticacao, GuardaPapeis],
	// JwtModule é reexportado porque o GuardaAutenticacao depende do JwtService
	// no contexto de cada módulo que o utiliza em @UseGuards.
	exports: [GuardaAutenticacao, GuardaPapeis, JwtModule],
})
export class AutenticacaoModule { }
