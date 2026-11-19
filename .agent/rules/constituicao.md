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
- `servidor/`: API RESTful construída em **NestJS**, **Drizzle ORM** e **PostgreSQL**.
- `aplicativo/`: Aplicação Web SPA construída em **React**, **Tailwind CSS** e **TanStack Query**.
2.2. **Simetria Modular:** Ambos os projetos devem adotar arquitetura modular orientada a domínios (`autenticacao`, `usuarios`, `organizacoes`, `servicos`, `agendamentos`, `configuracoes-agenda`, `relatorios`).
2.3. **Isolamento de Camadas:** O `aplicativo` nunca se comunica diretamente com o banco de dados; toda regra de negócio crítica e validação de disponibilidade reside no `servidor`.

---

## Artigo III — Padrões de Código e Idioma (100% Português)
3.1. **Idioma Único no Domínio e Código:** Todo o código autoral — incluindo nomes de arquivos, pastas, classes, métodos, variáveis, DTOs, schemas Zod, tabelas, colunas do PostgreSQL, rotas HTTP e mensagens de erro — deve ser escrito estritamente em **português** (sem acentuação em identificadores de código e banco, ex: `agendamentos`, `organizacoes`, `duracao_minutos`, `buscarDisponibilidade()`).
3.2. *Exceção:* Palavras-chave reservadas das linguagens/frameworks (`import`, `export`, `class`, `async`, `await`, hooks nativos do React e decorators do NestJS).
3.3. **Tipagem Estrita:** O uso de `any` é proibido em todo o repositório (`strict: true` no `tsconfig.json`).

---

## Artigo IV — Contratos, Validação e Persistência
4.1. **Validação com Zod (`nestjs-zod`):** Todos os payloads de entrada (Body, Query, Params) e contratos de resposta no `servidor` devem ser validados via schemas **Zod** integrados ao NestJS através do `nestjs-zod`.
4.2. **Persistência com Drizzle ORM:** Toda alteração estrutural no PostgreSQL deve ser declarada nos schemas do Drizzle (`servidor/src/banco-dados/schemas/`) e versionada via migrations geradas pelo `drizzle-kit`. Queries SQL puras só são permitidas mediante justificativa técnica documentada no `plan.md`.

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

## Artigo VII — Frontend e Gerenciamento de Estado
7.1. **Estado Assíncrono:** Todas as requisições, caches, invalidações e mutações de dados no `aplicativo` devem ser gerenciadas pelo **TanStack Query** (`useQuery`, `useMutation`), evitando estados globais manuais duplicados para dados vindos da API.
7.2. **Estilização:** Toda interface deve ser construída com **Tailwind CSS**, mantendo componentes base reutilizáveis e responsivos.

---

## Artigo VIII — Qualidade, Testes e Versionamento
8.1. **Testes Pragmáticos com Jest:** Testes unitários no `servidor` (usando **Jest**) devem focar **exclusivamente nas funcionalidades críticas de negócio** (cálculo de disponibilidade, conflito de capacidade simultânea, regra de antecedência de 2 horas, autenticação e permissões). É proibido criar testes triviais (ex: testar getters/setters ou mocks vazios).
8.2. **Reaproveitamento de Testes:** Ao alterar uma regra de negócio existente, o desenvolvedor ou agente deve **atualizar ou reutilizar a suíte de testes já existente** que cobre aquele fluxo, evitando duplicação de arquivos `.spec.ts`.
8.3. **Conventional Commits:** Todo commit deve seguir estritamente a especificação **Conventional Commits** com escopo opcional em português:
- `feat(agendamentos): adiciona validacao de antecedencia minima de 2 horas`
- `fix(autenticacao): corrige expiracao do cookie http-only`
- `test(agendamentos): atualiza cenario de atendimentos simultaneos`
- `docs(spec): define especificacao do modulo de relatorios`