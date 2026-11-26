# Constituição do Projeto: AgendaJá

**Versão:** 1.0.0  
**Autores:** Isaac e Paulo Cesar  
**Paradigma:** Spec-Driven Development (SDD)  
**Orquestração de IA:** Antigravity (Agentes Especializados)

---

## Artigo I — Propósito e Identidade do Sistema

1.1. O **AgendaJá** é uma plataforma multi-nicho de agendamento de serviços que conecta clientes a organizações prestadoras (lava-jatos, barbearias, clínicas de estética, limpeza de estofados, entre outros).  
1.2. Nenhuma funcionalidade deve ser implementada diretamente em código sem antes possuir uma especificação aprovada em `.specify/specs/NNN-nome-da-feature/` (`spec.md`, `plan.md` e `tasks.md`).

---

## Artigo II — Arquitetura e Organização do Monorepo

2.1. O repositório é estruturado como um monorepo contendo obrigatoriamente duas aplicações isoladas na raiz:

- `servidor/`: API RESTful construída em **NestJS**, **Drizzle ORM** e **PostgreSQL (Supabase)**.
- `aplicativo/`: Aplicação Web SPA construída em **React**, **Tailwind CSS** e **TanStack Query**.
  2.2. **Estrutura de Diretórios Preserva-Base:** Os diretórios estruturais raiz já criados (`servidor/src/common`, `servidor/src/config`, `servidor/src/database`, `servidor/src/modules` e `aplicativo/src/app`, `aplicativo/src/components`, `aplicativo/src/lib`, `aplicativo/src/modules`, `aplicativo/src/types`) devem ser mantidos exatamente com esses nomes.
  2.3. **Simetria Modular:** Dentro de `modules/`, ambos os projetos devem adotar arquitetura modular orientada a domínios em português (`autenticacao`, `usuarios`, `organizacoes`, `servicos`, `agendamentos`, `configuracoes-agenda`, `relatorios`).

---

## Artigo III — Padrões de Código e Idioma (100% Português com Sufixos NestJS)

3.1. **Idioma Único no Domínio e Código:** Com exceção das pastas estruturais já existentes (`common`, `config`, `database`, `modules`, `app`, `components`, `lib`, `types`) e palavras-chave reservadas das linguagens/frameworks, todo o código autoral — incluindo nomes de domínios, classes, métodos, variáveis, schemas Zod, tabelas, colunas do PostgreSQL, rotas HTTP e mensagens de erro — deve ser escrito estritamente em **português** (sem acentuação em identificadores de código e banco, ex: `agendamentos`, `organizacoes`, `duracao_minutos`, `buscarDisponibilidade()`).
3.2. **Convenção de Nomenclatura de Arquivos (NestJS e React):**

- No `servidor/` (NestJS), o nome do arquivo deve manter o **domínio em português**, mas utilizar obrigatoriamente os **sufixos estruturais padrão do NestJS em inglês**:
  - `.service.ts` (ex: `autenticacao.service.ts`, `email.service.ts`)
  - `.controller.ts` (ex: `autenticacao.controller.ts`)
  - `.module.ts` (ex: `autenticacao.module.ts`)
  - `.dto.ts` (ex: `cadastrar.dto.ts`, `entrar.dto.ts`)
  - `.entity.ts` (quando aplicável)
  - `.guard.ts`, `.decorator.ts`, `.filter.ts`, `.interceptor.ts`, `.pipe.ts`
  - `.spec.ts` (ex: `autenticacao.service.spec.ts`)
- Da mesma forma, os sufixos das classes no NestJS devem acompanhar o padrão idiomático (ex: `AutenticacaoService`, `AutenticacaoController`, `AutenticacaoModule`, `GuardaAutenticacaoGuard`), mantendo métodos, propriedades e regras de negócio em português.
  3.3. **Tipagem Estrita:** O uso de `any` é proibido em todo o repositório (`strict: true` no `tsconfig.json`).

---

## Artigo IV — Contratos, Validação, Persistência e E-mail

4.1. **Validação com Zod (`nestjs-zod`):** Todos os payloads de entrada (Body, Query, Params) e contratos de resposta no `servidor` devem ser validados via schemas **Zod** integrados ao NestJS através do `nestjs-zod`.
4.2. **Persistência com Drizzle ORM (Supabase):** Toda alteração estrutural no PostgreSQL deve ser declarada nos schemas do Drizzle (`servidor/src/database/schemas/`) e versionada via migrations geradas pelo `drizzle-kit` em `servidor/drizzle/`.
4.3. **Disparo de E-mails (Nodemailer):** Todos os e-mails transacionais (verificação de conta e recuperação de senha) devem utilizar o **Nodemailer** via SMTP configurado por variáveis de ambiente (`SMTP_HOST`, `SMTP_PORTA`, `SMTP_SEGURO`, `SMTP_USUARIO`, `SMTP_SENHA` e `SMTP_REMETENTE`).

