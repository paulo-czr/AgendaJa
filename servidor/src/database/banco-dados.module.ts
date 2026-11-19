import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

export const BANCO_DADOS = 'BANCO_DADOS';
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

@Global()
@Module({
	providers: [bancoDadosProvider],
	exports: [BANCO_DADOS],
})
export class BancoDadosModule {}
