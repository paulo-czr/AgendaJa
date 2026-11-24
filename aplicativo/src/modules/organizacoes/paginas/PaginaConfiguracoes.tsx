import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
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
	formulariosIguais,
	gradeDoFormulario,
	ID_CAMPO_FORMULARIO,
	validarCamposFormulario,
	type ErrosFormularioConfiguracoes,
	type FormularioConfiguracoes,
} from '../formulario';
import {
	CHAVE_GRADE_AGENDA,
	usarConfiguracoesAgenda,
} from '../hooks/usarConfiguracoesAgenda';
import { usarOrganizacao } from '../hooks/usarOrganizacao';

const ID_FORMULARIO = 'formulario-configuracoes';

type Aviso = { tipo: 'sucesso' | 'erro'; texto: string };

interface PropriedadesBotaoSalvar {
	salvando: boolean;
	cadastrando: boolean;
	desabilitado: boolean;
	className?: string;
}

function BotaoSalvarConfiguracoes({
	salvando,
	cadastrando,
	desabilitado,
	className = '',
}: PropriedadesBotaoSalvar) {
	const texto = salvando
		? 'Salvando…'
		: cadastrando
			? 'Cadastrar empresa'
			: 'Salvar alterações';

	return (
		<button
			type="submit"
			form={ID_FORMULARIO}
			disabled={desabilitado || salvando}
			className={`h-11 rounded-lg bg-marca-500 px-6 text-[13px] font-semibold text-petroleo transition-colors hover:bg-marca-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 [touch-action:manipulation] lg:w-[184px] lg:text-xs ${className}`}
		>
			{texto}
		</button>
	);
}

function EsqueletoConfiguracoes() {
	return (
		<div
			role="status"
			aria-live="polite"
			aria-label="Carregando configurações…"
			className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,432px)_minmax(0,1fr)] lg:items-start lg:gap-6"
		>
			<div className="space-y-6">
				<div className="rounded-2xl border border-borda/80 bg-white p-6">
					<div className="h-5 w-36 rounded bg-superficie-neutra" />
					<div className="mt-2 h-3.5 w-56 rounded bg-superficie" />
					<div className="mt-6 space-y-5">
						<div className="h-16 rounded-lg bg-superficie" />
						<div className="h-16 rounded-lg bg-superficie" />
						<div className="h-16 rounded-lg bg-superficie" />
						<div className="h-16 rounded-lg bg-superficie" />
					</div>
				</div>
				<div className="h-64 rounded-2xl bg-petroleo/90 p-6" />
			</div>
			<div className="space-y-6">
				<div className="h-64 rounded-2xl border border-borda/80 bg-white p-6" />
				<div className="h-44 rounded-2xl border border-borda/80 bg-white p-6" />
				<div className="h-44 rounded-2xl border border-borda/80 bg-white p-6" />
			</div>
			<span className="sr-only">Carregando configurações…</span>
		</div>
	);
}