---

## Artigo V — Regras de Negócio Inegociáveis

5.1. **Antecedência Mínima (Regra das 2 Horas):** Clientes só podem criar ou cancelar agendamentos com antecedência mínima de **120 minutos (2 horas)** em relação ao `data_hora_inicio`. O `servidor` deve rejeitar requisições fora dessa janela com status HTTP `422 Unprocessable Entity` ou `400 Bad Request`.
5.2. **Atendimentos Múltiplos Simultâneos:** Uma organização pode suportar múltiplos atendimentos simultâneos conforme a sua capacidade configurada (`capacidade_simultanea >= 1`). Um horário só é considerado indisponível quando o número de agendamentos ativos (`pendente` ou `confirmado`) sobrepostos atingir o limite da capacidade da organização.
5.3. **Configurações de Agenda por Organização:** Toda organização deve possuir uma aba/módulo de configurações onde define quais dias da semana aceita agendamentos, horários de funcionamento (abertura/fechamento) e bloqueios pontuais de datas. Agendamentos em dias desabilitados devem ser bloqueados no backend.
5.4. **Relatórios Pós-Atendimento:** A entidade `relatorios` destina-se exclusivamente ao registro técnico do serviço executado (laudo, observações e descrição do atendimento realizado), vinculando cliente, serviço e prestador responsável.

---

## Artigo VI — Segurança e Autenticação

6.1. **Sessão via HTTP-Only Cookies:** A autenticação deve utilizar **JWT** trafegado exclusivamente via **HTTP-Only Cookies** (`Secure`, `SameSite`), sendo proibido armazenar tokens de acesso no `localStorage` ou `sessionStorage`.
6.2. **Fluxos Obrigatórios de Conta:** O módulo de autenticação deve contemplar:

- Cadastro com envio de token/código para **verificação de e-mail**.
- Fluxo completo de **recuperação e redefinição de senha** via token temporário com expiração.
- Controle de acesso baseado em papel (`role`: `cliente` ou `prestador`) via Guards do NestJS.

---

## Artigo VII — Frontend, Design System e Gerenciamento de Estado

### 7.1 Estado assíncrono

7.1.1. Todas as requisições, caches, invalidações e mutações de dados no `aplicativo/` devem ser gerenciadas pelo **TanStack Query** (`useQuery`, `useMutation`), evitando estados globais manuais duplicados para dados vindos da API.

### 7.2 Fonte da verdade do design

7.2.1. O documento `.specify/memory/design-system.md` é a referência única de tokens, espaçamentos, tipografia, durações de animação e padrões de tela. Em conflito com qualquer outra fonte, ele prevalece.

7.2.2. Antes de criar ou alterar QUALQUER componente ou página em `aplicativo/`, o agente deve, nesta ordem:
(a) ler `.specify/memory/design-system.md`;
(b) ler o `SKILL.md` de cada skill aplicável conforme a tabela 7.2.3;
(c) registrar o que usou no `plan.md`.

7.2.3. Mapa obrigatório de skills (consultar nomes exatos em `.agents/`):

| Quando a tarefa envolve...               | Skill obrigatória       |
| ---------------------------------------- | ----------------------- |
| Nova página, layout ou identidade visual | `frontend-design`       |
| Formulários, tabelas, modais, feedback   | `web-design-guidelines` |
| Animações, transições, microinterações   | `motion-design`         |
| Acessibilidade ou responsividade         | `web-design-guidelines` |

7.2.4. Ao concluir a tarefa, deve-se adicionar no `plan.md` as skills consultadas.

### 7.3 Hierarquia de componentes (decidir sempre nesta ordem)

1. **Componente existente** em `aplicativo/src/components/ui/` ou `aplicativo/src/components/`.
2. **shadcn/ui** (Radix + Tailwind): base para primitivos: botão, input, select, dialog, sheet, dropdown, tabs, tooltip, calendar, table, form, toast (Sonner), skeleton, badge.
3. **React Bits** (`https://reactbits.dev`): exclusivamente para destaque visual: hero, landing, cards interativos (`SpotlightCard`), listas animadas (`AnimatedList`), rolagem (`ScrollStack`), efeitos de texto. É proibido usar em telas operacionais densas (formulários, tabelas).
4. **Componente próprio**: permitido apenas se 1–3 não atenderem, mediante justificativa técnica registrada no `plan.md`.
   7.3.1. Ícones: apenas `lucide-react`. Utilitários de classe: `cn()` (`clsx` + `tailwind-merge`); variantes via `class-variance-authority` (`cva`).
   7.3.2. Formulários: `react-hook-form` + `zod` (reaproveitando os schemas do servidor sempre que possível). Tabelas: TanStack Table. Gráficos (relatórios): shadcn Charts (Recharts). Datas e agenda: `react-day-picker` (shadcn Calendar) + `date-fns` com locale `pt-BR`.
   7.3.3. Componentes gerados por bibliotecas (shadcn) mantêm o nome de arquivo original em inglês (ex: `button.tsx`, `skeleton.tsx`, `sonner.tsx`). Isso é exceção expressa ao Artigo 3.1. Componentes autorais de domínio (ex: `CartaoAgendamento.tsx`, `SeletorHorario.tsx`, `CartaoOrganizacao.tsx`) seguem rigorosamente o português.
   7.3.4. Não instalar nova biblioteca de UI sem emenda prévia a esta Constituição.

