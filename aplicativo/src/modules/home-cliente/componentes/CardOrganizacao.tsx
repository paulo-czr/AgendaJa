import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
import {
	formatarDuracao,
	formatarPrecoCentavos,
} from '../../servicos/formatadores';
import type { OrganizacaoPublicaResumo } from '../servicos/vitrineGeral.service';

interface PropriedadesCardOrganizacao {
	organizacao: OrganizacaoPublicaResumo;
}

export function CardOrganizacao({ organizacao }: PropriedadesCardOrganizacao) {
	return (
		<article className="flex flex-col justify-between rounded-2xl border border-cor-borda/80 bg-cor-superficie p-5 shadow-sutil">
			<div>
				<div className="flex items-start justify-between gap-3">
					<h3 className="text-base font-semibold text-cor-fonte-primaria">
						{organizacao.nomeFantasia}
					</h3>
					<span className="shrink-0 rounded-lg bg-cor-primaria-suave px-2.5 py-1 text-[11px] font-medium text-cor-primaria-escura tabular-nums">
						{organizacao.totalServicosAtivos}{' '}
						{organizacao.totalServicosAtivos === 1 ? 'serviço' : 'serviços'}
					</span>
				</div>

				<div className="mt-2.5 space-y-1 text-xs text-cor-fonte-secundaria">
					{organizacao.endereco && (
						<p className="flex items-center gap-1.5">
							<MapPin className="size-3.5 shrink-0" strokeWidth={1.5} />
							<span className="truncate">{organizacao.endereco}</span>
						</p>
					)}
					{organizacao.telefone && (
						<p className="flex items-center gap-1.5 tabular-nums">
							<Phone className="size-3.5 shrink-0" strokeWidth={1.5} />
							<span>{organizacao.telefone}</span>
						</p>
					)}
				</div>

				<div className="mt-4 border-t border-cor-borda/70 pt-4">
					{organizacao.servicosDestaque.length === 0 ? (
						<p className="text-xs text-cor-fonte-secundaria">
							Catálogo de serviços em preparação.
						</p>
					) : (
						<ul className="space-y-2">
							{organizacao.servicosDestaque.map((servico) => (
								<li
									key={servico.id}
									className="flex items-center justify-between gap-3 rounded-lg bg-cor-fundo/70 px-3 py-2 text-xs"
								>
									<div className="min-w-0">
										<p className="truncate font-medium text-cor-fonte-primaria">
											{servico.nomeServico}
										</p>
										<p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-cor-fonte-secundaria tabular-nums">
											<Clock className="size-3" strokeWidth={1.5} />
											{formatarDuracao(servico.duracaoMinutos)}
										</p>
									</div>
									<span className="shrink-0 font-semibold text-cor-fonte-primaria tabular-nums">
										{formatarPrecoCentavos(servico.precoCentavos)}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div className="mt-5 pt-2">
				<Link to={`/vitrine/${organizacao.id}`} className="block">
					<Botao
						variante="secundario"
						larguraTotal
						iconeDireita={ArrowRight}
					>
						Ver vitrine e agendar
					</Botao>
				</Link>
			</div>
		</article>
	);
}
