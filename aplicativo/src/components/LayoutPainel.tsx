import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icones } from '../assets/icones';
import { IconeMenu, type NomeIconeMenu } from './IconeMenu';
import { Logo } from './Logo';

interface ItemNavegacao {
	nome: NomeIconeMenu;
	rotulo: string;
	rotuloCurto: string;
	iconeMobile: string;
	/** `null` enquanto a página ainda não existe ("Em breve"). */
	rota: string | null;
}

const ITENS_NAVEGACAO: ItemNavegacao[] = [
	{ nome: 'inicio', rotulo: 'Início', rotuloCurto: 'Início', iconeMobile: icones.arredondado.inicio, rota: '/' },
	{ nome: 'agendamentos', rotulo: 'Agendamentos', rotuloCurto: 'Agenda', iconeMobile: icones.arredondado.calendario, rota: null },
	{ nome: 'clientes', rotulo: 'Clientes', rotuloCurto: 'Clientes', iconeMobile: icones.arredondado.clientes, rota: null },
	{ nome: 'servicos', rotulo: 'Serviços', rotuloCurto: 'Serviços', iconeMobile: icones.arredondado.servicos, rota: null },
	{ nome: 'configuracoes', rotulo: 'Configurações', rotuloCurto: 'Ajustes', iconeMobile: icones.arredondado.configuracoes, rota: '/configuracoes' },
];

interface PropriedadesLayoutPainel {
	itemAtivo: NomeIconeMenu;
	titulo: string;
	descricao: string;
	/** Nome e localização exibidos no bloco "Espaço da empresa". */
	empresa: { nome: string; detalhe: string };
	/** Ação principal ao lado do título (ex.: "Salvar alterações"). */
	acao?: ReactNode;
	aoSair: () => void;
	saindo?: boolean;
	children: ReactNode;
}

/**
 * Estrutura do painel do prestador conforme o Figma: menu lateral azul-petróleo
 * e cabeçalho no desktop; cabeçalho compacto e navegação inferior no mobile.
 */
