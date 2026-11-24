# Tarefas 002: Organizações e Configurações de Agenda

## Fase 0: Validação da Especificação
- [ ] T00: Revisar e aprovar com o time os "Pontos em Aberto" da `spec.md` e ajustar este plano antes de iniciar a implementação.

## Fase 1: Banco de Dados
- [ ] T01: Adicionar `telefone`, `duracao_padrao_minutos` e índice único de `id_usuario` em `servidor/src/database/schemas/organizacoes.schema.ts`.
- [ ] T02: Adicionar `inicio_pausa`, `fim_pausa` e índice único (`id_organizacao`, `dia_semana`) em `servidor/src/database/schemas/configuracoes-agenda.schema.ts`.
- [ ] T03: Gerar a migration em `servidor/drizzle/` com `drizzle-kit generate` (sem aplicar).

## Fase 2: Backend — Módulo de Organizações
- [ ] T04: Criar DTOs com `nestjs-zod` em `servidor/src/modules/organizacoes/dtos/` (`criar-organizacao.dto.ts`, `atualizar-organizacao.dto.ts`, `respostas.dto.ts`).
- [ ] T05: Implementar `OrganizacoesServico`, `OrganizacoesControlador` e `OrganizacoesModule` com `POST /organizacoes`, `GET /organizacoes/minha` e `PATCH /organizacoes/minha`, protegidos por `GuardaAutenticacao` e `GuardaPapeis` (`prestador`). A criação gera a grade semanal padrão.
- [ ] T06: Registrar o `OrganizacoesModule` em `servidor/src/app.module.ts`.

## Fase 3: Backend — Módulo de Configurações de Agenda
- [ ] T07: Criar DTOs em `servidor/src/modules/configuracoes-agenda/dtos/` (`salvar-grade.dto.ts` com validação de `HH:MM`, abertura/encerramento e pausa; `criar-bloqueio.dto.ts`; `respostas.dto.ts`).
- [ ] T08: Implementar `ConfiguracoesAgendaServico`, `ConfiguracoesAgendaControlador` e `ConfiguracoesAgendaModule` com `GET`/`PUT /configuracoes-agenda` (substituição transacional dos 7 dias) e `GET`/`POST`/`DELETE /configuracoes-agenda/bloqueios`.
- [ ] T09: Registrar o `ConfiguracoesAgendaModule` em `servidor/src/app.module.ts`.

## Fase 4: Testes Unitários Críticos (Jest)
- [ ] T10: Criar `servidor/src/modules/configuracoes-agenda/configuracoes-agenda.service.spec.ts` cobrindo: rejeição de abertura ≥ encerramento, rejeição de pausa fora do expediente, bloqueio com fim anterior ao início e tentativa de remover bloqueio de outra organização.
- [ ] T11: Criar `servidor/src/modules/organizacoes/organizacoes.service.spec.ts` cobrindo: documento duplicado (`409`), segunda organização para o mesmo prestador (`409`) e criação da grade padrão.

## Fase 5: Frontend — Layout, Camada Lógica e Tela
- [ ] T12: Mover `aplicativo/src/componentes/Logo.tsx` para `aplicativo/src/components/` (Constituição, Art. 2.2) e atualizar os imports.
- [ ] T13: Criar o layout do painel do prestador em `aplicativo/src/components/` (menu lateral, cabeçalho, título da página e navegação inferior mobile) conforme o Figma.
- [ ] T14: Implementar `organizacoesServico.ts`, `configuracoesAgendaServico.ts`, `usarOrganizacao.ts` e `usarConfiguracoesAgenda.ts` em `aplicativo/src/modules/organizacoes/`.
- [ ] T15: Criar `PaginaConfiguracoes.tsx` e seus cartões em `aplicativo/src/modules/organizacoes/`, fiéis ao Figma (desktop e mobile), e registrar a rota protegida `/configuracoes`.
- [ ] T16: Implementar o redirecionamento do prestador sem organização para `/configuracoes` (RF07).
