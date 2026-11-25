# Tarefas 003.1: Categorias de Serviços

## Fase 1: Schema e Migration

- [x] T01: Criar `servidor/src/database/schemas/categorias-servicos.ts` com índice único `(id_organizacao, nome)` e adicionar `id_categoria` (`onDelete: 'set null'`) em `servidor/src/database/schemas/servicos.ts`. Gerar e aplicar migration no Supabase via `drizzle-kit`.

## Fase 2: Backend — Endpoints e Validação de Tenant

- [x] T02: Criar `criar-categoria.dto.ts` e `atualizar-categoria.dto.ts` com `nestjs-zod` e adicionar `id_categoria` opcional/nullable nos DTOs de serviço existentes.
- [x] T03: Implementar métodos de categorias no `ServicosService` (criar, listar, editar, excluir e validar duplicidade case-insensitive na mesma organização) e validar posse da categoria ao criar/editar serviço.
- [x] T04: Adicionar rotas `/servicos/categorias` (acima das rotas `:id`) no `ServicosController` e atualizar a query da vitrine pública com `leftJoin` em `categorias_servicos`.

## Fase 3: Testes Unitários (Jest)

- [x] T05: Atualizar `servicos.service.spec.ts` (reaproveitando a suíte existente conforme Constituição) adicionando cenários para: bloqueio de categoria duplicada na mesma organização e rejeição ao tentar vincular serviço a categoria de outra organização.

## Fase 4: Frontend — Navbar de Configurações, Formulário e Vitrine

- [x] T06: Implementar `categorias.service.ts` e `usarCategorias.ts` (TanStack Query com invalidação de cache).
- [x] T07: Adicionar a opção **"Categorias"** na navbar da tela de Configurações com o gerenciador completo de categorias.
- [x] T08: Integrar o `<select>` de categorias no formulário de criação/edição de serviços e agrupar os serviços por categoria na página pública da vitrine.