export function LayoutPainel({
	itemAtivo,
	titulo,
	descricao,
	empresa,
	acao,
	aoSair,
	saindo = false,
	children,
}: PropriedadesLayoutPainel) {
	const itemAtual = ITENS_NAVEGACAO.find((item) => item.nome === itemAtivo);

	return (
		<div className="min-h-screen bg-superficie">
			{/* Menu lateral (desktop) */}
			<aside className="fixed inset-y-0 left-0 hidden w-56 flex-col bg-petroleo px-4 pb-8 pt-[30px] lg:flex">
				<Link to="/" aria-label="AgendaJá — página inicial" className="px-2">
					<Logo variante="claro" />
				</Link>

				<p className="mt-11 px-2 text-[10px] font-semibold uppercase tracking-[0.04em] text-nevoa-escura">
					Espaço da empresa
				</p>
				<Link
					to="/configuracoes"
					className="mt-3 flex h-16 items-center justify-between gap-2 rounded-[10px] bg-petroleo-800 px-4 transition hover:bg-petroleo-700"
				>
					<span className="min-w-0">
						<span className="block truncate text-sm font-semibold text-white">
							{empresa.nome}
						</span>
						<span className="mt-0.5 block truncate text-[11px] text-nevoa-media">
							{empresa.detalhe}
						</span>
					</span>
					<img src={icones.chevron} alt="" width={14} height={14} />
				</Link>

				<nav aria-label="Navegação principal" className="mt-9 space-y-3">
					{ITENS_NAVEGACAO.map((item) => {
						const ativo = item.nome === itemAtivo;
						const conteudo = (
							<>
								<span className={`grid size-5 place-items-center ${ativo ? '' : 'text-nevoa-media'}`}>
									<IconeMenu nome={item.nome} ativo={ativo} />
								</span>
								<span className="flex-1">{item.rotulo}</span>
								{!item.rota && (
									<span className="rounded-full bg-petroleo-800 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.04em] text-nevoa-escura">
										Em breve
									</span>
								)}
							</>
						);
						const classes = `flex h-11 items-center gap-3 rounded-[9px] px-4 text-sm ${
							ativo
								? 'bg-marca-500 font-semibold text-petroleo'
								: 'font-medium text-nevoa'
						}`;

						if (!item.rota) {
							return (
								<span key={item.nome} className={`${classes} cursor-not-allowed opacity-60`} aria-disabled="true">
									{conteudo}
								</span>
							);
						}

						return (
							<Link
								key={item.nome}
								to={item.rota}
								aria-current={ativo ? 'page' : undefined}
								className={`${classes} transition ${ativo ? '' : 'hover:bg-petroleo-800'}`}
							>
								{conteudo}
							</Link>
						);
					})}
				</nav>

				<div className="mt-auto px-2">
					<div className="mb-6 h-px bg-petroleo-700" />
					<p className="text-[13px] font-medium text-white">Agenda simples.</p>
					<p className="mt-1 text-[11px] text-nevoa-escura">Seu tempo bem cuidado.</p>
				</div>
			</aside>

			{/* Cabeçalho (mobile) */}
			<header className="sticky top-0 z-20 flex h-24 items-center justify-between bg-petroleo px-5 lg:hidden">
				<Link to="/" aria-label="AgendaJá — página inicial" className="flex items-center gap-2.5">
					<span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-marca-500">
						<img src={icones.marcaCalendario} alt="" width={18} height={18} />
					</span>
					<span>
						<span className="block text-xl font-bold leading-none text-white">
							Agenda<span className="text-marca-500">Já</span>
						</span>
						<span className="mt-1.5 block max-w-[200px] truncate text-[11px] font-medium text-nevoa-clara">
							{empresa.nome}
						</span>
					</span>
				</Link>
				<button
					type="button"
					onClick={aoSair}
					disabled={saindo}
					className="rounded-full px-3 py-2 text-[11px] font-semibold text-marca-500 transition hover:bg-petroleo-800 disabled:opacity-60"
				>
					Sair
				</button>
			</header>

			<div className="pb-28 lg:pb-12 lg:pl-56">
				<div className="mx-auto max-w-[1216px] px-5 lg:px-10">
					{/* Cabeçalho (desktop) */}
					<header className="hidden h-12 items-center justify-between pt-7 lg:flex lg:h-auto">
						<p className="text-[13px] text-tinta-suave">
							{empresa.nome}
							<span className="mx-3">/</span>
							{itemAtual?.rotulo}
						</p>
						<div className="flex items-center gap-5">
							<Link
								to="/configuracoes"
								aria-label="Configurações"
								className="grid size-8 place-items-center rounded-lg text-tinta-suave transition hover:bg-white"
							>
								<IconeMenu nome="configuracoes" />
							</Link>
							<span className="h-[30px] w-px bg-borda" />
							<button
								type="button"
								onClick={aoSair}
								disabled={saindo}
								className="rounded-lg px-3 py-2 text-[13px] font-medium text-tinta-suave transition hover:bg-white hover:text-tinta disabled:opacity-60"
							>
								Sair
							</button>
						</div>
					</header>

					<div className="flex flex-col gap-6 pt-6 lg:flex-row lg:items-start lg:justify-between lg:pt-8">
						<div>
							<h1 className="text-[27px] font-bold leading-tight text-tinta lg:text-[30px]">
								{titulo}
							</h1>
							<p className="mt-2 text-[13px] text-tinta-suave lg:mt-3 lg:text-sm">{descricao}</p>
						</div>
						{acao}
					</div>

					<main className="pt-6 lg:pt-5">{children}</main>
				</div>
			</div>

			{/* Navegação inferior (mobile) */}
			<nav
				aria-label="Navegação principal"
				className="fixed inset-x-0 bottom-0 z-20 grid h-[84px] grid-cols-5 border-t border-borda bg-white pb-5 pt-1 lg:hidden"
			>
				{ITENS_NAVEGACAO.map((item) => {
					const ativo = item.nome === itemAtivo;
					const conteudo = (
						<>
							<span className={`grid h-[30px] w-14 place-items-center rounded-full ${ativo ? 'bg-marca-50' : ''}`}>
								<img src={item.iconeMobile} alt="" width={20} height={20} />
							</span>
							<span className={`mt-1 text-[10px] ${ativo ? 'font-semibold text-marca-700' : 'font-medium text-tinta-suave'}`}>
								{item.rotuloCurto}
							</span>
						</>
					);

					if (!item.rota) {
						return (
							<span
								key={item.nome}
								className="flex flex-col items-center justify-center opacity-40"
								aria-disabled="true"
								title="Em breve"
							>
								{conteudo}
							</span>
						);
					}

					return (
						<Link
							key={item.nome}
							to={item.rota}
							aria-current={ativo ? 'page' : undefined}
							className="flex flex-col items-center justify-center"
						>
							{conteudo}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
