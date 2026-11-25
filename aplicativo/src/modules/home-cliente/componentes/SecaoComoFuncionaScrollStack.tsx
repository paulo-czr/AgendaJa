import { CalendarClock, CheckCircle2, Store } from 'lucide-react';
import ScrollStack, {
	ScrollStackItem,
} from '../../../components/reactbits/ScrollStack';

const PASSOS = [
	{
		numero: '01',
		titulo: 'Escolha o estabelecimento',
		descricao:
			'Navegue pelas empresas parceiras, confira endereço, telefone e os serviços em destaque antes mesmo de fazer login.',
		Icone: Store,
	},
	{
		numero: '02',
		titulo: 'Compare serviços e durações',
		descricao:
			'Veja preços transparentes, categorias organizadas e o tempo estimado de cada atendimento na vitrine pública.',
		Icone: CalendarClock,
	},
	{
		numero: '03',
		titulo: 'Reserve com confirmação rápida',
		descricao:
			'Selecione o melhor horário conforme a disponibilidade real da empresa e acompanhe seus agendamentos.',
		Icone: CheckCircle2,
	},
] as const;

export function SecaoComoFuncionaScrollStack() {
	return (
		<section className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
			<div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
				<div>
					<p className="text-xs font-medium text-cor-primaria-escura">
						Como funciona
					</p>
					<h2 className="mt-1 text-xl font-semibold text-cor-fonte-primaria sm:text-2xl">
						Do catálogo à confirmação em três passos
					</h2>
				</div>
				<p className="text-xs text-cor-fonte-secundaria">
					Role os cartões abaixo para acompanhar o fluxo
				</p>
			</div>

			<div className="h-[360px] overflow-hidden rounded-2xl border border-cor-borda/80 bg-cor-superficie shadow-sutil">
				<ScrollStack
					itemDistance={48}
					itemStackDistance={18}
					stackPosition="14%"
					baseScale={0.92}
					itemScale={0.03}
					dimAmount={0.04}
					blurAmount={0}
					className="px-4 sm:px-8"
				>
					{PASSOS.map(({ numero, titulo, descricao, Icone }) => (
						<ScrollStackItem
							key={numero}
							itemClassName="!h-auto !min-h-[210px] !rounded-2xl border border-cor-borda/80 !bg-cor-superficie !p-6 sm:!p-8 !text-cor-fonte-primaria"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex items-start gap-4">
									<span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cor-primaria-suave text-cor-primaria-escura">
										<Icone className="size-5" strokeWidth={1.75} />
									</span>
									<div>
										<span className="text-xs font-semibold text-cor-primaria-escura tabular-nums">
											Passo {numero}
										</span>
										<h3 className="mt-1 text-lg font-semibold text-cor-fonte-primaria">
											{titulo}
										</h3>
										<p className="mt-2 max-w-xl text-sm leading-6 text-cor-fonte-secundaria">
											{descricao}
										</p>
									</div>
								</div>
							</div>
						</ScrollStackItem>
					))}
				</ScrollStack>
			</div>
		</section>
	);
}
