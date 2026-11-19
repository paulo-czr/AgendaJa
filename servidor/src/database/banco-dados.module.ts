import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas/index';

/**
 * Token de injeção de dependência para a instância do cliente Drizzle ORM.
 */
export const BANCO_DADOS = 'BANCO_DADOS';

/**
 * Tipo tipado do banco de dados Drizzle com todos os schemas da aplicação.
 */
export type BancoDados = NodePgDatabase<typeof schema>;

const bancoDadosProvider = {
	provide: BANCO_DADOS,
	useFactory: () => {
		const connectionString =
			process.env.DATABASE_URL ||
			'postgresql://agendaja:agendaja_dev_password@localhost:5432/agendaja_db';

		const pool = new Pool({
			connectionString,
		});

		return drizzle(pool, { schema });
	},
};

/**
 * Módulo global responsável por gerenciar a conexão e o ciclo de vida do PostgreSQL com Drizzle ORM.
 */
@Global()
@Module({
	providers: [bancoDadosProvider],
	exports: [BANCO_DADOS],
})
export class BancoDadosModule {}
