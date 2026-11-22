import {
	Body,
	Container,
	Head,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import type { ReactNode } from 'react';
import { CORES_EMAIL } from '../constants/cores';

interface PropriedadesLayoutBase {
	previsualizacao: string;
	textoRodape?: string;
	children: ReactNode;
}

const configuracaoTailwind = {
	theme: {
		extend: {
			colors: CORES_EMAIL,
		},
	},
};

export function LayoutBase({
	previsualizacao,
	textoRodape = 'Você recebeu este e-mail porque uma conta foi criada com este endereço no AgendaJá. Se não foi você, apenas ignore esta mensagem.',
	children,
}: PropriedadesLayoutBase) {
	return (
		<Html lang="pt-BR">
			<Head />
			<Preview>{previsualizacao}</Preview>
			<Tailwind config={configuracaoTailwind}>
				<Body className="bg-fundoPagina font-sans m-0 py-8 px-4">
					<Container className="bg-fundoCartao border border-solid border-bordaSutil rounded-xl mx-auto max-w-[520px] overflow-hidden">
						<Section className="border-b border-solid border-divisor px-8 pt-6 pb-4">
							<Text className="text-textoPrincipal text-xl font-bold tracking-tight m-0">
								AgendaJá
							</Text>
						</Section>

						<Section className="p-8">{children}</Section>

						<Hr className="border-divisor m-0" />

						<Section className="bg-fundoRodape px-8 py-5">
							<Text className="text-textoSecundario text-xs leading-normal m-0">
								{textoRodape}
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}