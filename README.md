# AgendaJá

Monorepo da plataforma de agendamento, com API NestJS e aplicativo React.

## Requisitos

- Node.js 22.x e npm
- PostgreSQL acessível pela variável `DATABASE_URL`
- Chave do Resend e remetente autorizado no Resend

## Configuração local

1. Copie `.env.example` para `.env` na raiz e configure `DATABASE_URL`, segredos JWT e credenciais do Resend.
2. Instale as dependências com `npm install`.
3. Gere e revise a migration com `npm run banco:gerar`. A geração não altera o banco.
4. Aplique a migration somente após revisá-la, com `npm run banco:migrar`.
5. Inicie a API e o aplicativo em terminais separados com `npm run dev:servidor` e `npm run dev:aplicativo`.

O cadastro e a recuperação de senha enviam links pelo Resend. O frontend usa `VITE_API_URL`; a API aceita credenciais de navegador apenas da origem definida em `URL_APLICATIVO`.

## Validação

- `npm run build` compila os dois workspaces.
- `npm --workspace=servidor test -- --runInBand` executa os testes da API.