import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import guaxinimDuvida from '../assets/figuras/guaxinim-duvida-404.png';
import { Botao } from '../components/Botao';
import { Logo } from '../components/Logo';

const GRID_4 = [
	'....###..',
	'...#####.',
	'..##.###.',
	'.##..###.',
	'##...###.',
	'#########',
	'.....###.',
	'.....###.',
	'....#####',
];

const GRID_0 = [
	'..#####..',
	'.#######.',
	'.##...##.',
	'.##...##.',
	'.##...##.',
	'.##...##.',
	'.##...##.',
	'.#######.',
	'..#####..',
];

/**
 * Renderiza o "404" pixelado em vetor SVG com os raios verde-água no canto superior direito,
 * reproduzindo fielmente o estilo retrô / pixel art da referência.
 */
function Numero404Pixel({ className = '' }: { className?: string }) {
	const u = 8;
	const yOffset = 22;

	const renderGrid = (grid: string[], offsetX: number) =>
		grid.flatMap((row, y) =>
			row.split('').map((char, x) => {
				if (char !== '#') return null;
				return (
					<rect
						key={`${offsetX}-${x}-${y}`}
						x={offsetX + x * u}
						y={yOffset + y * u}
						width={u}
						height={u}
						fill="#123449"
					/>
				);
			}),
		);

	return (
		<svg
			viewBox="0 0 310 115"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="Erro 404"
			role="img"
		>
			{/* Primeiro 4 */}
			{renderGrid(GRID_4, 10)}

			{/* Zero central */}
			{renderGrid(GRID_0, 96)}

			{/* Segundo 4 */}
			{renderGrid(GRID_4, 182)}

			{/* 3 raios cintilantes no canto superior direito do 404 */}
			<g stroke="#20c9ae" strokeWidth="4.5" strokeLinecap="round">
				{/* Raio superior verticalizado */}
				<line x1="262" y1="20" x2="266" y2="4" />
				{/* Raio intermediário diagonal */}
				<line x1="270" y1="26" x2="286" y2="12" />
				{/* Raio horizontal */}
				<line x1="274" y1="36" x2="292" y2="33" />
			</g>

			{/* Brilho pixelado sutil na lateral */}
			<rect x="296" y="58" width="4" height="12" fill="#20c9ae" opacity="0.6" />
			<rect x="292" y="62" width="12" height="4" fill="#20c9ae" opacity="0.6" />
		</svg>
	);
}

/** Brilho / estrela pixelada decorativa em verde-água (+) */
function BrilhoPixel({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			className={`size-3.5 sm:size-4 shrink-0 text-cor-primaria ${className}`}
			fill="currentColor"
			aria-hidden="true"
		>
			<rect x="6" y="0" width="4" height="16" />
			<rect x="0" y="6" width="16" height="4" />
		</svg>
	);
}

/** Três traços de movimento / cintilação próximos à cauda do guaxinim */
function TracosCauda({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 32 32"
			className={`size-7 sm:size-8 text-cor-primaria ${className}`}
			fill="none"
			stroke="currentColor"
			strokeWidth="3.5"
			strokeLinecap="round"
			aria-hidden="true"
		>
			<line x1="22" y1="22" x2="10" y2="28" />
			<line x1="24" y1="16" x2="8" y2="16" />
			<line x1="22" y1="10" x2="10" y2="4" />
		</svg>
	);
}

export function PaginaNaoEncontrada() {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-cor-superficie font-sans text-cor-fonte-primaria">
			{/* Cabeçalho sutil com logo para navegação rápida */}
			<header className="relative z-20 w-full px-6 py-5 sm:px-10">
				<div className="mx-auto flex max-w-6xl items-center justify-between">
					<Link
						to="/"
						className="rounded-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cor-primaria"
						title="Ir para a página inicial"
					>
						<Logo variante="escuro" />
					</Link>
				</div>
			</header>

			{/* Conteúdo principal centralizado */}
			<main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
				<div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-10 md:flex-row md:items-center md:justify-between lg:gap-16">
					{/* Coluna da Esquerda: Ilustração do Guaxinim com elementos decorativos */}
					<div className="relative flex w-full flex-1 items-center justify-center">
						{/* Círculo suave verde-água de fundo */}
						<div
							className="absolute -z-10 size-64 sm:size-80 md:size-96 lg:size-[430px] rounded-full bg-cor-primaria-suave/90 transition-transform"
							aria-hidden="true"
						/>

						{/* Elementos decorativos ao redor do guaxinim */}
						<BrilhoPixel className="absolute -top-3 left-6 sm:top-2 sm:left-10" />
						<BrilhoPixel className="absolute top-10 right-8 sm:top-8 sm:right-14 opacity-80" />
						<TracosCauda className="absolute bottom-14 left-2 sm:bottom-16 sm:left-4" />

						{/* Ilustração colorida do Guaxinim */}
						<div className="relative flex flex-col items-center">
							<img
								src={guaxinimDuvida}
								alt="Ilustração de guaxinim em dúvida sentado com as mãos na cabeça ao lado de um monitor com erro"
								className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[440px] h-auto object-contain select-none drop-shadow-sm"
								draggable={false}
							/>

							{/* Sombra suave no chão */}
							<div
								className="mt-[-12px] h-3 w-4/5 max-w-[340px] rounded-full bg-cor-secundaria/10 blur-[2px]"
								aria-hidden="true"
							/>
						</div>
					</div>

					{/* Coluna da Direita: 404, Textos e Botão de Ação */}
					<div className="flex w-full flex-1 flex-col items-center text-center md:items-start md:text-left">
						{/* 404 Pixel Art */}
						<div className="w-full max-w-[260px] sm:max-w-[310px]">
							<Numero404Pixel className="h-auto w-full drop-shadow-sm" />
						</div>

						{/* Título Principal */}
						<h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px] leading-tight text-cor-fonte-primaria">
							Página <span className="text-cor-primaria">não</span> encontrada
						</h1>

						{/* Mensagem explicativa amigável */}
						<p className="mt-4 max-w-md text-base leading-relaxed text-cor-fonte-secundaria sm:text-lg">
							Parece que esta página se perdeu por aí.
							<br className="hidden sm:inline" /> Vamos te ajudar a voltar para
							o caminho certo.
						</p>

						{/* Botão de Retorno */}
						<div className="mt-8">
							<Link to="/">
								<Botao
									variante="primario"
									tamanho="grande"
									iconeEsquerda={Home}
								>
									Voltar para o início
								</Botao>
							</Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
