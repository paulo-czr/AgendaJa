# Especificação 001: Autenticação e Gestão de Conta 

## 1. Visão Geral
Implementar o fluxo completo de cadastro, verificação de e-mail, login, renovação de sessão via cookies HTTP-only, recuperação de senha e controle de acesso por papel (`cliente` ou `prestador`) no **AgendaJá**.

## 2. Requisitos Funcionais
- **RF01 — Cadastro de Usuário:** Permitir cadastro informando `nome`, `email`, `senha`, `telefone` e `role` (`cliente` ou `prestador`). A conta inicia com `email_verificado = false`.
- **RF02 — Verificação de E-mail:** Ao cadastrar, gerar um token único com expiração de **24 horas** e enviar link por e-mail. O usuário só pode realizar login após verificar o e-mail (ou pode solicitar reenvio do link).
- **RF03 — Login e Sessão (HTTP-Only Cookies):** Validar credenciais e emitir dois cookies HTTP-only (`token_acesso` válido por 15min e `token_atualizacao` válido por 7 dias). Nunca retornar tokens no corpo JSON para armazenamento em `localStorage`.
- **RF04 — Renovação de Token e Logout:** Endpoint para renovar o `token_acesso` usando o `token_atualizacao` e endpoint de logout que limpa ambos os cookies.
- **RF05 — Recuperação e Redefinição de Senha:** Solicitação via e-mail gerando token temporário válido por **1 hora** para definir nova senha.
- **RF06 — Perfil Atual (`/autenticacao/eu`):** Endpoint protegido que retorna os dados do usuário autenticado (sem `senha_hash`) para hidratar o estado no `aplicativo`.

## 3. Critérios de Aceite
- Senhas armazenadas exclusivamente com hash seguro (`argon2` ou `bcrypt`).
- Tentativa de login com e-mail não verificado retorna HTTP `403 Forbidden` com mensagem clara.
- Todos os payloads validados com `nestjs-zod`.
- As migrations deve ser somente geradas, o desenvolvedor que deve aplicá-las
- Código 100% em português conforme Constituição.