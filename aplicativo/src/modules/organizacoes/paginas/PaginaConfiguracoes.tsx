import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type FormEvent,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutPainel } from '../../../components/LayoutPainel';
import { NavegacaoAbas, type ItemAba } from '../../../components/NavegacaoAbas';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import { CartaoBloqueios } from '../componentes/CartaoBloqueios';
import {
	CartaoDadosEmpresa,
	CartaoDuracaoPadrao,
	CartaoFuncionamento,
	CartaoIdentidadePublica,
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
	obterAbaDoCampo,
	validarCamposFormulario,
	type AbaConfiguracoes,
	type ErrosFormularioConfiguracoes,
	type FormularioConfiguracoes,
} from '../formulario';
import {
	CHAVE_GRADE_AGENDA,
	usarConfiguracoesAgenda,
} from '../hooks/usarConfiguracoesAgenda';
import { usarOrganizacao } from '../hooks/usarOrganizacao';

const ID_FORMULARIO = 'formulario-configuracoes';

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
			className={`h-11 rounded-lg bg-cor-primaria px-6 text-[13px] font-semibold text-cor-secundaria transition-colors hover:bg-cor-primaria-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 [touch-action:manipulation] lg:w-[184px] lg:text-xs ${className}`}
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
			className="space-y-6"
		>
			<div className="h-12 w-80 rounded-xl bg-cor-superficie-neutra" />
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
				<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-6">
					<div className="h-5 w-36 rounded bg-cor-superficie-neutra" />
					<div className="mt-2 h-3.5 w-56 rounded bg-cor-fundo" />
					<div className="mt-6 space-y-5">
						<div className="h-16 rounded-lg bg-cor-fundo" />
						<div className="h-16 rounded-lg bg-cor-fundo" />
						<div className="h-16 rounded-lg bg-cor-fundo" />
						<div className="h-16 rounded-lg bg-cor-fundo" />
					</div>
				</div>
				<div className="h-64 rounded-2xl bg-cor-secundaria/90 p-6" />
			</div>
			<span className="sr-only">Carregando configurações…</span>
		</div>
	);
}

