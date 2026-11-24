import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from 'react';

export interface ItemAba<Id extends string = string> {
	id: Id;
	rotulo: string;
	descricao?: string;
	icone?: ReactNode;
	badge?: ReactNode;
	desabilitado?: boolean;
}

export interface PropriedadesNavegacaoAbas<Id extends string = string> {
	itens: readonly ItemAba<Id>[];
	abaAtiva: Id;
	aoMudarAba: (id: Id) => void;
	variante?: 'pilula' | 'linha';
	ariaLabel?: string;
	className?: string;
}

interface PosicaoIndicador {
	left: number;
	width: number;
	visivel: boolean;
}

/**
 * Componente reutilizável de navegação por abas com indicador ativo deslizante
 * fluido (animação CSS de alta performance), suporte a variantes (pílula / linha),
 * navegação completa por teclado (WAI-ARIA tabs) e rolagem horizontal suave no mobile.
 */
export function NavegacaoAbas<Id extends string = string>({
	itens,
	abaAtiva,
	aoMudarAba,
	variante = 'pilula',
	ariaLabel = 'Navegação por seções',
	className = '',
}: PropriedadesNavegacaoAbas<Id>) {
	const containerRef = useRef<HTMLDivElement>(null);
	const botoesRef = useRef<Map<Id, HTMLButtonElement>>(new Map());

	const [indicador, definirIndicador] = useState<PosicaoIndicador>({
		left: 0,
		width: 0,
		visivel: false,
	});

	const atualizarPosicaoIndicador = useCallback(() => {
		const container = containerRef.current;
		const botaoAtivo = botoesRef.current.get(abaAtiva);

		if (!container || !botaoAtivo) {
			definirIndicador((ant) => ({ ...ant, visivel: false }));
			return;
		}

		const rectContainer = container.getBoundingClientRect();
		const rectBotao = botaoAtivo.getBoundingClientRect();

		definirIndicador({
			left: rectBotao.left - rectContainer.left + container.scrollLeft,
			width: rectBotao.width,
			visivel: true,
		});
	}, [abaAtiva]);

	useEffect(() => {
		atualizarPosicaoIndicador();

		// Mantém o indicador alinhado se a janela mudar de tamanho
		window.addEventListener('resize', atualizarPosicaoIndicador);
		return () => window.removeEventListener('resize', atualizarPosicaoIndicador);
	}, [atualizarPosicaoIndicador]);

	function tratarNavegacaoTeclado(evento: KeyboardEvent<HTMLButtonElement>, indiceAtual: number) {
		const itensHabilitados = itens.filter((i) => !i.desabilitado);
		const indiceNoFiltrado = itensHabilitados.findIndex((i) => i.id === itens[indiceAtual].id);

		let proximoIndice: number | null = null;

		switch (evento.key) {
			case 'ArrowRight':
				proximoIndice = (indiceNoFiltrado + 1) % itensHabilitados.length;
				break;
			case 'ArrowLeft':
				proximoIndice = (indiceNoFiltrado - 1 + itensHabilitados.length) % itensHabilitados.length;
				break;
			case 'Home':
				proximoIndice = 0;
				break;
			case 'End':
				proximoIndice = itensHabilitados.length - 1;
				break;
		}

		if (proximoIndice !== null) {
			evento.preventDefault();
			const proximoItem = itensHabilitados[proximoIndice];
			aoMudarAba(proximoItem.id);
			const botao = botoesRef.current.get(proximoItem.id);
			botao?.focus();
		}
	}

	const ehLinha = variante === 'linha';

	return (
		<div
			ref={containerRef}
			role="tablist"
			aria-label={ariaLabel}
			className={`relative flex items-center overflow-x-auto no-scrollbar [touch-action:pan-x] ${
				ehLinha
					? 'border-b border-borda'
					: 'rounded-xl border border-borda/80 bg-superficie-neutra/80 p-1'
			} ${className}`}
		>
			{/* Indicador deslizante animado */}
			{indicador.visivel && (
				<span
					aria-hidden="true"
					style={{
						transform: `translateX(${indicador.left}px)`,
						width: `${indicador.width}px`,
					}}
					className={`absolute pointer-events-none transition-[transform,width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
						ehLinha
							? 'bottom-0 left-0 h-0.5 bg-marca-500'
							: 'bottom-1 left-0 top-1 rounded-[9px] border border-borda/60 bg-white shadow-[0_1px_2px_rgba(14,41,57,0.06)]'
					}`}
				/>
			)}

			{itens.map((item, indice) => {
				const ativo = item.id === abaAtiva;

				return (
					<button
						key={item.id}
						ref={(el) => {
							if (el) {
								botoesRef.current.set(item.id, el);
							} else {
								botoesRef.current.delete(item.id);
							}
						}}
						id={`aba-${item.id}`}
						role="tab"
						type="button"
						aria-selected={ativo}
						aria-controls={`painel-aba-${item.id}`}
						tabIndex={ativo ? 0 : -1}
						disabled={item.desabilitado}
						onClick={() => aoMudarAba(item.id)}
						onKeyDown={(evento) => tratarNavegacaoTeclado(evento, indice)}
						className={`relative z-10 flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-xs font-medium transition-colors [touch-action:manipulation] sm:px-5 sm:py-2.5 sm:text-[13px] disabled:cursor-not-allowed disabled:opacity-50 ${
							ehLinha ? 'pb-3' : ''
						} ${
							ativo
								? 'font-semibold text-tinta'
								: 'text-tinta-suave hover:text-tinta focus-visible:text-tinta'
						}`}
					>
						{item.icone && (
							<span
								aria-hidden="true"
								className={`transition-colors ${ativo ? 'text-marca-700' : 'text-tinta-suave/80'}`}
							>
								{item.icone}
							</span>
						)}

						<span>{item.rotulo}</span>

						{item.badge && (
							<span className="inline-flex items-center justify-center">
								{item.badge}
							</span>
						)}
					</button>
				);
			})}
		</div>
	);
}
