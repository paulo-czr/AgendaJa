import useEmblaCarousel from 'embla-carousel-react';
import { type LucideIcon } from 'lucide-react';

type Destaque = { Icone: LucideIcon; texto: string };

export function FaixaDestaques({ itens }: { itens: Destaque[] }) {
	const [emblaRef] = useEmblaCarousel({
		dragFree: true,
		align: 'start',
		containScroll: 'trimSnaps',
	});

	return (
		<div
			ref={emblaRef}
			className="mt-4 overflow-hidden cursor-grab active:cursor-grabbing"
		>
			<ul className="-ml-2 flex select-none">
				{itens.map(({ Icone, texto }) => (
					<li key={texto} className="min-w-0 shrink-0 grow-0 basis-auto pl-2">
						<div className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-cor-borda/70 bg-cor-fundo/70 px-3 py-2 text-xs font-medium text-cor-fonte-primaria">
							<Icone
								aria-hidden="true"
								className="size-4 text-cor-primaria-escura"
								strokeWidth={1.75}
							/>
							{texto}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