export function PaginaConfiguracoes() {
	const { usuario, sair } = usarAutenticacao();
	const navegar = useNavigate();
	const clienteConsultas = useQueryClient();
	const [parametrosBusca, definirParametrosBusca] = useSearchParams();

	const { organizacao, carregando, erro, criar, atualizar } = usarOrganizacao();
	const agenda = usarConfiguracoesAgenda(Boolean(organizacao));

	const [formulario, definirFormulario] =
		useState<FormularioConfiguracoes | null>(null);
	const [formularioBase, definirFormularioBase] =
		useState<FormularioConfiguracoes | null>(null);
	const [errosCampos, definirErrosCampos] =
		useState<ErrosFormularioConfiguracoes>({});

	const cadastrando = !carregando && !erro && organizacao === null;
	const salvando =
		criar.isPending || atualizar.isPending || agenda.salvarGrade.isPending;

	const abaUrl = parametrosBusca.get('aba') as AbaConfiguracoes | null;
	const abaAtiva: AbaConfiguracoes =
		abaUrl === 'atendimento' || abaUrl === 'bloqueios' ? abaUrl : 'empresa';

	const mudarAba = useCallback(
		(novaAba: AbaConfiguracoes) => {
			definirParametrosBusca(
				(ant) => {
					const proximos = new URLSearchParams(ant);
					proximos.set('aba', novaAba);
					return proximos;
				},
				{ replace: true },
			);
		},
		[definirParametrosBusca],
	);

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
		definirErrosCampos((atual) => {
			if (!atual[campo]) {
				return atual;
			}
			const copia = { ...atual };
			delete copia[campo];
			return copia;
		});
		definirFormulario((atual) => (atual ? { ...atual, [campo]: valor } : atual));
	}, []);

	function descartarAlteracoes(): void {
		if (!formularioBase) {
			return;
		}
		definirFormulario(formularioBase);
		definirErrosCampos({});
		notificar.info('Alterações descartadas.');
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
			const abaDoErro = obterAbaDoCampo(primeiroCampo);

			// Se o erro está em outra aba, muda automaticamente para ela
			if (abaAtiva !== abaDoErro) {
				mudarAba(abaDoErro);
			}

			notificar.erro({
				titulo: 'Dados incompletos',
				mensagem: primeiroErro ?? 'Revise os campos destacados antes de salvar.',
			});

			setTimeout(() => {
				const idElemento = ID_CAMPO_FORMULARIO[primeiroCampo];
				const elemento = document.getElementById(idElemento);
				elemento?.focus();
			}, 60);
			return;
		}

		definirErrosCampos({});
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
				notificar.sucesso({
					titulo: 'Empresa cadastrada!',
					mensagem: 'Sua agenda já está pronta para receber reservas.',
					acao: {
						rotulo: 'Ir para o início',
						aoClicar: () => navegar('/'),
					},
					duracaoMs: 6000,
				});
			} else {
				notificar.sucesso('Alterações salvas com sucesso.');
			}
		} catch (falha) {
			notificar.erro(obterMensagemErro(falha));
		}
	}

	function encerrarSessao(): void {
		sair.mutate(undefined, {
			onSuccess: () => navegar('/entrar', { replace: true }),
		});
	}

	const errosEmpresa = Object.keys(errosCampos).filter(
		(c) => obterAbaDoCampo(c as keyof FormularioConfiguracoes) === 'empresa',
	).length;

	const errosAtendimento = Object.keys(errosCampos).filter(
		(c) => obterAbaDoCampo(c as keyof FormularioConfiguracoes) === 'atendimento',
	).length;

	const itensAbas: ItemAba<AbaConfiguracoes>[] = [
		{
			id: 'empresa',
			rotulo: 'Empresa',
			descricao: 'Dados cadastrais e contato público',
			badge:
				errosEmpresa > 0 ? (
					<span className="grid size-4 place-items-center rounded-full bg-cor-perigo text-[10px] font-bold text-cor-fonte-invertida">
						{errosEmpresa}
					</span>
				) : undefined,
		},
		{
			id: 'atendimento',
			rotulo: 'Atendimento e horários',
			descricao: 'Expediente, intervalos e duração padrão',
			badge:
				errosAtendimento > 0 ? (
					<span className="grid size-4 place-items-center rounded-full bg-cor-perigo text-[10px] font-bold text-cor-fonte-invertida">
						{errosAtendimento}
					</span>
				) : undefined,
		},
		{
			id: 'bloqueios',
			rotulo: 'Bloqueios na agenda',
			descricao: 'Feriados, férias e manutenções',
			badge:
				organizacao && agenda.bloqueios.length > 0 ? (
					<span className="rounded bg-cor-fundo px-1.5 py-0.5 text-[10px] font-semibold text-cor-fonte-secundaria">
						{agenda.bloqueios.length}
					</span>
				) : undefined,
		},
	];

	const acaoCabecalho = (
		<div className="flex w-full flex-wrap items-center justify-end gap-3 lg:mt-1.5 lg:w-auto">
			{!cadastrando && possuiAlteracoes && (
				<button
					type="button"
					onClick={descartarAlteracoes}
					disabled={salvando}
					className="h-11 rounded-lg border border-cor-borda bg-cor-superficie px-4 text-xs font-medium text-cor-fonte-secundaria transition-colors hover:text-cor-fonte-primaria disabled:opacity-50 [touch-action:manipulation]"
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
					className="rounded-2xl border border-cor-perigo/20 bg-cor-superficie p-6 text-sm text-cor-perigo"
					role="alert"
				>
					<p className="font-semibold">Não foi possível carregar as configurações</p>
					<p className="mt-1 text-xs text-cor-fonte-secundaria">
						{obterMensagemErro(erro ?? agenda.erroGrade)}
					</p>
				</div>
			) : !formulario ? (
				<EsqueletoConfiguracoes />
			) : (
				<>
					{cadastrando && (
						<div className="mb-6 flex items-start gap-3 rounded-2xl border border-cor-primaria/30 bg-cor-primaria-suave px-5 py-4 text-[13px] text-cor-primaria-escura">
							<span
								aria-hidden="true"
								className="mt-1.5 size-2 shrink-0 rounded-full bg-cor-primaria"
							/>
							<p>
								Preencha os dados da empresa e o expediente abaixo para liberar os
								agendamentos e as demais áreas do AgendaJá.
							</p>
						</div>
					)}

					{/* Componente reutilizável de navegação por abas com indicador deslizante fluido */}
					<div className="mb-6">
						<NavegacaoAbas<AbaConfiguracoes>
							itens={itensAbas}
							abaAtiva={abaAtiva}
							aoMudarAba={mudarAba}
							ariaLabel="Seções das configurações"
							className="max-w-2xl"
						/>
					</div>

					<form
						id={ID_FORMULARIO}
						onSubmit={(evento) => void salvar(evento)}
						noValidate
					>
						{/* Painel com transição fluida a cada troca de aba */}
						<div
							key={abaAtiva}
							id={`painel-aba-${abaAtiva}`}
							role="tabpanel"
							aria-labelledby={`aba-${abaAtiva}`}
							className="animar-painel-aba"
						>
							{/* Seção 1: Empresa */}
							{abaAtiva === 'empresa' && (
								<div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
									<CartaoDadosEmpresa
										formulario={formulario}
										alterar={alterar}
										cadastrando={cadastrando}
										erros={errosCampos}
									/>
									<CartaoIdentidadePublica formulario={formulario} />
								</div>
							)}

							{/* Seção 2: Atendimentos e Horários */}
							{abaAtiva === 'atendimento' && (
								<div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
									<div className="space-y-6">
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
									</div>
									<div className="lg:sticky lg:top-8">
										<CartaoSobreDisponibilidade formulario={formulario} />
									</div>
								</div>
							)}

							{/* Seção 3: Bloqueios */}
							{abaAtiva === 'bloqueios' && (
								<div className="max-w-3xl">
									{organizacao ? (
										<CartaoBloqueios agenda={agenda} />
									) : (
										<div className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-6 shadow-sutil">
											<h3 className="text-base font-semibold text-cor-fonte-primaria">
												Bloqueios pontuais da agenda
											</h3>
											<p className="mt-2 text-xs leading-5 text-cor-fonte-secundaria">
												Os bloqueios para feriados, férias e manutenções são configurados
												após o primeiro cadastro da empresa. Finalize o preenchimento dos
												dados nas abas de Empresa e Atendimento para liberar esta área.
											</p>
											<button
												type="button"
												onClick={() => mudarAba('empresa')}
												className="mt-4 h-10 rounded-lg bg-cor-primaria-suave px-4 text-xs font-semibold text-cor-primaria-escura transition-colors hover:bg-cor-primaria/20 [touch-action:manipulation]"
											>
												Ir para dados da empresa
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					</form>

					<div className="mt-6 flex items-center gap-3 lg:hidden">
						{!cadastrando && possuiAlteracoes && (
							<button
								type="button"
								onClick={descartarAlteracoes}
								disabled={salvando}
								className="h-11 rounded-lg border border-cor-borda bg-cor-superficie px-4 text-xs font-medium text-cor-fonte-secundaria transition-colors hover:text-cor-fonte-primaria"
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
