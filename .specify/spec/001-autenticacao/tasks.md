# Tarefas 001: Autenticação

## Fase 1: Dependências e Conexão Supabase
- [ ] T01: Instalar dependências no workspace `servidor` (`cookie-parser`, `@types/cookie-parser`, `@nestjs/jwt`, `bcrypt`, `@types/bcrypt`, `resend`, `drizzle-orm`, `pg`, `@types/pg`, `drizzle-kit`, `nestjs-zod`, `zod`).
- [ ] T02: Instalar dependências no workspace `aplicativo` (`@tanstack/react-query`, `axios`, `react-router-dom`).
- [ ] T03: Validar variáveis de ambiente em `servidor/src/config/` com Zod (`DATABASE_URL`, `JWT_SEGREDO`, `JWT_REFRESH_SEGREDO`, `RESEND_API_KEY`, `RESEND_REMETENTE`, `URL_APLICATIVO`).
- [ ] T04: Configurar conexão Drizzle em `servidor/src/database/`, criar schemas `usuarios` e `tokens_autenticacao` em `servidor/src/database/schemas/` e gerar migration em `servidor/drizzle/`.

## Fase 2: Backend — Módulo de Autenticação e Resend
- [ ] T05: Criar serviço de e-mail em `servidor/src/common/servicos/email.servico.ts` utilizando o SDK `resend`.
- [ ] T06: Criar DTOs com `nestjs-zod` em `servidor/src/modules/autenticacao/dtos/` (`cadastrar.dto.ts`, `entrar.dto.ts`, `verificar-email.dto.ts`, `recuperar-senha.dto.ts`).
- [ ] T07: Implementar `AutenticacaoServico` e `AutenticacaoControlador` em `servidor/src/modules/autenticacao/` com gravação segura de cookies HTTP-only (`httpOnly: true`, `sameSite: 'lax'`).
- [ ] T08: Implementar `GuardaAutenticacao` (leitura do cookie `token_acesso`), `GuardaPapeis` e decorator `@UsuarioAtual()` em `servidor/src/common/`.

## Fase 3: Testes Unitários Críticos (Jest)
- [ ] T09: Criar `servidor/src/modules/autenticacao/autenticacao.servico.spec.ts` cobrindo: cadastro com e-mail duplicado, bloqueio de login com e-mail não verificado (`403`), login válido e expiração de token de recuperação de senha.

## Fase 4: Frontend — Camada Lógica + Telas Provisórias
- [ ] T10: Configurar `aplicativo/src/lib/clienteHttp.ts` (`withCredentials: true` e interceptor para `/autenticacao/renovar`) e `QueryClientProvider` em `aplicativo/src/app/`.
- [ ] T11: Implementar `autenticacaoServico.ts`, hook `usarAutenticacao.ts` e `RotaProtegida.tsx` em `aplicativo/src/modules/autenticacao/`.
- [ ] T12: Criar páginas provisórias em `aplicativo/src/modules/autenticacao/paginas/` (estruturas funcionais mínimas prontas para substituição pelo design final).