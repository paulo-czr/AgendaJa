import { useMemo, useState, type FormEvent } from 'react';
import {
	Clock,
	Copy,
	ExternalLink,
	Pencil,
	Plus,
	Power,
	Save,
	Search,
	X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
import { LayoutPainel } from '../../../components/LayoutPainel';
import CountUp from '../../../components/reactbits/CountUp';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarAutenticacao } from '../../autenticacao/hooks/usarAutenticacao';
import {
	CampoConfiguracao,
	CartaoConfiguracao,
} from '../../organizacoes/componentes/CartaoConfiguracao';
import { usarOrganizacao } from '../../organizacoes/hooks/usarOrganizacao';
import {
	formatarCentavosParaInput,
	formatarDuracao,
	formatarPrecoCentavos,
	parsearPrecoParaCentavos,
} from '../formatadores';
import { usarCategorias } from '../hooks/usarCategorias';
import { usarServicos } from '../hooks/usarServicos';
import type { Servico } from '../servicos/servicosServico';

interface FormularioServico {
	nomeServico: string;
	descricaoServico: string;
	idCategoria: string;
	precoReais: string;
	duracaoMinutos: string;
}

type FiltroStatus = 'todos' | 'ativos' | 'inativos';

function formularioVazio(duracaoPadrao: number): FormularioServico {
	return {
		nomeServico: '',
		descricaoServico: '',
		idCategoria: '',
		precoReais: '',
		duracaoMinutos: String(duracaoPadrao),
	};
}

