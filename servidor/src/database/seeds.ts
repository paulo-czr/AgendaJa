import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as schema from './schemas/index';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

/**
 * Povoa o banco de dados com registros essenciais para desenvolvimento e validação manual.
 * Insere usuários de teste (cliente e prestador), organização, grade semanal, serviços,
 * agendamento e relatório técnico.
 */
async function semear() {
	const connectionString =
		process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error('A variável DATABASE_URL precisa estar configurada.');
	}

	const pool = new Pool({ connectionString });
	const db = drizzle(pool, { schema });

	console.log('Iniciando povoamento (seed) do banco de dados...');

	try {
		const [prestador] = await db
			.insert(schema.usuarios)
			.values({
				nome: 'Carlos Prestador',
				email: 'carlos@agendaja.com',
				senhaHash: '$2b$10$exemploHashSenhaSegura123456',
				telefone: '11999998888',
				role: 'prestador',
				emailVerificado: true,
			})
			.returning();

		const [cliente] = await db
			.insert(schema.usuarios)
			.values({
				nome: 'Mariana Cliente',
				email: 'mariana@agendaja.com',
				senhaHash: '$2b$10$exemploHashSenhaSegura654321',
				telefone: '11988887777',
				role: 'cliente',
				emailVerificado: true,
			})
			.returning();

		console.log(
			`Usuários criados: ${prestador.nome} (Prestador) e ${cliente.nome} (Cliente)`,
		);

		const [organizacao] = await db
			.insert(schema.organizacoes)
			.values({
				idUsuario: prestador.id,
				nomeFantasia: 'Estética Automotiva Brilho Já',
				documento: '12345678000199',
				endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
				capacidadeSimultanea: 2, // Suporta até 2 atendimentos simultâneos (Artigo 5.2)
			})
			.returning();

		console.log(`Organização criada: ${organizacao.nomeFantasia}`);

		// Grade padrão: Segunda (1) a Sábado (6), 08:00 às 18:00
		for (let dia = 1; dia <= 6; dia++) {
			await db.insert(schema.configuracoesAgenda).values({
				idOrganizacao: organizacao.id,
				diaSemana: dia,
				horarioAbertura: '08:00',
				horarioFechamento: '18:00',
				ativo: true,
			});
		}

		console.log('Configurações de agenda semanal criadas (Segunda a Sábado).');

		const [servicoLavagem] = await db
			.insert(schema.servicos)
			.values({
				idOrganizacao: organizacao.id,
				nomeServico: 'Lavagem Completa com Cera',
				descricaoServico:
					'Higienização interna, lavagem de pintura e aplicação de cera protetora.',
				preco: '80.00',
				duracaoMinutos: 60,
				ativo: true,
			})
			.returning();

		const [servicoPolimento] = await db
			.insert(schema.servicos)
			.values({
				idOrganizacao: organizacao.id,
				nomeServico: 'Polimento Técnico',
				descricaoServico: 'Remoção de riscos superficiais e restauração de brilho.',
				preco: '250.00',
				duracaoMinutos: 180,
				ativo: true,
			})
			.returning();

		console.log(
			`Serviços cadastrados: ${servicoLavagem.nomeServico}, ${servicoPolimento.nomeServico}`,
		);

		const agora = new Date();
		const inicioAgendamento = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
		inicioAgendamento.setHours(10, 0, 0, 0);

		const fimAgendamento = new Date(inicioAgendamento.getTime() + 60 * 60 * 1000);

		const [agendamento] = await db
			.insert(schema.agendamentos)
			.values({
				idCliente: cliente.id,
				idServico: servicoLavagem.id,
				dataHoraInicio: inicioAgendamento,
				dataHoraFim: fimAgendamento,
				status: 'confirmado',
				observacoes: 'Carro sedan preto, placa ABC-1234',
			})
			.returning();

		console.log(
			`Agendamento de exemplo criado para ${cliente.nome} no dia ${inicioAgendamento.toLocaleDateString()}`,
		);

		await db.insert(schema.relatorios).values({
			idCliente: cliente.id,
			idServico: servicoLavagem.id,
			idUsuario: prestador.id,
			idAgendamento: agendamento.id,
			nomePrestador: prestador.nome,
			observacao: 'Veículo em ótimo estado de conservação.',
			descricaoRelatorio:
				'Serviço executado com sucesso: lavagem de lataria, aspiração interna e cera líquida.',
		});

		console.log('Relatório pós-atendimento de exemplo criado.');
		console.log('Seed finalizado com sucesso!');
	} catch (erro) {
		console.error('Erro ao executar seed:', erro);
	} finally {
		await pool.end();
	}
}

semear();
