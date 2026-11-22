import { Button, Heading, Link, Text } from '@react-email/components';
import { LayoutBase } from './layout-base';

export interface PropriedadesRecuperacaoSenha {
    nomeUsuario: string;
    linkRecuperacao: string;
    horasExpiracao?: number;
}

export function RecuperacaoSenha({
    nomeUsuario,
    linkRecuperacao,
    horasExpiracao = 1,
}: PropriedadesRecuperacaoSenha) {
    const textoTempo =
        horasExpiracao === 1 ? '1 hora' : `${horasExpiracao} horas`;

    return (
        <LayoutBase
            previsualizacao={`Redefina sua senha no AgendaJá. O link expira em ${textoTempo}.`}
            textoRodape="Você recebeu este e-mail porque foi solicitada a redefinição de senha da sua conta no AgendaJá. Se não foi você, nenhuma alteração foi feita e você pode ignorar esta mensagem."
        >
            <Heading
                as="h1"
                className="text-textoPrincipal text-xl font-semibold mt-0 mb-4"
            >
                Olá, {nomeUsuario}!
            </Heading>

            <Text className="text-textoCorpo text-[15px] leading-relaxed mt-0 mb-6">
                Recebemos uma solicitação para redefinir a senha da sua conta no{' '}
                <strong>AgendaJá</strong>. Clique no botão abaixo para cadastrar uma
                nova senha:
            </Text>

            <Button
                href={linkRecuperacao}
                className="bg-primaria text-white text-[15px] font-semibold rounded-lg px-6 py-3 mb-6 inline-block no-underline"
            >
                Redefinir minha senha
            </Button>

            <Text className="text-textoSecundario text-[13px] leading-normal mt-0 mb-4">
                Por segurança, este link é válido por <strong>{textoTempo}</strong>.
            </Text>

            <Text className="text-textoAuxiliar text-xs leading-normal m-0 break-all">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
                <br />
                <Link href={linkRecuperacao} className="text-primaria underline">
                    {linkRecuperacao}
                </Link>
            </Text>
        </LayoutBase>
    );
}