export function PaginaConfiguracoes() {
	const { usuario, sair } = usarAutenticacao();
	const navegar = useNavigate();
	const clienteConsultas = useQueryClient();
	const { organizacao, carregando, erro, criar, atualizar } = usarOrganizacao();
	const agenda = usarConfiguracoesAgenda(Boolean(organizacao));

	const [formulario, definirFormulario] =
		useState<FormularioConfiguracoes | null>(null);
	const [formularioBase, definirFormularioBase] =
		useState<FormularioConfiguracoes | null>(null);
	const [errosCampos, definirErrosCampos] =
		useState<ErrosFormularioConfiguracoes>({});
	const [aviso, definirAviso] = useState<Aviso | null>(null);
	const [acabouDeCadastrar, definirAcabouDeCadastrar] = useState(false);

	const cadastrando = !carregando && !erro && organizacao === null;
	const salvando =
		criar.isPending || atualizar.isPending || agenda.salvarGrade.isPending;

	const possuiAlteracoes = useMemo(
		() =>
			cadastrando
				? Boolean(formulario)
				: !formulariosIguais(formulario, formularioBase),
		[cadastrando, formulario, formularioBase],
	);

	// Preenche o formulário uma única vez, quando os dados chegam da API.
	useEffect(() => {
		if (formulario) {
			return;
		}

		if (cadastrando) {
			const inicial = criarFormularioInicial(usuario?.telefone ?? '');
			definirFormulario(inicial);
			definirFormularioBase(inicial);
		} else if (organizacao && agenda.grade) {
			const carregado = formularioDaApi(organizacao, agenda.grade);
			definirFormulario(carregado);
			definirFormularioBase(carregado);
		}
	}, [formulario, cadastrando, organizacao, agenda.grade, usuario?.telefone]);

	// Alerta antes de fechar ou recarregar a aba quando há mudanças pendentes.
	useEffect(() => {
		if (cadastrando || !possuiAlteracoes || salvando) {
			return;
		}

		function aoSairDaPagina(evento: BeforeUnloadEvent): void {
			evento.preventDefault();
		}

		window.addEventListener('beforeunload', aoSairDaPagina);
		return () => window.removeEventListener('beforeunload', aoSairDaPagina);
	}, [cadastrando, possuiAlteracoes, salvando]);

	const alterar = useCallback<AlterarCampo>((campo, valor) => {
		definirAviso(null);
		definirErrosCampos((atual) => {
			if (!atual[campo]) {
				return atual;
			}
			const copia = { ...atual };
			delete copia[campo];
			return copia;
		});
		definirFormulario((atual) =>
			atual ? { ...atual, [campo]: valor } : atual,
		);
	}, []);

	function descartarAlteracoes(): void {
		if (!formularioBase) {
			return;
		}
		definirFormulario(formularioBase);
		definirErrosCampos({});
		definirAviso(null);
	}

	async function salvar(evento: FormEvent<HTMLFormElement>): Promise<void> {
		evento.preventDefault();
		if (!formulario || salvando) {
			return;
		}

		const errosValidacao = validarCamposFormulario(formulario, cadastrando);
		const camposComErro = Object.keys(errosValidacao) as Array<
			keyof FormularioConfiguracoes
		>;

		if (camposComErro.length > 0) {
			definirErrosCampos(errosValidacao);
			const primeiroCampo = camposComErro[0];
			const primeiroErro = errosValidacao[primeiroCampo];
			definirAviso({
				tipo: 'erro',
				texto: primeiroErro ?? 'Revise os campos destacados antes de salvar.',
			});

			const idElemento = ID_CAMPO_FORMULARIO[primeiroCampo];
			const elemento = document.getElementById(idElemento);
			elemento?.focus();
			return;
		}

		definirErrosCampos({});
		definirAviso(null);
		try {
			let novoEstado = formulario;

			if (cadastrando) {
				const criada = await criar.mutateAsync({
					...dadosOrganizacao(formulario),
					documento: formulario.documento,
				});
				novoEstado = {
					...formulario,
					documento: formatarDocumento(criada.documento),
				};
				definirFormulario(novoEstado);
			} else {
				await atualizar.mutateAsync(dadosOrganizacao(formulario));
			}

			await agenda.salvarGrade.mutateAsync(gradeDoFormulario(novoEstado));
			await clienteConsultas.invalidateQueries({ queryKey: CHAVE_GRADE_AGENDA });

			definirFormularioBase(novoEstado);

			if (cadastrando) {
				definirAcabouDeCadastrar(true);
			}
			definirAviso({
				tipo: 'sucesso',
				texto: cadastrando
					? 'Empresa cadastrada com sucesso. Sua agenda já está pronta para receber reservas.'
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

	const acaoCabecalho = (
		<div className="flex w-full flex-wrap items-center justify-end gap-3 lg:mt-1.5 lg:w-auto">
			{!cadastrando && possuiAlteracoes && (
				<button
					type="button"
					onClick={descartarAlteracoes}
					disabled={salvando}
					className="h-11 rounded-lg border border-borda bg-white px-4 text-xs font-medium text-tinta-suave transition-colors hover:text-tinta disabled:opacity-50 [touch-action:manipulation]"
				>
					Descartar
				</button>
			)}
			<BotaoSalvarConfiguracoes
				salvando={salvando}
				cadastrando={cadastrando}
				desabilitado={!formulario}
				className="flex-1 lg:flex-none"
			/>
		</div>
	);

	return (
		<LayoutPainel
			itemAtivo="configuracoes"
			titulo="Configurações"
			descricao={
				cadastrando
					? 'Cadastre sua empresa para começar a receber agendamentos'
					: 'Defina como e quando sua empresa atende'
			}
			empresa={{
				nome:
					formulario?.nomeFantasia.trim() ||
					organizacao?.nomeFantasia ||
					'Sua empresa',
				detalhe:
					formulario?.endereco.trim() ||
					organizacao?.endereco ||
					(organizacao ? 'Endereço não informado' : 'Cadastro pendente'),
			}}
			acao={acaoCabecalho}
			aoSair={encerrarSessao}
			saindo={sair.isPending}
		>
			{erro || agenda.erroGrade ? (
				<div
					className="rounded-2xl border border-perigo/20 bg-white p-6 text-sm text-perigo"
					role="alert"
				>
					<p className="font-semibold">
						Não foi possível carregar as configurações
					</p>
					<p className="mt-1 text-xs text-tinta-suave">
						{obterMensagemErro(erro ?? agenda.erroGrade)}
					</p>
				</div>
			) : !formulario ? (
				<EsqueletoConfiguracoes />
			) : (
				<>
					{cadastrando && (
						<div className="mb-6 flex items-start gap-3 rounded-2xl border border-marca-500/30 bg-marca-50 px-5 py-4 text-[13px] text-marca-700">
							<span
								aria-hidden="true"
								className="mt-1.5 size-2 shrink-0 rounded-full bg-marca-500"
							/>
							<p>
								Preencha os dados da empresa e o expediente abaixo para liberar
								os agendamentos e as demais áreas do AgendaJá.
							</p>
						</div>
					)}

					{aviso && (
						<div
							role={aviso.tipo === 'erro' ? 'alert' : 'status'}
							aria-live="polite"
							className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-5 py-4 text-[13px] ${
								aviso.tipo === 'erro'
									? 'border border-perigo/20 bg-perigo-fundo text-perigo'
									: 'border border-marca-500/30 bg-marca-50 font-medium text-marca-700'
							}`}
						>
							<span>{aviso.texto}</span>
							{acabouDeCadastrar && aviso.tipo === 'sucesso' && (
								<Link
									to="/"
									className="font-semibold underline underline-offset-2"
								>
									Ir para o início
								</Link>
							)}
						</div>
					)}

					<form
						id={ID_FORMULARIO}
						onSubmit={(evento) => void salvar(evento)}
						noValidate
						className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,432px)_minmax(0,1fr)] lg:items-start lg:gap-6"
					>
						{/* No mobile, `contents` deixa os cartões em uma coluna única ordenada pelo `order`. */}
						<div className="contents lg:flex lg:flex-col lg:gap-6">
							<CartaoDadosEmpresa
								formulario={formulario}
								alterar={alterar}
								cadastrando={cadastrando}
								erros={errosCampos}
							/>
							<div className="order-last lg:order-none">
								<CartaoSobreDisponibilidade formulario={formulario} />
							</div>
						</div>
						<div className="contents lg:flex lg:flex-col lg:gap-6">
							<CartaoFuncionamento
								formulario={formulario}
								alterar={alterar}
								erros={errosCampos}
							/>
							<CartaoPausa
								formulario={formulario}
								alterar={alterar}
								erros={errosCampos}
							/>
							<CartaoDuracaoPadrao
								formulario={formulario}
								alterar={alterar}
								erros={errosCampos}
							/>
							{/* Só existe depois do cadastro: bloqueios pertencem a uma empresa. */}
							{organizacao && <CartaoBloqueios agenda={agenda} />}
						</div>
					</form>

					<div className="mt-6 flex items-center gap-3 lg:hidden">
						{!cadastrando && possuiAlteracoes && (
							<button
								type="button"
								onClick={descartarAlteracoes}
								disabled={salvando}
								className="h-11 rounded-lg border border-borda bg-white px-4 text-xs font-medium text-tinta-suave transition-colors hover:text-tinta"
							>
								Descartar
							</button>
						)}
						<BotaoSalvarConfiguracoes
							salvando={salvando}
							cadastrando={cadastrando}
							desabilitado={!formulario}
							className="flex-1"
						/>
					</div>
				</>
			)}
		</LayoutPainel>
	);
}
