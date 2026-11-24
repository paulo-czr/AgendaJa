import { icones } from '../../../assets/icones';
import {
	calcularResumoExpediente,
	DIAS_SEMANA,
	DURACOES_PADRAO,
	formatarDocumento,
	formatarTelefone,
	type ErrosFormularioConfiguracoes,
	type FormularioConfiguracoes,
} from '../formulario';
import { CampoConfiguracao, CartaoConfiguracao } from './CartaoConfiguracao';

export type AlterarCampo = <Campo extends keyof FormularioConfiguracoes>(
	campo: Campo,
	valor: FormularioConfiguracoes[Campo],
) => void;

interface PropriedadesCartao {
	formulario: FormularioConfiguracoes;
	alterar: AlterarCampo;
	erros?: ErrosFormularioConfiguracoes;
}

const ATALHOS_DIAS = [
	{ rotulo: 'Seg a Sex', dias: [1, 2, 3, 4, 5] },
	{ rotulo: 'Seg a Sáb', dias: [1, 2, 3, 4, 5, 6] },
	{ rotulo: 'Todos', dias: [1, 2, 3, 4, 5, 6, 0] },
] as const;

function conjuntosIguais(a: readonly number[], b: readonly number[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	return a.every((item) => b.includes(item));
}

export function CartaoDadosEmpresa({
	formulario,
	alterar,
	cadastrando,
	erros,
}: PropriedadesCartao & { cadastrando: boolean }) {
	return (
		<CartaoConfiguracao
			titulo="Sua empresa"
			descricao="Informações exibidas nos agendamentos"
		>
			<div className="space-y-5">
				<CampoConfiguracao
					id="nome-empresa"
					rotulo="Nome da empresa"
					value={formulario.nomeFantasia}
					onChange={(evento) => alterar('nomeFantasia', evento.target.value)}
					placeholder="Ex.: Barbearia Central…"
					autoComplete="organization"
					maxLength={255}
					erro={erros?.nomeFantasia}
					required
				/>
				<CampoConfiguracao
					id="documento-empresa"
					rotulo="CPF ou CNPJ"
					complementoRotulo={
						!cadastrando ? (
							<span className="rounded bg-superficie-neutra px-2 py-0.5 text-[11px] font-medium text-tinta-suave">
								Registrado
							</span>
						) : undefined
					}
					value={formulario.documento}
					onChange={(evento) =>
						alterar('documento', formatarDocumento(evento.target.value))
					}
					placeholder="000.000.000-00 ou 00.000.000/0000-00…"
					inputMode="numeric"
					maxLength={18}
					readOnly={!cadastrando}
					required={cadastrando}
					tabular
					erro={erros?.documento}
					ajuda={
						cadastrando
							? 'Confira com atenção: o documento não pode ser alterado depois.'
							: 'O documento fica vinculado à conta e não pode ser alterado.'
					}
				/>
				<CampoConfiguracao
					id="telefone-empresa"
					rotulo="Telefone ou WhatsApp"
					type="tel"
					inputMode="tel"
					value={formulario.telefone}
					onChange={(evento) =>
						alterar('telefone', formatarTelefone(evento.target.value))
					}
					placeholder="Ex.: (81) 99999-9999…"
					autoComplete="tel"
					maxLength={15}
					tabular
					erro={erros?.telefone}
					required
				/>
				<CampoConfiguracao
					id="endereco-empresa"
					rotulo="Endereço (opcional)"
					value={formulario.endereco}
					onChange={(evento) => alterar('endereco', evento.target.value)}
					placeholder="Ex.: Av. Conselheiro Aguiar, 1200 — Boa Viagem…"
					autoComplete="street-address"
					maxLength={500}
					erro={erros?.endereco}
				/>
			</div>
		</CartaoConfiguracao>
	);
}

export function CartaoFuncionamento({
	formulario,
	alterar,
	erros,
}: PropriedadesCartao) {
	function alternarDia(numero: number): void {
		const ativo = formulario.diasAtivos.includes(numero);
		alterar(
			'diasAtivos',
			ativo
				? formulario.diasAtivos.filter((dia) => dia !== numero)
				: [...formulario.diasAtivos, numero],
		);
	}

	return (
		<CartaoConfiguracao
			titulo="Dias e horários de funcionamento"
			descricao="Selecione os dias e a faixa de horário em que sua empresa atende"
			acaoCabecalho={
				<div
					className="flex flex-wrap items-center gap-1.5"
					aria-label="Atalhos de seleção de dias"
				>
					{ATALHOS_DIAS.map((atalho) => {
						const selecionado = conjuntosIguais(
							formulario.diasAtivos,
							atalho.dias,
						);
						return (
							<button
								key={atalho.rotulo}
								type="button"
								onClick={() => alterar('diasAtivos', [...atalho.dias])}
								aria-pressed={selecionado}
								className={`h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors [touch-action:manipulation] ${
									selecionado
										? 'bg-marca-50 text-marca-700'
										: 'bg-superficie text-tinta-suave hover:bg-superficie-neutra hover:text-tinta'
								}`}
							>
								{atalho.rotulo}
							</button>
						);
					})}
				</div>
			}
		>
			<div
				id="grupo-dias-atendimento"
				tabIndex={-1}
				className="grid grid-cols-7 gap-1.5 sm:gap-2.5"
				role="group"
				aria-label="Dias de atendimento"
			>
				{DIAS_SEMANA.map((dia) => {
					const ativo = formulario.diasAtivos.includes(dia.numero);

					return (
						<button
							key={dia.numero}
							type="button"
							onClick={() => alternarDia(dia.numero)}
							aria-pressed={ativo}
							aria-label={dia.nome}
							className={`flex h-14 flex-col items-center justify-center gap-1 rounded-lg border text-xs transition-colors [touch-action:manipulation] active:scale-[0.98] sm:h-16 sm:text-[13px] ${
								ativo
									? 'border-marca-500/40 bg-marca-50 font-semibold text-marca-700'
									: 'border-transparent bg-superficie font-medium text-tinta-suave hover:bg-superficie-neutra hover:text-tinta'
							}`}
						>
							<span>{dia.sigla}</span>
							<span
								aria-hidden="true"
								className={`grid size-4 place-items-center rounded-full ${
									ativo ? 'bg-marca-500/20' : ''
								}`}
							>
								{ativo ? (
									<img
										src={icones.arredondado.confirmar}
										alt=""
										aria-hidden="true"
										width={12}
										height={12}
									/>
								) : (
									<span className="size-1.5 rounded-full bg-tinta-suave/30" />
								)}
							</span>
						</button>
					);
				})}
			</div>

			{erros?.diasAtivos && (
				<p
					role="alert"
					className="mt-2 text-[11px] font-medium text-perigo"
				>
					{erros.diasAtivos}
				</p>
			)}

			<div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
				<CampoConfiguracao
					id="horario-abertura"
					rotulo="Abertura"
					type="time"
					value={formulario.horarioAbertura}
					onChange={(evento) => alterar('horarioAbertura', evento.target.value)}
					tabular
					erro={erros?.horarioAbertura}
					required
				/>
				<CampoConfiguracao
					id="horario-encerramento"
					rotulo="Encerramento"
					type="time"
					value={formulario.horarioFechamento}
					onChange={(evento) =>
						alterar('horarioFechamento', evento.target.value)
					}
					tabular
					erro={erros?.horarioFechamento}
					required
				/>
			</div>
		</CartaoConfiguracao>
	);
}

export function CartaoPausa({
	formulario,
	alterar,
	erros,
}: PropriedadesCartao) {
	const possuiPausa = Boolean(formulario.inicioPausa || formulario.fimPausa);

	function alternarPausa(): void {
		if (possuiPausa) {
			alterar('inicioPausa', '');
			alterar('fimPausa', '');
		} else {
			alterar('inicioPausa', '12:00');
			alterar('fimPausa', '13:00');
		}
	}

	return (
		<CartaoConfiguracao
			titulo="Intervalo intrajornada"
			descricao="Período reservado para almoço ou descanso, fechado para agendamentos"
			acaoCabecalho={
				<button
					type="button"
					onClick={alternarPausa}
					aria-pressed={possuiPausa}
					className={`h-7 rounded-md px-2.5 text-[11px] font-medium transition-colors [touch-action:manipulation] ${
						possuiPausa
							? 'bg-superficie text-tinta-suave hover:bg-perigo-fundo hover:text-perigo'
							: 'bg-marca-50 text-marca-700 hover:bg-marca-500/20'
					}`}
				>
					{possuiPausa ? 'Remover pausa' : 'Definir pausa (12:00–13:00)'}
				</button>
			}
		>
			<div className="grid grid-cols-2 gap-4 sm:gap-6">
				<CampoConfiguracao
					id="inicio-pausa"
					rotulo="Início da pausa"
					type="time"
					value={formulario.inicioPausa}
					onChange={(evento) => alterar('inicioPausa', evento.target.value)}
					tabular
					erro={erros?.inicioPausa}
				/>
				<CampoConfiguracao
					id="fim-pausa"
					rotulo="Fim da pausa"
					type="time"
					value={formulario.fimPausa}
					onChange={(evento) => alterar('fimPausa', evento.target.value)}
					tabular
					erro={erros?.fimPausa}
				/>
			</div>
			<p className="mt-3 text-xs text-tinta-suave">
				{possuiPausa
					? `Agenda pausada das ${formulario.inicioPausa || '--:--'} às ${formulario.fimPausa || '--:--'} nos dias ativos.`
					: 'Sem pausa configurada: o expediente permanece contínuo do início ao fim.'}
			</p>
		</CartaoConfiguracao>
	);
}

/**
 * Unifica Duração padrão e Capacidade simultânea em um único cartão equilibrado,
 * substituindo o antigo cartão de 1 único <select> com margem negativa (-mt-3).
 */
export function CartaoDuracaoPadrao({
	formulario,
	alterar,
	erros,
}: PropriedadesCartao) {
	return (
		<CartaoConfiguracao
			titulo="Tempo e capacidade por horário"
			descricao="Defina a duração padrão dos serviços e quantos clientes podem ser atendidos ao mesmo tempo"
		>
			<div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
				<div>
					<label
						htmlFor="duracao-padrao"
						className="block text-xs font-medium text-tinta"
					>
						Duração padrão do atendimento
					</label>
					<div className="relative mt-2">
						<select
							id="duracao-padrao"
							name="duracao-padrao"
							aria-describedby="duracao-padrao-ajuda"
							value={formulario.duracaoPadraoMinutos}
							onChange={(evento) =>
								alterar('duracaoPadraoMinutos', Number(evento.target.value))
							}
							className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-borda bg-superficie pl-3.5 pr-10 text-[13px] font-medium tabular-nums text-tinta transition-colors focus-visible:border-marca-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marca-500/25"
						>
							{DURACOES_PADRAO.map((duracao) => (
								<option
									key={duracao}
									value={duracao}
									className="bg-white text-tinta"
								>
									{duracao} minutos
								</option>
							))}
						</select>
						<img
							src={icones.arredondado.expandir}
							alt=""
							aria-hidden="true"
							width={16}
							height={16}
							className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
						/>
					</div>
					<p
						id="duracao-padrao-ajuda"
						className="mt-1.5 text-[11px] leading-4 text-tinta-suave"
					>
						Aplicada quando o serviço não define duração própria.
					</p>
				</div>

				<CampoConfiguracao
					id="capacidade-empresa"
					rotulo="Atendimentos simultâneos"
					type="number"
					inputMode="numeric"
					min={1}
					max={100}
					step={1}
					value={formulario.capacidadeSimultanea}
					onChange={(evento) =>
						alterar('capacidadeSimultanea', evento.target.value)
					}
					tabular
					erro={erros?.capacidadeSimultanea}
					ajuda="Vagas disponíveis em cada horário da grade."
					required
				/>
			</div>
		</CartaoConfiguracao>
	);
}

/**
 * Momento Visual (Unslop Direction):
 * Régua Viva do Expediente que traduz em tempo real as escolhas de horário,
 * pausa, duração e capacidade simultânea em uma linha do tempo gráfica e números tabulares.
 */
export function CartaoSobreDisponibilidade({
	formulario,
	capacidade,
}: {
	formulario?: FormularioConfiguracoes;
	capacidade?: number;
}) {
	const estadoPadrao: FormularioConfiguracoes = formulario ?? {
		nomeFantasia: '',
		documento: '',
		telefone: '',
		endereco: '',
		capacidadeSimultanea: String(capacidade ?? 1),
		duracaoPadraoMinutos: 30,
		diasAtivos: [1, 2, 3, 4, 5],
		horarioAbertura: '08:00',
		horarioFechamento: '18:00',
		inicioPausa: '12:00',
		fimPausa: '13:00',
	};

	const resumo = calcularResumoExpediente(estadoPadrao);
	const capacidadeAtual = Math.max(
		1,
		Number(estadoPadrao.capacidadeSimultanea) || 1,
	);
	const possuiPausaValida = resumo.minutosPausa > 0;

	return (
		<section
			aria-label="Resumo da disponibilidade configurada"
			className="rounded-2xl bg-petroleo p-5 text-white sm:p-6"
		>
			<div className="flex items-center justify-between gap-3">
				<span className="inline-flex items-center gap-2 text-xs font-medium text-marca-500">
					<span
						aria-hidden="true"
						className="size-2 rounded-full bg-marca-500"
					/>
					Simulação do expediente
				</span>
				<span className="rounded-md bg-petroleo-800 px-2.5 py-1 text-[11px] font-medium tabular-nums text-nevoa-clara">
					{resumo.rotuloDias}
				</span>
			</div>

			<h2 className="mt-3 text-xl font-semibold leading-snug text-white text-balance">
				Sua agenda em funcionamento
			</h2>
			<p className="mt-1.5 text-xs leading-5 text-nevoa-clara">
				Veja como cada dia ativo é dividido a partir das regras ao lado.
			</p>

			{/* Régua Gráfica do Dia */}
			<div className="mt-6 rounded-xl bg-petroleo-800 p-4">
				<div className="flex items-center justify-between text-[11px] font-medium tabular-nums text-nevoa-clara">
					<span>{estadoPadrao.horarioAbertura || '--:--'}</span>
					{possuiPausaValida && (
						<span className="text-nevoa-escura">
							Pausa {estadoPadrao.inicioPausa}–{estadoPadrao.fimPausa}
						</span>
					)}
					<span>{estadoPadrao.horarioFechamento || '--:--'}</span>
				</div>

				<div
					className="mt-2.5 flex h-3 w-full overflow-hidden rounded-md bg-petroleo-700 p-0.5 gap-1"
					aria-hidden="true"
				>
					{resumo.valido ? (
						<>
							<div
								style={{ width: `${resumo.percentualAntesPausa}%` }}
								className="h-full rounded-sm bg-marca-500 transition-[width] duration-200"
							/>
							{possuiPausaValida && (
								<div
									style={{ width: `${resumo.percentualPausa}%` }}
									className="h-full rounded-sm bg-petroleo-700/90 border border-dashed border-nevoa-escura/50 transition-[width] duration-200"
								/>
							)}
							{resumo.percentualDepoisPausa > 0 && (
								<div
									style={{ width: `${resumo.percentualDepoisPausa}%` }}
									className="h-full rounded-sm bg-marca-500 transition-[width] duration-200"
								/>
							)}
						</>
					) : (
						<div className="h-full w-full rounded-sm bg-perigo/60" />
					)}
				</div>

				<div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-nevoa-media">
					<span className="inline-flex items-center gap-1.5">
						<span
							aria-hidden="true"
							className="size-2 rounded-sm bg-marca-500"
						/>
						Expediente líquido:{' '}
						<strong className="font-semibold tabular-nums text-white">
							{resumo.horasFormatadas}
						</strong>
					</span>
					<span>
						Blocos de{' '}
						<strong className="font-semibold tabular-nums text-white">
							{estadoPadrao.duracaoPadraoMinutos}&nbsp;min
						</strong>
					</span>
				</div>
			</div>

			{/* Métricas Tabulares */}
			<dl className="mt-4 grid grid-cols-2 gap-3">
				<div className="rounded-xl bg-petroleo-800/80 px-3.5 py-3">
					<dt className="text-[11px] text-nevoa-media">Horários por dia</dt>
					<dd className="mt-1 text-xl font-semibold tabular-nums text-white">
						{resumo.horariosPorDia}
					</dd>
				</div>
				<div className="rounded-xl bg-petroleo-800/80 px-3.5 py-3">
					<dt className="text-[11px] text-nevoa-media">Capacidade diária</dt>
					<dd className="mt-1 text-xl font-semibold tabular-nums text-marca-500">
						{resumo.atendimentosPorDia}{' '}
						<span className="text-xs font-normal text-nevoa-clara">
							{resumo.atendimentosPorDia === 1 ? 'vaga' : 'vagas'}
						</span>
					</dd>
				</div>
			</dl>

			<p className="mt-4 text-xs leading-5 text-nevoa-clara">
				{capacidadeAtual > 1
					? `Até ${capacidadeAtual} clientes podem reservar o mesmo horário simultaneamente.`
					: 'Um atendimento por horário, sem sobreposição de clientes.'}
			</p>
		</section>
	);
}