### 7.4 Tokens e estilo

7.4.1. Usar apenas tokens de cor e tipografia do tema Tailwind / CSS variables definidos no `design-system.md`. É proibido usar hex, rgb ou valores arbitrários (`bg-[#123456]`, `w-[317px]`) em componentes.
7.4.2. Mobile-first: toda tela deve funcionar perfeitamente em `360px` antes de ser refinada para desktop.
7.4.3. Suporte a modo escuro somente se explicitamente definido no `design-system.md`.

### 7.5 Movimento e transições

7.5.1. Biblioteca padrão de animação: `motion` (Framer Motion). CSS/Tailwind (`transition-*`) para hover e foco simples.
7.5.2. Toda interface deve ter movimento intencional em: entrada de página, abertura e fechamento de modal/sheet/dropdown, entrada de itens em listas, troca de abas, hover/foco/pressionado em elementos interativos e mudanças de estado (`loading` → conteúdo).
7.5.3. Durações e easings vêm dos tokens do `design-system.md` (referência: `150–250ms` para microinterações, até `400ms` para entradas de página). Nada de animações decorativas longas em fluxos de trabalho.
7.5.4. Respeitar `prefers-reduced-motion`: todo movimento não essencial deve ser desligado.
7.5.5. Animar apenas `transform` e `opacity`, nunca `width`, `height` ou `top` (performance).

### 7.6 Estados obrigatórios de interface

Toda tela ou componente que consome dados deve implementar explicitamente:

- **Carregamento:** `Skeleton` (nunca spinner solto na página);
- **Vazio:** mensagem clara em pt-BR + ação sugerida;
- **Erro:** mensagem amigável em pt-BR + botão "Tentar novamente";
- **Sucesso:** toast via **Sonner**.
  Botões de mutação devem exibir estado `pending` (`carregando`) e ficar desabilitados durante o envio.

### 7.7 Acessibilidade e idioma da interface

Contraste mínimo WCAG AA, navegação por teclado, foco visível, `label` associado em todo input, `aria-*` quando o componente Radix não cobrir. Todo texto exibido ao usuário deve estar em `pt-BR`.

### 7.8 Definição de Pronto (DoD) para UI

Uma tarefa visual só pode ser marcada como concluída quando cumprir todos os critérios:

- [ ] Skills consultadas e registradas no `plan.md`;
- [ ] Hierarquia de componentes (7.3) respeitada;
- [ ] Apenas tokens do tema utilizados (7.4);
- [ ] Transições aplicadas respeitando `prefers-reduced-motion` (7.5);
- [ ] Estados loading (`Skeleton`), vazio, erro e sucesso (`Sonner`) implementados (7.6);
- [ ] Testada responsivamente em `360px` e desktop;
- [ ] Zero uso de `any`.

---

## Artigo VIII — Qualidade, Testes e Versionamento

8.1. **Testes Pragmáticos com Jest:** Testes unitários no `servidor` (usando **Jest**) devem focar **exclusivamente nas funcionalidades críticas de negócio** (cálculo de disponibilidade, conflito de capacidade simultânea, regra de antecedência de 2 horas, autenticação e permissões). É proibido criar testes triviais (ex: testar getters/setters ou mocks vazios).
8.2. **Reaproveitamento de Testes:** Ao alterar uma regra de negócio existente, o desenvolvedor ou agente deve **atualizar ou reutilizar a suíte de testes já existente** que cobre aquele fluxo, evitando duplicação de arquivos `.spec.ts`.
8.3. **Conventional Commits:** Todo commit deve seguir estritamente a especificação **Conventional Commits** com escopo opcional em português:

- `feat(agendamentos): adiciona validacao de antecedencia minima de 2 horas`
- `fix(autenticacao): corrige expiracao do cookie http-only`
- `test(agendamentos): atualiza cenario de atendimentos simultaneos`
- `docs(spec): define especificacao do modulo de relatorios`
