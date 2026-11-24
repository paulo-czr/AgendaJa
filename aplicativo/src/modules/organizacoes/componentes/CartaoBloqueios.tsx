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

/**
 * Bloqueios pontuais (feriados, férias, manutenções). Sem tela no Figma:
 * segue o mesmo padrão visual dos demais cartões. Cada ação é salva na hora.
 *
 * O cartão fica dentro do formulário principal da página; como HTML não
 * permite formulários aninhados, os campos usam o atributo `form` para
 * apontar para um <form> próprio renderizado fora dele (via portal). Assim,
 * o Enter nos campos de bloqueio não aciona o "Salvar alterações".
 */
export function CartaoBloqueios() {
	const { bloqueios, carregandoBloqueios, criarBloqueio, removerBloqueio } =
		usarConfiguracoesAgenda(true);
	const [inicio, definirInicio] = useState('');
	const [fim, definirFim] = useState('');
	const [motivo, definirMotivo] = useState('');
	const [erro, definirErro] = useState<string | null>(null);

	function adicionar(evento: FormEvent<HTMLFormElement>): void {
		evento.preventDefault();
		// Eventos de portal sobem pela árvore do React: sem isto, o submit
		// chegaria também ao formulário principal e salvaria as configurações.
		evento.stopPropagation();
		definirErro(null);

		if (!inicio || !fim) {
			definirErro('Informe o início e o fim do bloqueio.');
			return;
		}

		// `datetime-local` vem sem fuso; o Date converte a partir do horário local.
		const dataHoraInicio = new Date(inicio);
		const dataHoraFim = new Date(fim);

		if (dataHoraFim <= dataHoraInicio) {
			definirErro('O fim do bloqueio deve ser depois do início.');
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

	return (
		<CartaoConfiguracao
			titulo="Bloqueios na agenda"
			descricao="Feriados, férias ou manutenções: períodos fechados para reservas."
		>
			{carregandoBloqueios ? (
				<p className="text-xs text-tinta-suave">Carregando bloqueios...</p>
			) : bloqueios.length === 0 ? (
				<p className="rounded-lg bg-superficie px-4 py-3 text-xs text-tinta-suave">
					Nenhum bloqueio programado.
				</p>
			) : (
				<ul className="space-y-2">
					{bloqueios.map((bloqueio) => (
						<li
							key={bloqueio.id}
							className="flex items-center justify-between gap-3 rounded-lg bg-superficie px-4 py-3"
						>
							<div className="min-w-0">
								<p className="text-[13px] font-medium text-tinta">
									{descreverPeriodo(bloqueio.dataHoraInicio, bloqueio.dataHoraFim)}
								</p>
								{bloqueio.motivo && (
									<p className="mt-0.5 truncate text-[11px] text-tinta-suave">
										{bloqueio.motivo}
									</p>
								)}
							</div>
							<button
								type="button"
								onClick={() =>
									removerBloqueio.mutate(bloqueio.id, {
										onError: (falha) => definirErro(obterMensagemErro(falha)),
									})
								}
								disabled={removerBloqueio.isPending}
								aria-label={`Remover bloqueio ${descreverPeriodo(bloqueio.dataHoraInicio, bloqueio.dataHoraFim)}`}
								className="grid size-8 shrink-0 place-items-center rounded-lg transition hover:bg-perigo-fundo disabled:opacity-50"
							>
								<img src={icones.arredondado.fechar} alt="" width={14} height={14} />
							</button>
						</li>
					))}
				</ul>
			)}

			{createPortal(
				<form id={ID_FORMULARIO_BLOQUEIO} onSubmit={adicionar} noValidate hidden />,
				document.body,
			)}
			<div className="mt-6 border-t border-borda pt-6">
				<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
					<CampoConfiguracao
						id="bloqueio-inicio"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Início"
						type="datetime-local"
						value={inicio}
						onChange={(evento) => definirInicio(evento.target.value)}
					/>
					<CampoConfiguracao
						id="bloqueio-fim"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Fim"
						type="datetime-local"
						value={fim}
						min={inicio || undefined}
						onChange={(evento) => definirFim(evento.target.value)}
					/>
				</div>
				<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
					<CampoConfiguracao
						id="bloqueio-motivo"
						form={ID_FORMULARIO_BLOQUEIO}
						rotulo="Motivo (opcional)"
						value={motivo}
						onChange={(evento) => definirMotivo(evento.target.value)}
						placeholder="Ex.: Feriado de Natal"
						maxLength={255}
						className="flex-1"
					/>
					<button
						type="submit"
						form={ID_FORMULARIO_BLOQUEIO}
						disabled={criarBloqueio.isPending}
						className="h-[46px] shrink-0 rounded-lg border border-marca-500 px-5 text-xs font-semibold text-marca-700 transition hover:bg-marca-50 disabled:opacity-60"
					>
						{criarBloqueio.isPending ? 'Adicionando...' : 'Adicionar bloqueio'}
					</button>
				</div>
				{erro && (
					<p className="mt-4 rounded-lg bg-perigo-fundo px-4 py-3 text-xs text-perigo" role="alert">
						{erro}
					</p>
				)}
			</div>
		</CartaoConfiguracao>
	);
}
