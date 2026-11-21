# Plano Técnico 001: Autenticação

## 1. Modelagem de Banco de Dados (Drizzle ORM + Supabase)
Pasta: `servidor/src/database/schemas/`

### Tabela `usuarios`
- `id`: `uuid` (PK, defaultRandom)
- `nome`: `varchar(150)` (notNull)
- `email`: `varchar(255)` (notNull, unique)
- `senha_hash`: `text` (notNull)
- `telefone`: `varchar(20)` (notNull)
- `role`: `enum('cliente', 'prestador')` (notNull, default `'cliente'`)
- `email_verificado`: `boolean` (notNull, default `false`)
- `criado_em`: `timestamp` (defaultNow)
- `atualizado_em`: `timestamp` (defaultNow)

### Tabela `tokens_autenticacao`
- `id`: `uuid` (PK, defaultRandom)
- `id_usuario`: `uuid` (FK -> `usuarios.id`, onDelete: `'cascade'`)
- `token_hash`: `text` (notNull)
- `tipo`: `enum('verificacao_email', 'recuperacao_senha', 'refresh_token')` (notNull)
- `expira_em`: `timestamp` (notNull)
- `usado_em`: `timestamp` (nullable)
- `criado_em`: `timestamp` (defaultNow)

## 2. Endpoints da API (`servidor/src/modules/autenticacao/`)
- `POST /autenticacao/cadastrar` — Cria usuário, gera token de verificação (24h) e dispara e-mail via Resend.
- `POST /autenticacao/verificar-email` — Valida token e marca `email_verificado = true`.
- `POST /autenticacao/reenviar-verificacao` — Gera novo token de verificação para e-mail pendente.
- `POST /autenticacao/entrar` — Valida credenciais, grava cookies HTTP-only (`token_acesso`, `token_atualizacao`) e retorna dados públicos do usuário.
- `POST /autenticacao/renovar` — Lê cookie `token_atualizacao`, valida no banco e emite novo `token_acesso`.
- `POST /autenticacao/sair` — Revoga refresh token e limpa os cookies.
- `POST /autenticacao/esqueci-senha` — Envia e-mail via Resend com token de redefinição (1h).
- `POST /autenticacao/redefinir-senha` — Valida token, atualiza `senha_hash` e invalida tokens antigos.
- `GET /autenticacao/eu` — Protegido por `GuardaAutenticacao`, retorna `{ id, nome, email, telefone, role }`.

## 3. Arquitetura no Frontend (`aplicativo/src/modules/autenticacao/`)
- **Cliente HTTP (`aplicativo/src/lib/clienteHttp.ts`):** Instância Axios configurada com `withCredentials: true` e interceptor de renovação automática.
- **Desacoplamento Visual:** Toda lógica de chamadas e cache (`useQuery(['usuario-atual'])`) fica isolada em `aplicativo/src/modules/autenticacao/hooks/usarAutenticacao.ts` e `aplicativo/src/modules/autenticacao/servicos/autenticacaoServico.ts`.
- **Telas Provisórias (Wireframe):** Criar componentes mínimos em `aplicativo/src/modules/autenticacao/paginas/` (`PaginaLogin.tsx`, `PaginaCadastro.tsx`, `PaginaVerificarEmail.tsx`, `PaginaRecuperarSenha.tsx`) preparados para substituição direta pelo layout final do designer.

## 4. Compatibilidade com os Schemas Existentes
Os schemas de domínio já existentes usam chaves `serial` e referências `integer` para `usuarios.id` em organizações, agendamentos e relatórios. A autenticação mantém esse tipo para preservar a compatibilidade das relações existentes; migrar a chave para UUID exige alterar conjuntamente essas referências e não faz parte desta feature.