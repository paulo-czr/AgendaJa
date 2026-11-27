import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { icones } from '../../../assets/icones';
import { Botao } from '../../../components/Botao';
import { notificar } from '../../../lib/notificacoes';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarConfiguracoesAgenda } from '../hooks/usarConfiguracoesAgenda';
import { CampoConfiguracao, CartaoConfiguracao } from './CartaoConfiguracao';
import { Plus } from 'lucide-react';

const formatoData = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: 'short',
	hour: '2-digit',
	minute: '2-digit',
});

function descreverPeriodo(inicio: string, fim: string): string {
	return `${formatoData.format(new Date(inicio))} → ${formatoData.format(new Date(fim))}`;
}

const ID_FORMULARIO_BLOQUEIO = 'formulario-bloqueio';
const SUGESTOES_MOTIVO = [
	'Feriado',
	'Férias',
	'Manutenção',
	'Treinamento',
] as const;

type RetornoConfiguracoesAgenda = ReturnType<typeof usarConfiguracoesAgenda>;

interface PropriedadesCartaoBloqueios {
	agenda?: Pick<
		RetornoConfiguracoesAgenda,
		'bloqueios' | 'carregandoBloqueios' | 'criarBloqueio' | 'removerBloqueio'
	>;
}

/**
 * Bloqueios pontuais (feriados, férias, manutenções).
 * Inclui confirmação em duas etapas para evitar exclusão destrutiva acidental
 * e chips rápidos para preenchimento de motivos frequentes.
 */
