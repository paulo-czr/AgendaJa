import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutPainel } from '../../../components/LayoutPainel';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import { CartaoBloqueios } from '../componentes/CartaoBloqueios';
import {
	CartaoDadosEmpresa,
	CartaoDuracaoPadrao,
	CartaoFuncionamento,
	CartaoPausa,
	CartaoSobreDisponibilidade,
	type AlterarCampo,
} from '../componentes/CartoesConfiguracoes';
import {
	criarFormularioInicial,
	dadosOrganizacao,
	formatarDocumento,
	formularioDaApi,
	gradeDoFormulario,
	validarFormulario,
	type FormularioConfiguracoes,
} from '../formulario';
import {
	CHAVE_GRADE_AGENDA,
	usarConfiguracoesAgenda,
} from '../hooks/usarConfiguracoesAgenda';
import { usarOrganizacao } from '../hooks/usarOrganizacao';

const ID_FORMULARIO = 'formulario-configuracoes';

type Aviso = { tipo: 'sucesso' | 'erro'; texto: string };

export function PaginaConfiguracoes() {
	const { usuario, sair } = usarAutenticacao();
	const navegar = useNavigate();
	const clienteConsultas = useQueryClient();
	const { organizacao, carregando, erro, criar, atualizar } = usarOrganizacao();
	const agenda = usarConfiguracoesAgenda(Boolean(organizacao));
	const [formulario, definirFormulario] = useState<FormularioConfiguracoes | null>(null);
	const [aviso, definirAviso] = useState<Aviso | null>(null);
	const [acabouDeCadastrar, definirAcabouDeCadastrar] = useState(false);

	const cadastrando = !carregando && !erro && organizacao === null;
	const salvando = criar.isPending || atualizar.isPending || agenda.salvarGrade.isPending;

	// Preenche o formulário uma única vez, quando os dados chegam da API.
	useEffect(() => {
		if (formulario) {
			return;
		}

		if (cadastrando) {
			definirFormulario(criarFormularioInicial(usuario?.telefone ?? ''));
		} else if (organizacao && agenda.grade) {
			definirFormulario(formularioDaApi(organizacao, agenda.grade));
		}
	}, [formulario, cadastrando, organizacao, agenda.grade, usuario?.telefone]);

	const alterar: AlterarCampo = (campo, valor) => {
		definirAviso(null);
		definirFormulario((atual) => (atual ? { ...atual, [campo]: valor } : atual));
	};

	async function salvar(evento: FormEvent<HTMLFormElement>): Promise<void> {
		evento.preventDefault();
		if (!formulario || salvando) {
			return;
		}

		const problema = validarFormulario(formulario, cadastrando);
		if (problema) {
			definirAviso({ tipo: 'erro', texto: problema });
			return;
		}

		definirAviso(null);
		try {
			if (cadastrando) {
				const criada = await criar.mutateAsync({
					...dadosOrganizacao(formulario),
					documento: formulario.documento,
				});
				definirFormulario((atual) =>
					atual ? { ...atual, documento: formatarDocumento(criada.documento) } : atual,
				);
			} else {
				await atualizar.mutateAsync(dadosOrganizacao(formulario));
			}

			await agenda.salvarGrade.mutateAsync(gradeDoFormulario(formulario));
			await clienteConsultas.invalidateQueries({ queryKey: CHAVE_GRADE_AGENDA });

			if (cadastrando) {
				definirAcabouDeCadastrar(true);
			}
			definirAviso({
				tipo: 'sucesso',
				texto: cadastrando
					? 'Empresa cadastrada! Sua agenda já está pronta para receber reservas.'
					: 'Alterações salvas com sucesso.',
			});
		} catch (falha) {
			definirAviso({ tipo: 'erro', texto: obterMensagemErro(falha) });
		}
	}

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => navegar('/entrar', { replace: true }),
		});
	}

	const textoBotao = salvando
		? 'Salvando...'
		: cadastrando
			? 'Cadastrar empresa'
			: 'Salvar alterações';
	const botaoSalvar = (classes: string) => (
		<button
			type="submit"
			form={ID_FORMULARIO}
			disabled={!formulario || salvando}
			className={`h-12 rounded-lg bg-marca-500 px-6 text-[13px] font-semibold text-petroleo transition hover:bg-marca-600 disabled:cursor-not-allowed disabled:opacity-60 lg:h-11 lg:w-[184px] lg:text-xs ${classes}`}
		>
			{textoBotao}
		</button>
	);

	return (
		<LayoutPainel
			itemAtivo="configuracoes"
			titulo="Configurações"
			descricao={
				cadastrando
					? 'Cadastre sua empresa para começar a receber agendamentos.'
					: 'Defina como e quando sua empresa atende.'
			}
			empresa={{
				nome: organizacao?.nomeFantasia ?? 'Sua empresa',
				detalhe: organizacao?.endereco || (organizacao ? 'Endereço não informado' : 'Cadastro pendente'),
			}}
			acao={botaoSalvar('w-full lg:mt-1.5')}
			aoSair={encerrarSessao}
			saindo={sair.isPending}
		>
			{erro || agenda.erroGrade ? (
				<p className="rounded-[14px] bg-white p-6 text-sm text-perigo" role="alert">
					{obterMensagemErro(erro ?? agenda.erroGrade)}
				</p>
			) : !formulario ? (
				<p className="rounded-[14px] bg-white p-6 text-sm text-tinta-suave">
					Carregando configurações...
				</p>
			) : (
				<>
					{cadastrando && (
						<p className="mb-5 rounded-[14px] border border-marca-500/30 bg-marca-50 px-5 py-4 text-[13px] text-marca-700">
							Falta pouco! Preencha os dados da sua empresa e as regras da agenda para
							liberar as demais áreas do AgendaJá.
						</p>
					)}

					{aviso && (
						<div
							role={aviso.tipo === 'erro' ? 'alert' : 'status'}
							className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-5 py-4 text-[13px] ${
								aviso.tipo === 'erro'
									? 'bg-perigo-fundo text-perigo'
									: 'bg-marca-50 font-medium text-marca-700'
							}`}
						>
							{aviso.texto}
							{acabouDeCadastrar && aviso.tipo === 'sucesso' && (
								<Link to="/" className="font-semibold underline">
									Ir para o início
								</Link>
							)}
						</div>
					)}

					<form
						id={ID_FORMULARIO}
						onSubmit={(evento) => void salvar(evento)}
						noValidate
						className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,432px)_minmax(0,1fr)] lg:items-start lg:gap-6"
					>
						{/* No mobile, `contents` deixa os cartões em uma coluna única ordenada pelo `order`. */}
						<div className="contents lg:flex lg:flex-col lg:gap-6">
							<CartaoDadosEmpresa
								formulario={formulario}
								alterar={alterar}
								cadastrando={cadastrando}
							/>
							<div className="order-last lg:order-none">
								<CartaoSobreDisponibilidade
									capacidade={Number(formulario.capacidadeSimultanea) || 1}
								/>
							</div>
						</div>
						<div className="contents lg:flex lg:flex-col lg:gap-6">
							<CartaoFuncionamento formulario={formulario} alterar={alterar} />
							<CartaoPausa formulario={formulario} alterar={alterar} />
							<CartaoDuracaoPadrao formulario={formulario} alterar={alterar} />
							{/* Só existe depois do cadastro: bloqueios pertencem a uma empresa. */}
							{organizacao && <CartaoBloqueios />}
						</div>
					</form>

					<div className="mt-5 lg:hidden">{botaoSalvar('w-full')}</div>
				</>
			)}
		</LayoutPainel>
	);
}
