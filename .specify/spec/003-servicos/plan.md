# Plano Técnico 003: Catálogo de Serviços e Vitrine Pública

## 1. Modelagem de Banco de Dados (Drizzle ORM + Supabase)

Arquivo: `servidor/src/database/schemas/servicos.ts`

### Tabela `servicos`

- `id`: `uuid` (PK, defaultRandom)
- `id_organizacao`: `uuid` (FK -> `organizacoes.id`, notNull, onDelete: `'cascade'`)
- `nome_servico`: `varchar(120)` (notNull)
- `descricao_servico`: `varchar(500)` (nullable)
- `categoria`: `varchar(60)` (nullable)
- `preco_centavos`: `integer` (notNull)
- `duracao_minutos`: `integer` (notNull)
- `ativo`: `boolean` (notNull, default `true`)
- `criado_em`: `timestamp` (defaultNow, notNull)
- `atualizado_em`: `timestamp` (defaultNow, notNull)
- `desativado_em`: `timestamp` (nullable)

## 2. Endpoints da API (`servidor/src/modules/servicos/`)

### Rotas Privadas (Exigem `GuardaAutenticacaoGuard` + `GuardaPapeisGuard('prestador')`)

- `POST /servicos` — Cria um serviço vinculado à organização do prestador autenticado.
- `GET /servicos/meus` — Lista todos os serviços (ativos e inativos) da organização do prestador.
- `PATCH /servicos/:id` — Atualiza dados ou reativa (`ativo: true`) um serviço pertencente à organização do prestador.
- `DELETE /servicos/:id` — Executa exclusão lógica (`ativo = false`, `desativado_em = new Date()`) validando propriedade da organização.

### Rota Pública (Sem Guard de Autenticação)

- `GET /vitrine/:idOrganizacao` — Retorna perfil público da organização e a lista de seus serviços com `ativo = true` ordenados por categoria e nome.

## 3. Arquitetura no Frontend (`aplicativo/src/modules/`)

- **Painel do Prestador (`aplicativo/src/modules/servicos/`):**
  - `servicos/services/servicos.service.ts` e `servicos/hooks/usarServicos.ts` (TanStack Query com invalidação da query `['meus-servicos']`).
  - Tela de gerenciamento com formulário de criação/edição, toggle/botão de desativação lógica e botão **"Copiar link da vitrine"** (`/vitrine/:idOrganizacao`).
- **Vitrine Pública (`aplicativo/src/modules/vitrine/`):**
  - Rota pública `/vitrine/:idOrganizacao` (`PaginaVitrinePublica.tsx`): landing page limpa e responsiva exibindo cabeçalho da empresa, lista/cards de serviços ativos (nome, descrição, duração formatada, preço em `R$`) e botão de ação _"Agendar horário"_ (que redirecionará para o fluxo do módulo `004-agendamentos`).
