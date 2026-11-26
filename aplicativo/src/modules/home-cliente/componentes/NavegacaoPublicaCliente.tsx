import { CalendarCheck, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Botao } from '../../../components/Botao';
import { Logo } from '../../../components/Logo';
import type { UsuarioPublico } from '../../autenticacao/servicos/autenticacaoServico';

interface PropriedadesNavegacaoPublicaCliente {
	usuario: UsuarioPublico | null;
	saindo: boolean;
	aoSair: () => void;
	hrefAgendamentos?: string;
}

export function NavegacaoPublicaCliente({
	usuario,
	saindo,
	aoSair,
	hrefAgendamentos = '#estabelecimentos',
}: PropriedadesNavegacaoPublicaCliente) {
	return (
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
						href={hrefAgendamentos}
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
	);
}
