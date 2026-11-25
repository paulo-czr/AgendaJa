# Tarefas 004.1: Home Page da Empresa

## Fase 1: Backend — Endpoint de Resumo Operacional

- [x] T01: Implementar `obterResumoEmpresa(idUsuario: string)` no `OrganizacoesService` consultando organização, contagem de serviços ativos, contagem de categorias e status da configuração de agenda.
- [x] T02: Expor rota `GET /organizacoes/minha/resumo` no `OrganizacoesController` protegida para `prestador`.

## Fase 2: Frontend — Dashboard Inicial da Empresa

- [x] T03: Criar `resumoEmpresa.service.ts` e `usarResumoEmpresa.ts` com TanStack Query.
- [x] T04: Construir `PaginaHomeEmpresa.tsx` aplicando as skills de `.agents/`, tokens de cores do sistema, componente `Botao` e interações do React Bits (`https://reactbits.dev`).
- [x] T05: Conectar a rota `/empresa` no roteador protegido e garantir que o login de um `prestador` redirecione para ela.
