import { Button, Heading, Link, Text } from '@react-email/components';
import { LayoutBase } from './layout-base';

export interface PropriedadesVerificacaoEmail {
    nomeUsuario: string;
    linkVerificacao: string;
    horasExpiracao?: number;
}

export function VerificacaoEmail({
    nomeUsuario,
    linkVerificacao,
    horasExpiracao = 24,
}: PropriedadesVerificacaoEmail) {
    return (
        <LayoutBase
            previsualizacao={`Confirme seu cadastro no AgendaJá. O link expira em ${horasExpiracao} horas.`}
        >
            <Heading
                as="h1"
                className="text-textoPrincipal text-xl font-semibold mt-0 mb-4"
            >
                Olá, {nomeUsuario}!
            </Heading>

            <Text className="text-textoCorpo text-[15px] leading-relaxed mt-0 mb-6">
                Falta pouco para ativar sua conta no <strong>AgendaJá</strong>. Clique no
                botão abaixo para confirmar que este endereço de e-mail pertence a você:
            </Text>

            <Button
                href={linkVerificacao}
                className="bg-primaria text-white text-[15px] font-semibold rounded-lg px-6 py-3 mb-6 inline-block no-underline"
            >
                Verificar meu e-mail
            </Button>

            <Text className="text-textoSecundario text-[13px] leading-normal mt-0 mb-4">
                Por segurança, este link é válido por{' '}
                <strong>{horasExpiracao} horas</strong>.
            </Text>

            <Text className="text-textoAuxiliar text-xs leading-normal m-0 break-all">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                <br />
                <Link href={linkVerificacao} className="text-primaria underline">
                    {linkVerificacao}
                </Link>
            </Text>
        </LayoutBase>
    );
}