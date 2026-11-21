import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function iniciarAplicacao(): Promise<void> {
	const aplicacao = await NestFactory.create(AppModule);
	const configuracao = aplicacao.get(ConfigService);

	aplicacao.use(cookieParser());
	aplicacao.enableCors({
		origin: configuracao.getOrThrow<string>('URL_APLICATIVO'),
		credentials: true,
	});
	aplicacao.useGlobalPipes(new ZodValidationPipe());

	await aplicacao.listen(configuracao.getOrThrow<number>('PORTA_SERVIDOR'));
}

void iniciarAplicacao();