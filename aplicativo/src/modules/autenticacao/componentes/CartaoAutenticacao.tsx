import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icones } from '../../../assets/icones';
import { Logo } from '../../../components/Logo';

interface PropriedadesCartaoAutenticacao {
	titulo: string;
	descricao: string;
	children: ReactNode;
}

/**
 * Layout das telas de autenticação. Reúne elementos da identidade visual:
 * painel azul-petróleo com ondas suaves de fundo, selo ilustrado da marca,
 * manchete em dois tons e campos do formulário.
 */
export function CartaoAutenticacao({
	titulo,
	descricao,
	children,
}: PropriedadesCartaoAutenticacao) {
	return (
		<main className="grid min-h-screen bg-superficie lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
			<aside className="relative hidden flex-col justify-between overflow-hidden bg-petroleo px-12 py-10 lg:flex">
				{/* Ondas orgânicas sutis de fundo do painel petróleo */}
				<div
					className="pointer-events-none absolute -top-16 -right-24 h-[560px] w-[360px] rounded-[100%] bg-[#12384c]/50 blur-3xl"
					aria-hidden="true"
				/>
				<div
					className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#12384c]/40 blur-2xl"
					aria-hidden="true"
				/>
				<svg
					className="pointer-events-none absolute top-0 right-0 h-full w-48 text-[#143b4f]/35 select-none"
					viewBox="0 0 160 800"
					fill="currentColor"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					<path d="M160,0 C90,180 20,320 60,480 C100,620 160,720 160,800 Z" />
				</svg>

				<Link to="/" aria-label="AgendaJá — página inicial" className="relative z-10">
					<Logo variante="claro" />
				</Link>

				<div className="relative z-10 my-auto max-w-md py-4">
					<img
						src={icones.seloAgenda}
						alt=""
						width={116}
						height={116}
						className="mb-8"
					/>
					<p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-marca-500">
						Agendamentos do seu jeito
					</p>
					<h2 className="mt-4 text-[34px] font-bold leading-[1.25] text-white">
						Sua agenda organizada,{' '}
						<span className="text-marca-500">sem perder tempo.</span>
					</h2>
					<p className="mt-5 text-[15px] leading-relaxed text-nevoa-clara">
						Horários, clientes e serviços em um só lugar, com o status de
						cada atendimento sempre à vista.
					</p>
				</div>

				<div className="relative z-10">
					<div className="mb-6 h-px w-44 bg-petroleo-700" />
					<p className="text-[13px] font-medium text-white">Agenda simples.</p>
					<p className="mt-1 text-[11px] text-nevoa-escura">
						Seu tempo bem cuidado.
					</p>
				</div>
			</aside>

			<div className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
				{/* Fundo suave com curva verde-água no canto */}
				<div
					className="pointer-events-none absolute -top-24 -right-24 h-[440px] w-[440px] rounded-full bg-marca-50/70 blur-3xl"
					aria-hidden="true"
				/>
				<div className="w-full max-w-[440px]">
					<Link
						to="/"
						aria-label="AgendaJá — página inicial"
						className="mb-8 inline-block lg:hidden"
					>
						<Logo />
					</Link>

					<section className="rounded-2xl bg-white p-7 shadow-painel sm:p-8">
						<header className="mb-7">
							<p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-marca-700">
								Sua rotina em dia
							</p>
							<h1 className="mt-2 text-[26px] font-bold leading-tight text-tinta">
								{titulo}
							</h1>
							<p className="mt-2 text-[13px] leading-relaxed text-tinta-suave">
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
