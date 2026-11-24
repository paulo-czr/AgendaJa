import { icones } from '../../../assets/icones';
import {
	DIAS_SEMANA,
	DURACOES_PADRAO,
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
}

export function CartaoDadosEmpresa({
	formulario,
	alterar,
	cadastrando,
}: PropriedadesCartao & { cadastrando: boolean }) {
	return (
		<CartaoConfiguracao
			titulo="Sua empresa"
			descricao="Informações exibidas nos agendamentos."
		>
			<div className="space-y-6">
				<CampoConfiguracao
					id="nome-empresa"
					rotulo="Nome da empresa"
					value={formulario.nomeFantasia}
					onChange={(evento) => alterar('nomeFantasia', evento.target.value)}
					placeholder="Ex.: Barbearia Central"
					autoComplete="organization"
					maxLength={255}
					required
				/>
				<CampoConfiguracao
					id="documento-empresa"
					rotulo="CPF ou CNPJ"
					value={formulario.documento}
					onChange={(evento) => alterar('documento', evento.target.value)}
					placeholder="000.000.000-00 ou 00.000.000/0000-00"
					inputMode="numeric"
					maxLength={18}
					readOnly={!cadastrando}
					required={cadastrando}
					ajuda={
						cadastrando
							? 'Confira com atenção: o documento não pode ser alterado depois.'
							: 'O documento não pode ser alterado após o cadastro.'
					}
				/>
				<CampoConfiguracao
					id="telefone-empresa"
					rotulo="Telefone"
					type="tel"
					value={formulario.telefone}
					onChange={(evento) => alterar('telefone', evento.target.value)}
					placeholder="(81) 3333-4444"
					autoComplete="tel"
					maxLength={20}
					required
				/>
				<CampoConfiguracao
					id="endereco-empresa"
					rotulo="Endereço (opcional)"
					value={formulario.endereco}
					onChange={(evento) => alterar('endereco', evento.target.value)}
					placeholder="Ex.: Boa Viagem, Recife — PE"
					autoComplete="street-address"
					maxLength={500}
				/>
				<CampoConfiguracao
					id="capacidade-empresa"
					rotulo="Atendimentos simultâneos"
					type="number"
					min={1}
					max={100}
					step={1}
					value={formulario.capacidadeSimultanea}
					onChange={(evento) =>
						alterar('capacidadeSimultanea', evento.target.value)
					}
					ajuda="Quantos clientes podem ser atendidos no mesmo horário."
					required
				/>
			</div>
		</CartaoConfiguracao>
	);
}

export function CartaoFuncionamento({ formulario, alterar }: PropriedadesCartao) {
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
			descricao="Selecione os dias em que sua empresa atende."
		>
			<div className="grid grid-cols-7 gap-1.5 sm:flex sm:gap-3" role="group" aria-label="Dias de atendimento">
				{DIAS_SEMANA.map((dia) => {
					const ativo = formulario.diasAtivos.includes(dia.numero);

					return (
						<button
							key={dia.numero}
							type="button"
							onClick={() => alternarDia(dia.numero)}
							aria-pressed={ativo}
							aria-label={dia.nome}
							className={`flex h-16 flex-col items-center justify-center gap-1.5 rounded-[10px] text-[11px] transition sm:w-[78px] sm:text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-500 ${
								ativo
									? 'bg-marca-50 font-semibold text-marca-700'
									: 'bg-superficie font-medium text-tinta-suave hover:bg-superficie-neutra'
							}`}
						>
							{dia.sigla}
							{ativo && (
								<img src={icones.arredondado.confirmar} alt="" width={12} height={12} />
							)}
						</button>
					);
				})}
			</div>

			<div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6">
				<CampoConfiguracao
					id="horario-abertura"
					rotulo="Abertura"
					type="time"
					value={formulario.horarioAbertura}
					onChange={(evento) => alterar('horarioAbertura', evento.target.value)}
					required
				/>
				<CampoConfiguracao
					id="horario-encerramento"
					rotulo="Encerramento"
					type="time"
					value={formulario.horarioFechamento}
					onChange={(evento) => alterar('horarioFechamento', evento.target.value)}
					required
				/>
			</div>
		</CartaoConfiguracao>
	);
}

export function CartaoPausa({ formulario, alterar }: PropriedadesCartao) {
	const possuiPausa = Boolean(formulario.inicioPausa || formulario.fimPausa);

	return (
		<CartaoConfiguracao
			titulo="Intervalos e pausas"
			descricao="Esse período não aparece como disponível para reservas."
		>
			<div className="grid grid-cols-2 gap-3 sm:gap-6">
				<CampoConfiguracao
					id="inicio-pausa"
					rotulo="Início da pausa"
					type="time"
					value={formulario.inicioPausa}
					onChange={(evento) => alterar('inicioPausa', evento.target.value)}
				/>
				<CampoConfiguracao
					id="fim-pausa"
					rotulo="Fim da pausa"
					type="time"
					value={formulario.fimPausa}
					onChange={(evento) => alterar('fimPausa', evento.target.value)}
				/>
			</div>
			{possuiPausa ? (
				<button
					type="button"
					onClick={() => {
						alterar('inicioPausa', '');
						alterar('fimPausa', '');
					}}
					className="mt-4 text-xs font-medium text-marca-700 hover:underline"
				>
					Remover pausa
				</button>
			) : (
				<p className="mt-4 text-xs text-tinta-suave">
					Sem pausa: a agenda fica aberta durante todo o expediente.
				</p>
			)}
		</CartaoConfiguracao>
	);
}

export function CartaoDuracaoPadrao({ formulario, alterar }: PropriedadesCartao) {
	return (
		<CartaoConfiguracao
			titulo="Duração padrão"
			descricao="Usada quando o serviço não possui uma duração específica."
		>
			<label htmlFor="duracao-padrao" className="sr-only">
				Duração padrão dos atendimentos
			</label>
			<div className="relative -mt-3">
				<select
					id="duracao-padrao"
					value={formulario.duracaoPadraoMinutos}
					onChange={(evento) =>
						alterar('duracaoPadraoMinutos', Number(evento.target.value))
					}
					className="h-[42px] w-full cursor-pointer appearance-none rounded-lg bg-superficie pl-3.5 pr-10 text-[13px] font-medium text-tinta transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-marca-500/25"
				>
					{DURACOES_PADRAO.map((duracao) => (
						<option key={duracao} value={duracao}>
							{duracao} minutos
						</option>
					))}
				</select>
				<img
					src={icones.arredondado.expandir}
					alt=""
					width={16}
					height={16}
					className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
				/>
			</div>
		</CartaoConfiguracao>
	);
}

export function CartaoSobreDisponibilidade({
	capacidade,
}: {
	capacidade: number;
}) {
	const textoCapacidade =
		capacidade > 1
			? `Até ${capacidade} atendimentos no mesmo horário.`
			: 'Um atendimento por horário, sem sobreposição.';

	return (
		<section className="rounded-2xl bg-petroleo p-5 sm:p-6">
			<h2 className="text-[21px] font-bold text-white">Sua agenda, suas regras.</h2>
			<p className="mt-5 text-[13px] leading-6 text-nevoa-clara">
				Os horários disponíveis respeitam os dias,
				<br className="hidden sm:inline" /> o expediente e os intervalos definidos
				aqui.
			</p>
			<p className="mt-8 text-xs font-medium text-marca-500">{textoCapacidade}</p>
		</section>
	);
}
