import type { ReactNode } from 'react';

interface PropriedadesCartaoAutenticacao {
	titulo: string;
	descricao: string;
	children: ReactNode;
}

export function CartaoAutenticacao({
	titulo,
	descricao,
	children,
}: PropriedadesCartaoAutenticacao) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-marca-50 via-[#f6f7f5] to-[#f6f7f5] px-4 py-12">
			<section className="w-full max-w-md rounded-3xl border border-white bg-white p-7 shadow-painel sm:p-9">
				<a
					className="inline-flex items-center gap-2 text-sm font-bold tracking-tight text-marca-700"
					href="/"
				>
					<span className="grid h-8 w-8 place-items-center rounded-xl bg-marca-600 text-white">
						A
					</span>
					AgendaJá
				</a>
				<header className="mb-7 mt-8">
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-marca-600">
						Sua rotina em dia
					</p>
					<h1 className="text-2xl font-semibold tracking-tight text-slate-900">
						{titulo}
					</h1>
					<p className="mt-2 text-sm leading-6 text-slate-500">{descricao}</p>
				</header>
				{children}
			</section>
		</main>
	);
}