export function CartaoBloqueios({ agenda }: PropriedadesCartaoBloqueios = {}) {
	const agendaInterna = usarConfiguracoesAgenda(!agenda);
	const { bloqueios, carregandoBloqueios, criarBloqueio, removerBloqueio } =
		agenda ?? agendaInterna;

	const [inicio, definirInicio] = useState('');
	const [fim, definirFim] = useState('');
	const [motivo, definirMotivo] = useState('');
	const [erro, definirErro] = useState<string | null>(null);
	const [idConfirmandoRemocao, definirIdConfirmandoRemocao] = useState<
		number | null
	>(null);

	function adicionar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		evento.stopPropagation();
		definirErro(null);

		if (!inicio || !fim) {
			const mensagem = 'Informe a data e horário de início e fim do bloqueio.';
			definirErro(mensagem);
			notificar.erro(mensagem);
			return;
		}

		const dataHoraInicio = new Date(inicio);
		const dataHoraFim = new Date(fim);

		if (dataHoraFim <= dataHoraInicio) {
			const mensagem = 'O fim do bloqueio deve ser posterior ao início.';
			definirErro(mensagem);
			notificar.erro(mensagem);
			return;
		}

		criarBloqueio.mutate(
			{
				dataHoraInicio: dataHoraInicio.toISOString(),
				dataHoraFim: dataHoraFim.toISOString(),
				motivo: motivo.trim() || null,
			},
			{
				onSuccess: () => {
					definirInicio('');
					definirFim('');
					definirMotivo('');
					notificar.sucesso('Bloqueio adicionado à agenda.');
				},
				onError: (falha) => {
					const mensagem = obterMensagemErro(falha);
					definirErro(mensagem);
					notificar.erro(mensagem);
				},
			},
		);
	}

	function confirmarRemocao(id: number): void {
		definirErro(null);
		removerBloqueio.mutate(id, {
			onSuccess: () => {
				definirIdConfirmandoRemocao(null);
				notificar.sucesso('Bloqueio removido da agenda.');
			},
			onError: (falha) => {
				definirIdConfirmandoRemocao(null);
				const mensagem = obterMensagemErro(falha);
				definirErro(mensagem);
				notificar.erro(mensagem);
			},
		});
	}

	return (
		<CartaoConfiguracao
			titulo="Bloqueios na agenda"
			descricao="Feriados, férias ou manutenções: períodos fechados para novas reservas"
		>
			<div aria-live="polite">
				{carregandoBloqueios ? (
					<div className="space-y-2" aria-label="Carregando bloqueios…">
						<div className="h-14 rounded-lg bg-cor-fundo" />
						<div className="h-14 rounded-lg bg-cor-fundo" />
					</div>
				) : bloqueios.length === 0 ? (
					<div className="rounded-lg border border-dashed border-cor-borda bg-cor-fundo/60 px-4 py-3.5">
						<p className="text-xs font-medium text-cor-fonte-primaria">
							Nenhum bloqueio programado
						</p>
						<p className="mt-0.5 text-[11px] text-cor-fonte-secundaria">
							Adicione abaixo datas em que a empresa não abrirá excepcionalmente.
						</p>
					</div>
				) : (
					<ul className="space-y-2">
						{bloqueios.map((bloqueio) => {
							const confirmando = idConfirmandoRemocao === bloqueio.id;
							const descricaoPeriodo = descreverPeriodo(
								bloqueio.dataHoraInicio,
								bloqueio.dataHoraFim,
							);

							return (
								<li
									key={bloqueio.id}
									className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cor-borda/60 bg-cor-fundo px-4 py-3"
								>
									<div className="min-w-0 flex-1">
										<p className="text-[13px] font-medium tabular-nums text-cor-fonte-primaria">
											{descricaoPeriodo}
										</p>
										{bloqueio.motivo && (
											<p className="mt-0.5 truncate text-xs text-cor-fonte-secundaria">
												{bloqueio.motivo}
											</p>
										)}
									</div>

									{confirmando ? (
										<div className="flex items-center gap-2">
											<Botao
												tamanho="pequeno"
												variante="perigo"
												onClick={() => confirmarRemocao(bloqueio.id)}
												carregando={removerBloqueio.isPending}
											>
												{removerBloqueio.isPending ? 'Removendo…' : 'Confirmar'}
											</Botao>
											<Botao
												tamanho="pequeno"
												variante="ghost"
												onClick={() => definirIdConfirmandoRemocao(null)}
												disabled={removerBloqueio.isPending}
											>
												Cancelar
											</Botao>
										</div>
									) : (
										<button
											type="button"
											onClick={() => definirIdConfirmandoRemocao(bloqueio.id)}
											disabled={removerBloqueio.isPending}
											aria-label={`Remover bloqueio ${descricaoPeriodo}`}
											className="grid size-9 shrink-0 place-items-center rounded-lg transition-colors hover:bg-cor-perigo-fundo disabled:opacity-50 [touch-action:manipulation]"
										>
											<img
												src={icones.arredondado.fechar}
												alt=""
												aria-hidden="true"
												width={14}
												height={14}
											/>
										</button>
									)}
								</li>
							);
						})}
					</ul>
				)}
			</div>

			{createPortal(
				<form id={ID_FORMULARIO_BLOQUEIO} onSubmit={adicionar} noValidate hidden />,
				document.body,
			)}

			<div className="mt-6 border-t border-cor-borda pt-6">
				<p className="text-xs font-semibold text-cor-fonte-primaria">
					Programar novo bloqueio
				</p>
				<div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-6">
					<CampoConfiguracao
						id="bloqueio-inicio"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Início"
						type="datetime-local"
						value={inicio}
						onChange={(evento) => {
							definirErro(null);
							definirInicio(evento.target.value);
						}}
						tabular
					/>
					<CampoConfiguracao
						id="bloqueio-fim"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Fim"
						type="datetime-local"
						value={fim}
						min={inicio || undefined}
						onChange={(evento) => {
							definirErro(null);
							definirFim(evento.target.value);
						}}
						tabular
					/>
				</div>

				<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
					<CampoConfiguracao
						id="bloqueio-motivo"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Motivo (opcional)"
						complementoRotulo={
							<span className="flex items-center gap-1">
								{SUGESTOES_MOTIVO.map((sugestao) => (
									<button
										key={sugestao}
										type="button"
										onClick={() => definirMotivo(sugestao)}
										className="rounded bg-cor-fundo px-1.5 py-0.5 text-[10px] font-medium text-cor-fonte-secundaria transition-colors hover:bg-cor-superficie-neutra hover:text-cor-fonte-primaria [touch-action:manipulation]"
									>
										{sugestao}
									</button>
								))}
							</span>
						}
						value={motivo}
						onChange={(evento) => definirMotivo(evento.target.value)}
						placeholder="Ex.: Feriado de Natal…"
						maxLength={255}
						className="flex-1"
					/>
					<Botao
						type="submit"
						form={ID_FORMULARIO_BLOQUEIO}
						variante="primario"
						iconeEsquerda={Plus}
						carregando={criarBloqueio.isPending}
					>
						{criarBloqueio.isPending ? 'Adicionando…' : 'Adicionar bloqueio'}
					</Botao>
				</div>

				{erro && (
					<p
						className="mt-4 rounded-lg bg-cor-perigo-fundo px-4 py-3 text-xs font-medium text-cor-perigo"
						role="alert"
					>
						{erro}
					</p>
				)}
			</div>
		</CartaoConfiguracao>
	);
}
