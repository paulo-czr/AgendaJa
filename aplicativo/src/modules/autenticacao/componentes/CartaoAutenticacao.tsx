import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { icones } from '../../../assets/icones';
import { Logo } from '../../../componentes/Logo';

interface PropriedadesCartaoAutenticacao {
	titulo: string;
	descricao: string;
	children: ReactNode;
}

/**
 * Layout das telas de autenticação. O Figma não tem tela de login, então ela
 * reúne elementos existentes do design: painel azul-petróleo do menu lateral,
 * manchete em dois tons do cartão de boas-vindas e campos do formulário.
 */
export function CartaoAutenticacao({
	titulo,
	descricao,
	children,
}: PropriedadesCartaoAutenticacao) {
	return (
		<main className="grid min-h-screen bg-superficie lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
			<aside className="relative hidden flex-col justify-between overflow-hidden bg-petroleo px-12 py-10 lg:flex">
				<Link to="/" aria-label="AgendaJá — página inicial">
					<Logo variante="claro" />
				</Link>

				<div className="max-w-md">
					<img
						src={icones.seloAgenda}
						alt=""
						width={116}
						height={116}
						className="mb-10"
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

				<div>
					<div className="mb-6 h-px w-44 bg-petroleo-700" />
					<p className="text-[13px] font-medium text-white">Agenda simples.</p>
					<p className="mt-1 text-[11px] text-nevoa-escura">
						Seu tempo bem cuidado.
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