export function PaginaServicos() {
	const { sair } = usarAutenticacao();
	const navegar = useNavigate();
	const { organizacao } = usarOrganizacao();
	const { categorias } = usarCategorias(Boolean(organizacao));
	const { servicos, carregando, erro, criar, atualizar, desativar } =
		usarServicos(Boolean(organizacao));

	const duracaoPadrao = organizacao?.duracaoPadraoMinutos ?? 30;
	const [formularioAberto, definirFormularioAberto] = useState(false);
	const [servicoEmEdicao, definirServicoEmEdicao] = useState<Servico | null>(
		null,
	);
	const [formulario, definirFormulario] = useState<FormularioServico>(() =>
		formularioVazio(duracaoPadrao),
	);
	const [filtroStatus, definirFiltroStatus] = useState<FiltroStatus>('todos');
	const [busca, definirBusca] = useState('');

	const linkVitrine = organizacao
		? `${window.location.origin}/vitrine/${organizacao.id}`
		: '';
	const salvando = criar.isPending || atualizar.isPending;

	const contagemAtivos = useMemo(
		() => servicos.filter((servico) => servico.ativo).length,
		[servicos],
	);
	const contagemInativos = servicos.length - contagemAtivos;

	const servicosFiltrados = useMemo(() => {
		const termo = busca.trim().toLowerCase();
		return servicos.filter((servico) => {
			if (filtroStatus === 'ativos' && !servico.ativo) {
				return false;
			}
			if (filtroStatus === 'inativos' && servico.ativo) {
				return false;
			}
			if (!termo) {
				return true;
			}
			const nomeMatch = servico.nomeServico.toLowerCase().includes(termo);
			const catMatch = servico.categoria?.nome.toLowerCase().includes(termo);
			return nomeMatch || Boolean(catMatch);
		});
	}, [servicos, filtroStatus, busca]);

	function abrirNovoServico(): void {
		definirServicoEmEdicao(null);
		definirFormulario(formularioVazio(duracaoPadrao));
		definirFormularioAberto(true);
	}

	function abrirEdicao(servico: Servico): void {
		definirServicoEmEdicao(servico);
		definirFormulario({
			nomeServico: servico.nomeServico,
			descricaoServico: servico.descricaoServico ?? '',
			idCategoria: servico.idCategoria ? String(servico.idCategoria) : '',
			precoReais: formatarCentavosParaInput(servico.precoCentavos),
			duracaoMinutos: String(servico.duracaoMinutos),
		});
		definirFormularioAberto(true);
	}

	function fecharFormulario(): void {
		definirFormularioAberto(false);
		definirServicoEmEdicao(null);
	}

	async function copiarLinkVitrine(): Promise<void> {
		if (!linkVitrine) {
			return;
		}

		try {
			await navigator.clipboard.writeText(linkVitrine);
			notificar.sucesso('Link da vitrine copiado');
		} catch {
			notificar.info({
				titulo: 'Copie o endereço da vitrine',
				mensagem: linkVitrine,
			});
		}
	}

	async function salvarServico(
		evento: FormEvent<HTMLFormElement>,
	): Promise<void> {
		evento.preventDefault();
		if (salvando) {
			return;
		}

		const nomeServico = formulario.nomeServico.trim();
		if (nomeServico.length < 2) {
			notificar.erro('Informe um nome com pelo menos 2 caracteres.');
			return;
		}

		const precoCentavos = parsearPrecoParaCentavos(formulario.precoReais);
		if (precoCentavos === null) {
			notificar.erro('Informe um preço válido (ex.: 50,00).');
			return;
		}

		const duracaoMinutos = Number(formulario.duracaoMinutos);
		if (!Number.isInteger(duracaoMinutos) || duracaoMinutos < 1) {
			notificar.erro(
				'A duração deve ser um número inteiro de minutos maior que zero.',
			);
			return;
		}

		const carga = {
			nomeServico,
			descricaoServico: formulario.descricaoServico.trim() || null,
			idCategoria: formulario.idCategoria ? Number(formulario.idCategoria) : null,
			precoCentavos,
			duracaoMinutos,
		};

		try {
			if (servicoEmEdicao) {
				await atualizar.mutateAsync({ id: servicoEmEdicao.id, dados: carga });
				notificar.sucesso('Serviço atualizado');
			} else {
				await criar.mutateAsync(carga);
				notificar.sucesso('Serviço cadastrado');
			}
			fecharFormulario();
		} catch (falha) {
			notificar.erro(obterMensagemErro(falha));
		}
	}

	async function alternarStatus(servico: Servico): Promise<void> {
		try {
			if (servico.ativo) {
				await desativar.mutateAsync(servico.id);
				notificar.sucesso({
					titulo: 'Serviço desativado',
					mensagem: `"${servico.nomeServico}" foi ocultado da vitrine pública.`,
				});
			} else {
				await atualizar.mutateAsync({
					id: servico.id,
					dados: { ativo: true },
				});
				notificar.sucesso({
					titulo: 'Serviço reativado',
					mensagem: `"${servico.nomeServico}" voltou a aparecer na vitrine pública.`,
				});
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

	return (
		<LayoutPainel
			itemAtivo="servicos"
			titulo="Serviços"
			descricao="Cadastre preços, durações e categorias do seu catálogo"
			empresa={{
				nome: organizacao?.nomeFantasia ?? 'Sua empresa',
				detalhe: organizacao?.endereco || 'Endereço não informado',
			}}
			acao={
				<div className="flex flex-wrap items-center gap-2 lg:mt-1.5">
					{organizacao && (
						<Botao
							variante="outline"
							iconeEsquerda={Copy}
							onClick={() => void copiarLinkVitrine()}
							className="h-11"
						>
							Copiar vitrine
						</Botao>
					)}
					<Botao
						variante="primario"
						iconeEsquerda={Plus}
						onClick={abrirNovoServico}
						className="h-11"
					>
						Novo serviço
					</Botao>
				</div>
			}
			aoSair={encerrarSessao}
			saindo={sair.isPending}
		>
			{organizacao && (
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cor-borda/80 bg-cor-superficie px-5 py-3.5 shadow-sutil">
					<div className="flex min-w-0 items-center gap-3">
						<span className="size-2 shrink-0 rounded-full bg-cor-primaria" />
						<div className="min-w-0">
							<p className="text-xs font-medium text-cor-fonte-primaria">
								Vitrine pública ativa
							</p>
							<p className="truncate text-[11px] text-cor-fonte-secundaria">
								{linkVitrine}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Link
							to="/configuracoes?aba=categorias"
							className="inline-flex h-8 items-center rounded-lg border border-cor-borda px-3 text-xs font-medium text-cor-fonte-secundaria transition-colors hover:text-cor-fonte-primaria"
						>
							Gerenciar categorias
						</Link>
						<Link
							to={`/vitrine/${organizacao.id}`}
							target="_blank"
							rel="noreferrer"
							className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cor-secundaria px-3 text-xs font-medium text-cor-fonte-invertida transition-colors hover:bg-cor-secundaria-suave"
						>
							Abrir vitrine
							<ExternalLink className="size-3.5" strokeWidth={1.5} />
						</Link>
					</div>
				</div>
			)}

			{formularioAberto && (
				<CartaoConfiguracao
					titulo={servicoEmEdicao ? 'Editar serviço' : 'Novo serviço'}
					descricao="Informe os dados exibidos para os clientes na vitrine"
					acaoCabecalho={
						<Botao
							variante="ghost"
							tamanho="pequeno"
							iconeEsquerda={X}
							onClick={fecharFormulario}
							aria-label="Fechar formulário"
						/>
					}
					className="mb-6 animar-painel-aba"
				>
					<form
						onSubmit={(evento) => void salvarServico(evento)}
						className="space-y-5"
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<CampoConfiguracao
								id="nome-servico"
								rotulo="Nome do serviço"
								value={formulario.nomeServico}
								onChange={(evento) =>
									definirFormulario((atual) => ({
										...atual,
										nomeServico: evento.target.value,
									}))
								}
								placeholder="Ex.: Manutenção preventiva"
								maxLength={120}
								required
							/>
							<div>
								<label
									htmlFor="categoria-servico"
									className="block text-xs font-medium text-cor-fonte-primaria"
								>
									Categoria
								</label>
								<select
									id="categoria-servico"
									value={formulario.idCategoria}
									onChange={(evento) =>
										definirFormulario((atual) => ({
											...atual,
											idCategoria: evento.target.value,
										}))
									}
									className="mt-2 h-11 w-full rounded-lg border border-cor-borda bg-cor-fundo px-3 text-[13px] text-cor-fonte-primaria transition-colors focus:border-cor-primaria focus:bg-cor-superficie focus:outline-none focus:ring-2 focus:ring-cor-primaria/20"
								>
									<option value="">Sem categoria</option>
									{categorias.map((categoria) => (
										<option key={categoria.id} value={String(categoria.id)}>
											{categoria.nome}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<CampoConfiguracao
								id="preco-servico"
								rotulo="Preço (R$)"
								inputMode="decimal"
								tabular
								value={formulario.precoReais}
								onChange={(evento) =>
									definirFormulario((atual) => ({
										...atual,
										precoReais: evento.target.value,
									}))
								}
								placeholder="Ex.: 80,00"
								required
							/>
							<CampoConfiguracao
								id="duracao-servico"
								rotulo="Duração (minutos)"
								type="number"
								min={1}
								step={1}
								tabular
								value={formulario.duracaoMinutos}
								onChange={(evento) =>
									definirFormulario((atual) => ({
										...atual,
										duracaoMinutos: evento.target.value,
									}))
								}
								ajuda={`Padrão da empresa: ${duracaoPadrao} min`}
								required
							/>
						</div>

						<div>
							<label
								htmlFor="descricao-servico"
								className="block text-xs font-medium text-cor-fonte-primaria"
							>
								Descrição (opcional)
							</label>
							<textarea
								id="descricao-servico"
								rows={3}
								maxLength={500}
								value={formulario.descricaoServico}
								onChange={(evento) =>
									definirFormulario((atual) => ({
										...atual,
										descricaoServico: evento.target.value,
									}))
								}
								placeholder="Descreva o que está incluso no atendimento"
								className="mt-2 w-full rounded-lg border border-cor-borda bg-cor-fundo p-3 text-[13px] text-cor-fonte-primaria transition-colors placeholder:text-cor-fonte-secundaria focus:border-cor-primaria focus:bg-cor-superficie focus:outline-none focus:ring-2 focus:ring-cor-primaria/20"
							/>
						</div>

						<div className="flex flex-wrap justify-end gap-2.5 border-t border-cor-borda/70 pt-4">
							<Botao variante="outline" onClick={fecharFormulario}>
								Cancelar
							</Botao>
							<Botao
								type="submit"
								variante="primario"
								carregando={salvando}
								iconeEsquerda={Save}
							>
								{salvando
									? 'Salvando...'
									: servicoEmEdicao
										? 'Salvar alterações'
										: 'Cadastrar serviço'}
							</Botao>
						</div>
					</form>
				</CartaoConfiguracao>
			)}

			{erro ? (
				<div
					className="rounded-2xl border border-cor-perigo/20 bg-cor-superficie p-6 text-sm text-cor-perigo"
					role="alert"
				>
					<p className="font-semibold">Não foi possível carregar os serviços</p>
					<p className="mt-1 text-xs text-cor-fonte-secundaria">
						{obterMensagemErro(erro)}
					</p>
				</div>
			) : carregando ? (
				<div className="space-y-3">
					<div className="h-20 animate-pulse rounded-2xl bg-cor-superficie" />
					<div className="h-20 animate-pulse rounded-2xl bg-cor-superficie" />
					<div className="h-20 animate-pulse rounded-2xl bg-cor-superficie" />
				</div>
			) : servicos.length === 0 ? (
				<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-10 text-center shadow-sutil">
					<h2 className="text-base font-semibold text-cor-fonte-primaria">
						Nenhum serviço cadastrado
					</h2>
					<p className="mx-auto mt-2 max-w-md text-xs leading-5 text-cor-fonte-secundaria">
						Adicione seu primeiro serviço para montar o catálogo e divulgar sua
						vitrine pública aos clientes.
					</p>
					<Botao
						variante="primario"
						iconeEsquerda={Plus}
						onClick={abrirNovoServico}
						className="mt-5 h-11"
					>
						Cadastrar primeiro serviço
					</Botao>
				</section>
			) : (
				<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie shadow-sutil">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-cor-borda/80 px-5 py-4">
						<div className="flex items-center gap-1 rounded-lg bg-cor-fundo p-1">
							{(
								[
									{ id: 'todos', rotulo: 'Todos', total: servicos.length },
									{ id: 'ativos', rotulo: 'Ativos', total: contagemAtivos },
									{ id: 'inativos', rotulo: 'Inativos', total: contagemInativos },
								] as const
							).map((item) => {
								const ativo = filtroStatus === item.id;
								return (
									<button
										key={item.id}
										type="button"
										onClick={() => definirFiltroStatus(item.id)}
										className={`rounded-md px-3 py-1.5 text-xs font-medium tabular-nums transition-colors ${
											ativo
												? 'bg-cor-superficie text-cor-fonte-primaria shadow-sutil'
												: 'text-cor-fonte-secundaria hover:text-cor-fonte-primaria'
										}`}
									>
										{item.rotulo} (<CountUp to={item.total} duration={0.5} trigger="load" />)
									</button>
								);
							})}
						</div>

						<div className="relative w-full sm:w-64">
							<Search
								className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-cor-fonte-secundaria"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
							<input
								type="search"
								value={busca}
								onChange={(evento) => definirBusca(evento.target.value)}
								placeholder="Buscar serviço"
								aria-label="Buscar serviço"
								className="h-9 w-full rounded-lg border border-cor-borda bg-cor-fundo pl-9 pr-3 text-xs text-cor-fonte-primaria placeholder:text-cor-fonte-secundaria focus:border-cor-primaria focus:bg-cor-superficie focus:outline-none"
							/>
						</div>
					</div>

					{servicosFiltrados.length === 0 ? (
						<p className="px-5 py-8 text-center text-xs text-cor-fonte-secundaria">
							Nenhum serviço encontrado com os filtros aplicados.
						</p>
					) : (
						<ul className="divide-y divide-cor-borda/70">
							{servicosFiltrados.map((servico) => (
								<li
									key={servico.id}
									className={`flex flex-col gap-4 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
										servico.ativo ? '' : 'bg-cor-fundo/40 opacity-70'
									}`}
								>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-2.5">
											<span
												className={`size-2 shrink-0 rounded-full ${
													servico.ativo ? 'bg-cor-primaria' : 'bg-cor-fonte-secundaria/50'
												}`}
												title={servico.ativo ? 'Ativo' : 'Inativo'}
											/>
											<h2 className="truncate text-sm font-semibold text-cor-fonte-primaria">
												{servico.nomeServico}
											</h2>
											{servico.categoria && (
												<span className="rounded-md bg-cor-fundo px-2 py-0.5 text-[11px] font-medium text-cor-fonte-secundaria">
													{servico.categoria.nome}
												</span>
											)}
											{!servico.ativo && (
												<span className="text-[11px] font-medium text-cor-fonte-secundaria">
													Inativo
												</span>
											)}
										</div>
										{servico.descricaoServico && (
											<p className="mt-1 line-clamp-2 pl-4 text-xs leading-5 text-cor-fonte-secundaria">
												{servico.descricaoServico}
											</p>
										)}
									</div>

									<div className="flex flex-wrap items-center justify-between gap-4 pl-4 sm:justify-end sm:pl-0">
										<div className="flex items-center gap-4 text-right">
											<span className="inline-flex items-center gap-1.5 text-xs text-cor-fonte-secundaria tabular-nums">
												<Clock className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
												{formatarDuracao(servico.duracaoMinutos)}
											</span>
											<span className="min-w-[84px] text-sm font-semibold text-cor-fonte-primaria tabular-nums">
												{formatarPrecoCentavos(servico.precoCentavos)}
											</span>
										</div>

										<div className="flex items-center gap-1.5">
											<Botao
												variante="outline"
												tamanho="pequeno"
												iconeEsquerda={Pencil}
												onClick={() => abrirEdicao(servico)}
											>
												Editar
											</Botao>
											<Botao
												variante={servico.ativo ? 'perigo' : 'secundario'}
												tamanho="pequeno"
												iconeEsquerda={Power}
												disabled={desativar.isPending || atualizar.isPending}
												onClick={() => void alternarStatus(servico)}
											>
												{servico.ativo ? 'Desativar' : 'Reativar'}
											</Botao>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			)}
		</LayoutPainel>
	);
}
