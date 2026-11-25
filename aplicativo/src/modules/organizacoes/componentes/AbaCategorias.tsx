import { useState, type FormEvent } from 'react';
import { Check, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import { Botao } from '../../../components/Botao';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarCategorias } from '../../servicos/hooks/usarCategorias';
import { CampoConfiguracao, CartaoConfiguracao } from './CartaoConfiguracao';

/**
 * Gerenciador de categorias padronizadas de serviços dentro de Configurações.
 * Reutiliza o sistema central de toasts (`notificar`) e confirmação em duas
 * etapas para exclusão segura.
 */
export function AbaCategorias() {
	const { categorias, carregando, erro, criar, atualizar, remover } =
		usarCategorias(true);
	const [novoNome, definirNovoNome] = useState('');
	const [idEditando, definirIdEditando] = useState<number | null>(null);
	const [nomeEditando, definirNomeEditando] = useState('');
	const [idConfirmandoRemocao, definirIdConfirmandoRemocao] = useState<
		number | null
	>(null);

	async function cadastrar(evento: FormEvent<HTMLFormElement>): Promise<void> {
		evento.preventDefault();
		const nome = novoNome.trim();
		if (nome.length < 2) {
			notificar.erro('O nome da categoria deve ter pelo menos 2 caracteres.');
			return;
		}

		try {
			await criar.mutateAsync(nome);
			definirNovoNome('');
			notificar.sucesso('Categoria adicionada');
		} catch (falha) {
			notificar.erro(obterMensagemErro(falha));
		}
	}

	async function salvarEdicao(id: number): Promise<void> {
		const nome = nomeEditando.trim();
		if (nome.length < 2) {
			notificar.erro('O nome da categoria deve ter pelo menos 2 caracteres.');
			return;
		}

		try {
			await atualizar.mutateAsync({ id, nome });
			definirIdEditando(null);
			definirNomeEditando('');
			notificar.sucesso('Categoria atualizada');
		} catch (falha) {
			notificar.erro(obterMensagemErro(falha));
		}
	}

	async function excluir(id: number, nome: string): Promise<void> {
		try {
			await remover.mutateAsync(id);
			definirIdConfirmandoRemocao(null);
			notificar.sucesso({
				titulo: 'Categoria removida',
				mensagem: `"${nome}" foi excluída e os serviços vinculados permanecem ativos sem categoria.`,
			});
		} catch (falha) {
			notificar.erro(obterMensagemErro(falha));
		}
	}

	return (
		<CartaoConfiguracao
			titulo="Categorias de serviços"
			descricao="Organize seu catálogo em grupos exibidos na vitrine pública"
			acaoCabecalho={
				categorias.length > 0 ? (
					<span className="rounded-lg bg-cor-fundo px-2.5 py-1 text-xs font-medium text-cor-fonte-secundaria tabular-nums">
						{categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'}
					</span>
				) : undefined
			}
		>
			<form
				onSubmit={(evento) => void cadastrar(evento)}
				className="flex flex-col gap-3 sm:flex-row sm:items-end"
			>
				<CampoConfiguracao
					id="nova-categoria"
					rotulo="Nova categoria"
					value={novoNome}
					onChange={(evento) => definirNovoNome(evento.target.value)}
					placeholder="Ex.: Corte, Manutenção, Estética"
					maxLength={60}
					className="flex-1"
					required
				/>
				<Botao
					type="submit"
					variante="primario"
					iconeEsquerda={Plus}
					carregando={criar.isPending}
					className="h-11 shrink-0"
				>
					{criar.isPending ? 'Adicionando...' : 'Adicionar'}
				</Botao>
			</form>

			<div className="mt-6 border-t border-cor-borda/80 pt-6">
				{erro ? (
					<p
						className="rounded-xl border border-cor-perigo/20 bg-cor-perigo-fundo px-4 py-3 text-xs text-cor-perigo"
						role="alert"
					>
						{obterMensagemErro(erro)}
					</p>
				) : carregando ? (
					<div className="space-y-2">
						<div className="h-12 animate-pulse rounded-xl bg-cor-fundo" />
						<div className="h-12 animate-pulse rounded-xl bg-cor-fundo" />
					</div>
				) : categorias.length === 0 ? (
					<div className="flex items-center gap-3 rounded-xl border border-dashed border-cor-borda bg-cor-fundo/60 px-4 py-4">
						<span className="grid size-9 shrink-0 place-items-center rounded-lg bg-cor-superficie text-cor-fonte-secundaria">
							<Tag className="size-4" strokeWidth={1.5} aria-hidden="true" />
						</span>
						<div>
							<p className="text-xs font-medium text-cor-fonte-primaria">
								Nenhuma categoria cadastrada
							</p>
							<p className="mt-0.5 text-[11px] text-cor-fonte-secundaria">
								Adicione categorias acima para agrupar os serviços na vitrine.
							</p>
						</div>
					</div>
				) : (
					<ul className="divide-y divide-cor-borda/70 rounded-xl border border-cor-borda/80 bg-cor-superficie">
						{categorias.map((categoria) => {
							const editando = idEditando === categoria.id;
							const confirmando = idConfirmandoRemocao === categoria.id;

							return (
								<li
									key={categoria.id}
									className="flex min-h-[52px] flex-wrap items-center justify-between gap-3 px-4 py-2.5"
								>
									{editando ? (
										<div className="flex flex-1 flex-wrap items-center gap-2">
											<input
												type="text"
												aria-label="Editar nome da categoria"
												value={nomeEditando}
												onChange={(evento) => definirNomeEditando(evento.target.value)}
												maxLength={60}
												autoFocus
												className="h-9 min-w-[180px] flex-1 rounded-lg border border-cor-primaria bg-cor-superficie px-3 text-[13px] text-cor-fonte-primaria focus:outline-none focus:ring-2 focus:ring-cor-primaria/25"
											/>
											<Botao
												tamanho="pequeno"
												variante="primario"
												iconeEsquerda={Check}
												carregando={atualizar.isPending}
												onClick={() => void salvarEdicao(categoria.id)}
											>
												Salvar
											</Botao>
											<Botao
												tamanho="pequeno"
												variante="outline"
												iconeEsquerda={X}
												onClick={() => {
													definirIdEditando(null);
													definirNomeEditando('');
												}}
											>
												Cancelar
											</Botao>
										</div>
									) : (
										<>
											<div className="flex min-w-0 items-center gap-2.5">
												<span className="grid size-7 shrink-0 place-items-center rounded-lg bg-cor-fundo text-cor-fonte-secundaria">
													<Tag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
												</span>
												<span className="truncate text-[13px] font-medium text-cor-fonte-primaria">
													{categoria.nome}
												</span>
											</div>

											{confirmando ? (
												<div className="flex items-center gap-2">
													<span className="text-[11px] text-cor-fonte-secundaria">
														Confirmar exclusão?
													</span>
													<Botao
														tamanho="pequeno"
														variante="perigo"
														carregando={remover.isPending}
														onClick={() => void excluir(categoria.id, categoria.nome)}
													>
														Remover
													</Botao>
													<Botao
														tamanho="pequeno"
														variante="outline"
														onClick={() => definirIdConfirmandoRemocao(null)}
													>
														Cancelar
													</Botao>
												</div>
											) : (
												<div className="flex items-center gap-1.5">
													<Botao
														tamanho="pequeno"
														variante="outline"
														iconeEsquerda={Pencil}
														onClick={() => {
															definirIdConfirmandoRemocao(null);
															definirIdEditando(categoria.id);
															definirNomeEditando(categoria.nome);
														}}
														aria-label={`Editar categoria ${categoria.nome}`}
													>
														Editar
													</Botao>
													<Botao
														tamanho="pequeno"
														variante="ghost"
														iconeEsquerda={Trash2}
														onClick={() => definirIdConfirmandoRemocao(categoria.id)}
														aria-label={`Remover categoria ${categoria.nome}`}
														className="text-cor-perigo hover:bg-cor-perigo-fundo hover:text-cor-perigo"
													>
														Remover
													</Botao>
												</div>
											)}
										</>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</CartaoConfiguracao>
	);
}
