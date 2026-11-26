import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icones } from '../../../assets/icones';
import { Logo } from '../../../components/Logo';
import BlurText from '../../../components/reactbits/BlurText';

interface PropriedadesCartaoAutenticacao {
	titulo: string;
	descricao: string;
	children: ReactNode;
}

/**
 * Layout das telas de autenticação seguindo o Design System do AgendaJá:
 * painel lateral em cor secundária com selo da marca e área de formulário limpa.
 */
export function CartaoAutenticacao({
	titulo,
	descricao,
	children,
}: PropriedadesCartaoAutenticacao) {
	return (
		<main className="grid min-h-screen bg-cor-fundo lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
			<aside className="relative hidden flex-col justify-between overflow-hidden bg-cor-secundaria px-12 py-10 lg:flex">
				<svg
					className="pointer-events-none absolute top-0 right-0 h-full w-44 text-cor-secundaria-suave/60 select-none"
					viewBox="0 0 160 800"
					fill="currentColor"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path d="M160,0 C90,180 20,320 60,480 C100,620 160,720 160,800 Z" />
				</svg>

				<Link
					to="/"
					aria-label="AgendaJá — página inicial"
					className="relative z-10 w-fit"
				>
					<Logo variante="claro" />
				</Link>

				<div className="relative z-10 my-auto max-w-md py-4">
					<img
						src={icones.seloAgenda}
						alt=""
						width={104}
						height={104}
						className="mb-8"
					/>
					<p className="text-xs font-medium text-cor-primaria">
						Agendamentos do seu jeito
					</p>
					<h2 className="mt-3 text-3xl font-semibold leading-tight text-cor-fonte-invertida">
						<BlurText
							text="Sua agenda organizada, sem perder tempo"
							delay={60}
							animateBy="words"
							direction="top"
							trigger="load"
						/>
					</h2>
					<p className="mt-4 text-sm leading-relaxed text-cor-fonte-invertida-suave">
						Horários, clientes e serviços em um só lugar, com o status de cada
						atendimento sempre à vista.
					</p>
				</div>

				<div className="relative z-10">
					<div className="mb-5 h-px w-40 bg-cor-secundaria-borda" />
					<p className="text-xs font-medium text-cor-fonte-invertida">
						Agenda simples
					</p>
					<p className="mt-1 text-[11px] text-cor-fonte-invertida-mutada">
						Seu tempo bem cuidado
					</p>
				</div>
			</aside>

			<div className="flex items-center justify-center px-4 py-10 sm:px-8">
				<div className="w-full max-w-[440px]">
					<Link
						to="/"
						aria-label="AgendaJá — página inicial"
						className="mb-8 inline-block lg:hidden"
					>
						<Logo />
					</Link>

					<section className="rounded-2xl border border-cor-borda/80 bg-cor-superficie p-7 shadow-sutil sm:p-8">
						<header className="mb-7">
							<h1 className="text-2xl font-semibold tracking-tight text-cor-fonte-primaria">
								{titulo}
							</h1>
							<p className="mt-2 text-[13px] leading-relaxed text-cor-fonte-secundaria">
								{descricao}
							</p>
						</header>
						{children}
					</section>
				</div>
			</div>
		</main>
	);
}
