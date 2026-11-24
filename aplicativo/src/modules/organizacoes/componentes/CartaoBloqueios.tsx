import { useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { icones } from '../../../assets/icones';
import { obterMensagemErro } from '../../../lib/obter-mensagem-erro';
import { usarConfiguracoesAgenda } from '../hooks/usarConfiguracoesAgenda';
import { CampoConfiguracao, CartaoConfiguracao } from './CartaoConfiguracao';

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
const SUGESTOES_MOTIVO = ['Feriado', 'Férias', 'Manutenção', 'Treinamento'] as const;

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
			definirErro('Informe a data e horário de início e fim do bloqueio.');
			return;
		}

		const dataHoraInicio = new Date(inicio);
		const dataHoraFim = new Date(fim);

		if (dataHoraFim <= dataHoraInicio) {
			definirErro('O fim do bloqueio deve ser posterior ao início.');
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
				},
				onError: (falha) => definirErro(obterMensagemErro(falha)),
			},
		);
	}

	function confirmarRemocao(id: number): void {
		definirErro(null);
		removerBloqueio.mutate(id, {
			onSuccess: () => definirIdConfirmandoRemocao(null),
			onError: (falha) => {
				definirIdConfirmandoRemocao(null);
				definirErro(obterMensagemErro(falha));
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
						<div className="h-14 rounded-lg bg-superficie" />
						<div className="h-14 rounded-lg bg-superficie" />
					</div>
				) : bloqueios.length === 0 ? (
					<div className="rounded-lg border border-dashed border-borda bg-superficie/60 px-4 py-3.5">
						<p className="text-xs font-medium text-tinta">
							Nenhum bloqueio programado
						</p>
						<p className="mt-0.5 text-[11px] text-tinta-suave">
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
									className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-borda/60 bg-superficie px-4 py-3"
								>
									<div className="min-w-0 flex-1">
										<p className="text-[13px] font-medium tabular-nums text-tinta">
											{descricaoPeriodo}
										</p>
										{bloqueio.motivo && (
											<p className="mt-0.5 truncate text-xs text-tinta-suave">
												{bloqueio.motivo}
											</p>
										)}
									</div>

									{confirmando ? (
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => confirmarRemocao(bloqueio.id)}
												disabled={removerBloqueio.isPending}
												className="h-8 rounded-md bg-perigo px-3 text-xs font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50 [touch-action:manipulation]"
											>
												{removerBloqueio.isPending ? 'Removendo…' : 'Confirmar'}
											</button>
											<button
												type="button"
												onClick={() => definirIdConfirmandoRemocao(null)}
												disabled={removerBloqueio.isPending}
												className="h-8 rounded-md bg-white px-2.5 text-xs font-medium text-tinta-suave transition-colors hover:text-tinta [touch-action:manipulation]"
											>
												Cancelar
											</button>
										</div>
									) : (
										<button
											type="button"
											onClick={() => definirIdConfirmandoRemocao(bloqueio.id)}
											disabled={removerBloqueio.isPending}
											aria-label={`Remover bloqueio ${descricaoPeriodo}`}
											className="grid size-9 shrink-0 place-items-center rounded-lg transition-colors hover:bg-perigo-fundo disabled:opacity-50 [touch-action:manipulation]"
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
				<form
					id={ID_FORMULARIO_BLOQUEIO}
					onSubmit={adicionar}
					noValidate
					hidden
				/>,
				document.body,
			)}

			<div className="mt-6 border-t border-borda pt-6">
				<p className="text-xs font-semibold text-tinta">
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
										className="rounded bg-superficie px-1.5 py-0.5 text-[10px] font-medium text-tinta-suave transition-colors hover:bg-superficie-neutra hover:text-tinta [touch-action:manipulation]"
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
					<button
						type="submit"
						form={ID_FORMULARIO_BLOQUEIO}
						disabled={criarBloqueio.isPending}
						className="h-11 shrink-0 rounded-lg border border-marca-500 px-5 text-xs font-semibold text-marca-700 transition-colors hover:bg-marca-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 [touch-action:manipulation]"
					>
						{criarBloqueio.isPending ? 'Adicionando…' : 'Adicionar bloqueio'}
					</button>
				</div>

				{erro && (
					<p
						className="mt-4 rounded-lg bg-perigo-fundo px-4 py-3 text-xs font-medium text-perigo"
						role="alert"
					>
						{erro}
					</p>
				)}
			</div>
		</CartaoConfiguracao>
	);
}
