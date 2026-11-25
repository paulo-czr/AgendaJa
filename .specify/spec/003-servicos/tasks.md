# Tarefas 003: Catálogo de Serviços e Vitrine Pública

## Fase 1: Banco de Dados e Contratos Zod

- [x] T01: Criar schema `servicos` em `servidor/src/database/schemas/servicos.ts` (incluindo export no índice de schemas) e gerar/aplicar migration via `drizzle-kit`.
- [x] T02: Criar DTOs com `nestjs-zod` em `servidor/src/modules/servicos/dtos/` (`criar-servico.dto.ts`, `atualizar-servico.dto.ts`) garantindo `duracao_minutos` inteiro >= 1 e `preco_centavos` inteiro >= 0.

## Fase 2: Backend — Módulo de Serviços e Vitrine

- [x] T03: Implementar `ServicosService` (`servidor/src/modules/servicos/servicos.service.ts`) resolvendo a organização pelo `id_usuario` autenticado, validando posse antes de editar/desativar, executando exclusão lógica e expondo consulta pública de serviços ativos.
- [x] T04: Implementar `ServicosController` (`servidor/src/modules/servicos/servicos.controller.ts`) e `ServicosModule` (`servicos.module.ts`) registrando-o no `AppModule`.

## Fase 3: Testes Unitários Críticos (Jest)

- [x] T05: Criar `servidor/src/modules/servicos/servicos.service.spec.ts` cobrindo: criação vinculada exclusivamente à organização do prestador, bloqueio de edição/exclusão por prestador de outra empresa, exclusão lógica (`ativo = false`) e filtro de apenas ativos na vitrine pública.

## Fase 4: Frontend — Gerenciamento e Landing Page Pública

- [x] T06: Criar `servicos.service.ts` e `usarServicos.ts` com TanStack Query em `aplicativo/src/modules/servicos/`.
- [x] T07: Criar interface de gestão de serviços no painel do prestador (criação, edição, desativação lógica e botão de copiar link compartilhável).
- [x] T08: Criar a rota pública `/vitrine/:idOrganizacao` (`PaginaVitrinePublica.tsx` em `aplicativo/src/modules/vitrine/`) apresentando a landing page simples com os serviços ativos da empresa.
