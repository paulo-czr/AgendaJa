# Tarefas 001: Autenticação

## Fase 1: Dependências e Conexão Supabase
- [x] T01: Instalar dependências no workspace `servidor` (`cookie-parser`, `@types/cookie-parser`, `@nestjs/jwt`, `bcrypt`, `@types/bcrypt`, `resend`, `drizzle-orm`, `pg`, `@types/pg`, `drizzle-kit`, `nestjs-zod`, `zod`).
- [x] T02: Instalar dependências no workspace `aplicativo` (`@tanstack/react-query`, `axios`, `react-router-dom`).
- [x] T03: Validar variáveis de ambiente em `servidor/src/config/` com Zod (`DATABASE_URL`, `JWT_SEGREDO`, `JWT_REFRESH_SEGREDO`, `RESEND_API_KEY`, `RESEND_REMETENTE`, `URL_APLICATIVO`).
- [x] T04: Configurar conexão Drizzle em `servidor/src/database/`, criar schemas `usuarios` e `tokens_autenticacao` em `servidor/src/database/schemas/` e gerar migration em `servidor/drizzle/`.

## Fase 2: Backend — Módulo de Autenticação e Resend
- [x] T05: Criar serviço de e-mail em `servidor/src/common/servicos/email.service.ts` utilizando o SDK `resend`.
- [x] T06: Criar DTOs com `nestjs-zod` em `servidor/src/modules/autenticacao/dtos/` (`cadastrar.dto.ts`, `entrar.dto.ts`, `verificar-email.dto.ts`, `recuperar-senha.dto.ts`).
- [x] T07: Implementar `AutenticacaoServico` e `AutenticacaoControlador` em `servidor/src/modules/autenticacao/` com gravação segura de cookies HTTP-only (`httpOnly: true`, `sameSite: 'lax'`).
- [x] T08: Implementar `GuardaAutenticacao` (leitura do cookie `token_acesso`), `GuardaPapeis` e decorator `@UsuarioAtual()` em `servidor/src/common/`.

## Fase 3: Testes Unitários Críticos (Jest)
- [x] T09: Criar `servidor/src/modules/autenticacao/autenticacao.service.spec.ts` cobrindo: cadastro com e-mail duplicado, bloqueio de login com e-mail não verificado (`403`), login válido e expiração de token de recuperação de senha.

## Fase 4: Frontend — Camada Lógica + Telas Provisórias
- [x] T10: Configurar `aplicativo/src/lib/clienteHttp.ts` (`withCredentials: true` e interceptor para `/autenticacao/renovar`) e `QueryClientProvider` em `aplicativo/src/app/`.
- [x] T11: Implementar `autenticacaoServico.ts`, hook `usarAutenticacao.ts` e `RotaProtegida.tsx` em `aplicativo/src/modules/autenticacao/`.
- [x] T12: Criar páginas provisórias em `aplicativo/src/modules/autenticacao/paginas/` (estruturas funcionais mínimas prontas para substituição pelo design final).