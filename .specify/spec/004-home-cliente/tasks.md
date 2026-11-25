# Tarefas 004: Home Page do Cliente

## Fase 1: Backend — Endpoint de Listagem Pública

- [x] T01: Criar DTO de filtro (`buscar-organizacoes-publicas.dto.ts`) com `nestjs-zod` e método `listarPublicas(busca?: string)` no `OrganizacoesService` retornando dados públicos da organização e prévia dos serviços ativos.
- [x] T02: Expor rota pública `GET /organizacoes/publicas` no `OrganizacoesController` (antes de rotas `:id`).

## Fase 2: Frontend — React Bits (`ScrollStack`) e Hooks

- [x] T03: Inspecionar `.agents/` e tokens de cores do `aplicativo/`, e reutilizar o componente do ReactBits, presente em `https://reactbits.dev/components/scroll-stack`.
- [x] T04: Criar `vitrineGeral.service.ts` e `usarOrganizacoesPublicas.ts` utilizando TanStack Query.

## Fase 3: Frontend — Montagem da Home do Cliente

- [x] T05: Criar `HeroCliente.tsx`, `SecaoComoFuncionaScrollStack.tsx` e `CardOrganizacao.tsx` usando o componente `Botao` e ícones `lucide-react`.
- [x] T06: Integrar `PaginaHomeCliente.tsx` na rota `/` e configurar o redirecionamento inteligente caso o usuário logado seja `prestador`.
