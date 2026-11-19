import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega variáveis do arquivo .env da raiz do monorepo e do servidor
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export default defineConfig({
	schema: './src/database/schemas/index.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url:
			process.env.DATABASE_URL ||
			'postgresql://agendaja:agendaja_dev_password@localhost:5432/agendaja_db',
	},
	verbose: true,
	strict: true,
});

