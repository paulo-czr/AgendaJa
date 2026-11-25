# Plano Técnico 003.1: Categorias de Serviços

## 1. Banco de Dados (Drizzle ORM + Supabase)

- **Nova Tabela `categorias_servicos` (`servidor/src/database/schemas/categorias-servicos.ts`):**
  - `id`: `uuid` (PK, defaultRandom)
  - `id_organizacao`: `uuid` (FK -> `organizacoes.id`, notNull, onDelete: `'cascade'`)
  - `nome`: `varchar(60)` (notNull)
  - `criado_em`: `timestamp` (defaultNow, notNull)
  - _Constraint:_ Índice único composto `(id_organizacao, nome)`.
- **Alteração na Tabela `servicos` (`servidor/src/database/schemas/servicos.ts`):**
  - Adicionar coluna `id_categoria`: `uuid` (FK -> `categorias_servicos.id`, nullable, onDelete: `'set null'`).
  - Se existia alguma coluna textual antiga de categoria, migrar ou remover na migration do Drizzle.

## 2. Backend (`servidor/src/modules/servicos/`)

- **DTOs (`nestjs-zod`):**
  - `criar-categoria.dto.ts`: `{ nome: z.string().trim().min(2).max(60) }`
  - `atualizar-categoria.dto.ts`: `{ nome: z.string().trim().min(2).max(60) }`
  - Atualizar `criar-servico.dto.ts` e `atualizar-servico.dto.ts` para aceitar `id_categoria: z.string().uuid().nullable().optional()`.
- **Endpoints (Registrar ANTES de `:id` no Controller para evitar conflito de rota):**
  - `POST /servicos/categorias`
  - `GET /servicos/categorias`
  - `PATCH /servicos/categorias/:id`
  - `DELETE /servicos/categorias/:id`
- **Atualização da Vitrine:** Na consulta pública de serviços da organização, incluir `leftJoin` com `categorias_servicos` para expor `categoria: { id, nome } | null`.

## 3. Frontend (`aplicativo/src/modules/`)

- **Configurações (`aplicativo/src/modules/organizacao/` ou `configuracoes/`):**
  - Adicionar item **"Categorias"** na navbar interna da página de Configurações.
  - Criar componente `AbaCategorias.tsx` com input para criar categoria, listagem com edição inline e botão de exclusão, usando hooks TanStack Query (`['categorias-servicos']`).
- **Formulário de Serviços (`aplicativo/src/modules/servicos/`):**
  - Adicionar campo `<select>` de Categoria consumindo `usarCategorias()` (com opção padrão _"Sem categoria"_).
- **Vitrine Pública (`aplicativo/src/modules/vitrine/`):**
  - Agrupar visualmente os cards de serviços ativos pelo nome da categoria retornada.
