import {
	Inject,
	Injectable,
	Module,
	Global,
	OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas/index';

/**
 * Token de injeção de dependência para a instância do cliente Drizzle ORM.
 */
export const BANCO_DADOS = 'BANCO_DADOS';
export const CONEXAO_BANCO = 'CONEXAO_BANCO';

/**
 * Tipo tipado do banco de dados Drizzle com todos os schemas da aplicação.
 */
export type BancoDados = NodePgDatabase<typeof schema>;

const conexaoBancoProvider = {
	provide: CONEXAO_BANCO,
	inject: [ConfigService],
	useFactory: (configuracao: ConfigService) =>
		new Pool({
			connectionString: configuracao.getOrThrow<string>('DATABASE_URL'),
		}),
};

const bancoDadosProvider = {
	provide: BANCO_DADOS,
	inject: [CONEXAO_BANCO],
	useFactory: (conexao: Pool) => drizzle(conexao, { schema }),
};

@Injectable()
class CicloVidaBanco implements OnModuleDestroy {
	constructor(@Inject(CONEXAO_BANCO) private readonly conexao: Pool) {}

	async onModuleDestroy(): Promise<void> {
		await this.conexao.end();
	}
}

/**
 * Módulo global responsável por gerenciar a conexão e o ciclo de vida do PostgreSQL com Drizzle ORM.
 */
@Global()
@Module({
	providers: [conexaoBancoProvider, bancoDadosProvider, CicloVidaBanco],
	exports: [BANCO_DADOS],
})
export class BancoDadosModule {}
