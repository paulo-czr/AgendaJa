import type { FormEvent } from 'react';
import { CalendarCheck, LogOut, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
import { Logo } from '../../../components/Logo';
import BlurText from '../../../components/reactbits/BlurText';
import type { UsuarioPublico } from '../../autenticacao/servicos/autenticacaoServico';

interface PropriedadesHeroCliente {
	usuario: UsuarioPublico | null;
	saindo: boolean;
	aoSair: () => void;
	busca: string;
	aoAlterarBusca: (valor: string) => void;
	aoBuscar: (evento: FormEvent<HTMLFormElement>) => void;
}

export function HeroCliente({
	usuario,
	saindo,
	aoSair,
	busca,
	aoAlterarBusca,
	aoBuscar,
}: PropriedadesHeroCliente) {
	return (
		<header className="border-b border-cor-secundaria-borda bg-cor-secundaria text-cor-fonte-invertida">
			<div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
				<nav
					aria-label="Navegação principal"
					className="flex flex-wrap items-center justify-between gap-4"
				>
					<Link to="/" aria-label="AgendaJá — página inicial">
						<Logo variante="claro" />
					</Link>

					{usuario ? (
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-xs text-cor-fonte-invertida-suave">
								Olá,{' '}
								<strong className="font-semibold text-cor-fonte-invertida">
									{usuario.nome}
								</strong>
							</span>
							<a
								href="#estabelecimentos"
								className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-cor-secundaria-borda bg-cor-secundaria-suave px-3 text-xs font-medium text-cor-fonte-invertida transition-colors hover:bg-cor-secundaria-borda/60"
							>
								<CalendarCheck className="size-3.5 text-cor-primaria" />
								Meus Agendamentos
							</a>
							<Botao
								variante="ghost"
								tamanho="pequeno"
								iconeEsquerda={LogOut}
								onClick={aoSair}
								disabled={saindo}
								className="text-cor-fonte-invertida-suave hover:bg-cor-secundaria-suave hover:text-cor-fonte-invertida"
							>
								Sair
							</Botao>
						</div>
					) : (
						<div className="flex items-center gap-2.5">
							<Link
								to="/entrar"
								className="inline-flex h-9 items-center rounded-lg px-3.5 text-xs font-medium text-cor-fonte-invertida-suave transition-colors hover:text-cor-fonte-invertida"
							>
								Entrar
							</Link>
							<Link to="/cadastro">
								<Botao variante="primario" tamanho="pequeno">
									Cadastrar
								</Botao>
							</Link>
						</div>
					)}
				</nav>

				<div className="mt-10 max-w-3xl pb-4">
					<p className="text-xs font-medium text-cor-primaria">
						Agendamento direto, sem complicação
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-cor-fonte-invertida sm:text-4xl">
						<BlurText
							text="Encontre serviços e reserve seu horário em minutos"
							delay={60}
							animateBy="words"
							direction="top"
							trigger="load"
						/>
					</h1>
					<p className="mt-3 max-w-2xl text-sm leading-6 text-cor-fonte-invertida-suave">
						Explore estabelecimentos parceiros, compare serviços disponíveis e
						acesse a vitrine pública de cada empresa em tempo real.
					</p>

					<form
						onSubmit={aoBuscar}
						className="mt-6 flex flex-col gap-2.5 sm:flex-row"
					>
						<div className="relative flex-1">
							<Search
								className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-cor-fonte-secundaria"
								strokeWidth={1.5}
								aria-hidden="true"
							/>
							<input
								type="search"
								value={busca}
								onChange={(evento) => aoAlterarBusca(evento.target.value)}
								placeholder="Buscar por estabelecimento, serviço ou categoria"
								aria-label="Buscar estabelecimentos ou serviços"
								className="h-12 w-full rounded-xl border border-cor-secundaria-borda bg-cor-superficie pl-10 pr-10 text-sm text-cor-fonte-primaria placeholder:text-cor-fonte-secundaria focus:border-cor-primaria focus:outline-none focus:ring-2 focus:ring-cor-primaria/30"
							/>
							{busca && (
								<button
									type="button"
									onClick={() => aoAlterarBusca('')}
									aria-label="Limpar busca"
									className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-cor-fonte-secundaria hover:bg-cor-fundo hover:text-cor-fonte-primaria"
								>
									<X className="size-3.5" />
								</button>
							)}
						</div>
						<Botao
							type="submit"
							variante="primario"
							tamanho="grande"
							iconeEsquerda={Search}
						>
							Buscar
						</Botao>
					</form>
				</div>
			</div>
		</header>
	);
}
