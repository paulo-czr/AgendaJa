import type { ReactNode } from 'react';
import toast, { Toaster, type Toast } from 'react-hot-toast';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	Loader2,
	X,
} from 'lucide-react';

export type TipoToast = 'sucesso' | 'erro' | 'aviso' | 'info' | 'carregando';

export interface OpcoesToast {
	titulo?: string;
	mensagem: ReactNode;
	acao?: {
		rotulo: string;
		aoClicar: () => void;
	};
	duracaoMs?: number;
}

interface PropriedadesCardToast {
	t: Toast;
	tipo: TipoToast;
	titulo?: string;
	mensagem: ReactNode;
	acao?: {
		rotulo: string;
		aoClicar: () => void;
	};
}

const CONFIGURACOES_TIPO = {
	sucesso: {
		Icone: CheckCircle2,
		classeIcone: 'text-cor-primaria-hover',
		classeFundoIcone: 'bg-cor-primaria-suave border border-cor-primaria/20',
		papel: 'status',
	},
	erro: {
		Icone: AlertCircle,
		classeIcone: 'text-cor-perigo',
		classeFundoIcone: 'bg-cor-perigo-fundo border border-cor-perigo/20',
		papel: 'alert',
	},
	aviso: {
		Icone: AlertTriangle,
		classeIcone: 'text-cor-alerta',
		classeFundoIcone: 'bg-cor-alerta-fundo border border-cor-alerta/20',
		papel: 'status',
	},
	info: {
		Icone: Info,
		classeIcone: 'text-cor-fonte-primaria',
		classeFundoIcone: 'bg-cor-superficie-neutra border border-cor-borda',
		papel: 'status',
	},
	carregando: {
		Icone: Loader2,
		classeIcone: 'text-cor-primaria animate-spin',
		classeFundoIcone: 'bg-cor-primaria-suave border border-cor-primaria/20',
		papel: 'status',
	},
} as const;

function CardToast({ t, tipo, titulo, mensagem, acao }: PropriedadesCardToast) {
	const config = CONFIGURACOES_TIPO[tipo];
	const Icone = config.Icone;

	return (
		<div
			role={config.papel}
			aria-live="polite"
			className={`pointer-events-auto flex w-full max-w-sm items-start gap-3.5 rounded-2xl border border-cor-borda/80 bg-cor-superficie p-4 shadow-flutuante transition-all duration-200 [touch-action:manipulation] ${
				t.visible
					? 'translate-y-0 opacity-100 scale-100'
					: '-translate-y-2 opacity-0 scale-95 pointer-events-none'
			}`}
		>
			<span
				aria-hidden="true"
				className={`grid size-9 shrink-0 place-items-center rounded-xl ${config.classeFundoIcone}`}
			>
				<Icone className={`size-5 ${config.classeIcone}`} strokeWidth={2.2} />
			</span>

			<div className="min-w-0 flex-1 pt-0.5">
				{titulo && (
					<p className="text-[13px] font-semibold leading-5 text-cor-fonte-primaria">
						{titulo}
					</p>
				)}
				<div
					className={`text-xs leading-5 text-cor-fonte-secundaria ${
						titulo ? 'mt-0.5' : 'text-[13px] font-medium text-cor-fonte-primaria'
					}`}
				>
					{mensagem}
				</div>

				{acao && (
					<button
						type="button"
						onClick={() => {
							acao.aoClicar();
							toast.dismiss(t.id);
						}}
						className="mt-2.5 inline-flex items-center text-xs font-semibold text-cor-primaria-escura underline underline-offset-2 transition-colors hover:text-cor-primaria-hover [touch-action:manipulation]"
					>
						{acao.rotulo}
					</button>
				)}
			</div>

			<button
				type="button"
				onClick={() => toast.dismiss(t.id)}
				aria-label="Fechar notificação"
				className="grid size-7 shrink-0 place-items-center rounded-lg text-cor-fonte-secundaria/70 transition-colors hover:bg-cor-fundo hover:text-cor-fonte-primaria [touch-action:manipulation]"
			>
				<X className="size-4" strokeWidth={2} />
			</button>
		</div>
	);
}

function normalizarParametros(
	conteudo: string | OpcoesToast,
	duracaoPadrao: number,
) {
	if (typeof conteudo === 'string') {
		return {
			mensagem: conteudo,
			duracaoMs: duracaoPadrao,
		};
	}
	return {
		titulo: conteudo.titulo,
		mensagem: conteudo.mensagem,
		acao: conteudo.acao,
		duracaoMs: conteudo.duracaoMs ?? duracaoPadrao,
	};
}

/**
 * Utilitário central de toasts do AgendaJá baseado em react-hot-toast,
 * ícones Lucide estilizados e design com Tailwind CSS.
 */
export const notificar = {
	sucesso(conteudo: string | OpcoesToast): string {
		const dados = normalizarParametros(conteudo, 4000);
		return toast.custom(
			(t) => (
				<CardToast
					t={t}
					tipo="sucesso"
					titulo={dados.titulo}
					mensagem={dados.mensagem}
					acao={dados.acao}
				/>
			),
			{ duration: dados.duracaoMs },
		);
	},

	erro(conteudo: string | OpcoesToast): string {
		const dados = normalizarParametros(conteudo, 6000);
		return toast.custom(
			(t) => (
				<CardToast
					t={t}
					tipo="erro"
					titulo={dados.titulo ?? 'Atenção'}
					mensagem={dados.mensagem}
					acao={dados.acao}
				/>
			),
			{ duration: dados.duracaoMs },
		);
	},

	aviso(conteudo: string | OpcoesToast): string {
		const dados = normalizarParametros(conteudo, 5000);
		return toast.custom(
			(t) => (
				<CardToast
					t={t}
					tipo="aviso"
					titulo={dados.titulo}
					mensagem={dados.mensagem}
					acao={dados.acao}
				/>
			),
			{ duration: dados.duracaoMs },
		);
	},

	info(conteudo: string | OpcoesToast): string {
		const dados = normalizarParametros(conteudo, 4500);
		return toast.custom(
			(t) => (
				<CardToast
					t={t}
					tipo="info"
					titulo={dados.titulo}
					mensagem={dados.mensagem}
					acao={dados.acao}
				/>
			),
			{ duration: dados.duracaoMs },
		);
	},

	carregando(mensagem: string): string {
		return toast.custom(
			(t) => <CardToast t={t} tipo="carregando" mensagem={mensagem} />,
			{ duration: Infinity },
		);
	},

	fechar(idToast?: string): void {
		toast.dismiss(idToast);
	},
};

/**
 * Componente Toaster com posição superior direita no desktop e topo centralizado no mobile.
 */
export function ProvedorNotificacoes() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				className: '!bg-transparent !p-0 !shadow-none !border-none',
			}}
		/>
	);
}
