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

export interface PropriedadesLayoutBase {
	previsualizacao: string;
	textoRodape?: string;
	children: ReactNode;
}

const TEXTO_RODAPE_PADRAO =
	'Você recebeu este e-mail porque uma conta foi criada com este endereço no AgendaJá. Se não foi você, apenas ignore esta mensagem.';

const CONFIGURACAO_TAILWIND = {
	theme: {
		extend: {
			colors: CORES_EMAIL,
		},
	},
};

const cabecalhoMarca = (
	<Section className="border-b border-solid border-divisor px-8 pt-6 pb-4">
		<Text className="text-textoPrincipal text-xl font-bold tracking-tight m-0">
			AgendaJá
		</Text>
	</Section>
);

const divisorRodape = <Hr className="border-divisor m-0" />;

export function LayoutBase({
	previsualizacao,
	textoRodape = TEXTO_RODAPE_PADRAO,
	children,
}: PropriedadesLayoutBase) {
	return (
		<Html lang="pt-BR">
			<Head />
			<Preview>{previsualizacao}</Preview>
			<Tailwind config={CONFIGURACAO_TAILWIND}>
				<Body className="bg-fundoPagina font-sans m-0 py-8 px-4">
					<Container className="bg-fundoCartao border border-solid border-bordaSutil rounded-xl mx-auto max-w-[520px] overflow-hidden">
						{cabecalhoMarca}

						<Section className="p-8">{children}</Section>

						{divisorRodape}

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