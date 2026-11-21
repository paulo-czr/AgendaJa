import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const urlBancoDados = process.env.DATABASE_URL;

if (!urlBancoDados) {
	throw new Error('A variável DATABASE_URL precisa estar configurada.');
}

export default defineConfig({
	schema: './src/database/schemas/index.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: urlBancoDados,
	},
	verbose: true,
	strict: true,
});

