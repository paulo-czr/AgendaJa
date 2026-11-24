---
name: conventional-commits
description: Analisa os arquivos modificados, adicionados ou removidos na árvore de alterações do Git (git status e git diff), agrupa mudanças em módulos e realiza commits seguindo o padrão Conventional Commits em português com aprovação obrigatória do usuário antes de cada commit. Use sempre que o usuário pedir para commitar, criar commits, organizar alterações no Git, subir mudanças ou preparar mensagens de commit.
---

# Conventional Commits com Aprovação Interativa

## Objetivo

Inspecionar a árvore de trabalho atual do Git, separar as alterações em commits atômicos e bem organizados, redigir mensagens no padrão estrito definido pelo projeto e solicitar aprovação explícita do usuário antes de executar cada `git commit`.

## Formato Obrigatório da Mensagem de Commit

Toda mensagem de commit deve seguir rigorosamente a estrutura:

```text
tipo(modulo): Descrição com inicial maiúscula e primeiro verbo no infinitivo
```

### Regras de Formatação

1. **`tipo` (em inglês, minúsculo):**
   - `feat`: Nova funcionalidade ou recurso.
   - `fix`: Correção de bug ou comportamento inesperado.
   - `refactor`: Refatoração de código sem alterar comportamento externo.
   - `chore`: Tarefas de manutenção, configurações, dependências ou build.
   - `docs`: Alterações apenas em documentação.
   - `style`: Formatação, espaços em branco, ponto e vírgula (sem mudança de lógica).
   - `test`: Adição ou ajuste de testes.
   - `perf`: Melhoria de desempenho.
2. **`(modulo)` (em português ou conforme pasta/domínio do projeto, minúsculo e sem acentos):**
   - Identifica o módulo, domínio ou camada afetada (ex.: `autenticacao`, `atendimento`, `relatorios`, `permissoes`, `banco`, `ui`).
   - Se a alteração for global no repositório, utilize um escopo geral coerente (ex.: `config`, `deps`, `geral`).
3. **Descrição (após `: `):**
   - Deve começar **obrigatoriamente com letra maiúscula**.
   - O primeiro verbo deve estar **obrigatoriamente no infinitivo** (ex.: _Implementar_, _Corrigir_, _Adicionar_, _Remover_, _Atualizar_, _Refatorar_, _Ajustar_, _Configurar_).
   - Não terminar a linha de título com ponto final.
   - Se necessário, adicione um corpo opcional separado por uma linha em branco explicando o _porquê_ da alteração.

### Exemplos Válidos

- `feat(autenticacao): Implementar o módulo de autenticação`
- `fix(permissoes): Corrigir permissões de usuários admin`
- `refactor(atendimento): Extrair regra de validação de assinatura remota`
- `chore(deps): Atualizar dependências do Drizzle ORM`

### Exemplos Inválidos (PROIBIDO)

- `feat(autenticacao): implementando o módulo de autenticação` _(verbo no gerúndio e inicial minúscula)_
- `feat(autenticacao): implementou o módulo de autenticação` _(verbo no passado)_
- `Feat(autenticacao): Implementar módulo.` _(tipo com inicial maiúscula e ponto final)_

## Fluxo de Execução (Passo a Passo)

### Passo 1: Análise da Árvore de Alterações

1. Execute `git status` para listar todos os arquivos modificados, novos (`untracked`) e removidos.
2. Execute `git diff` (e `git diff --staged`, se houver arquivos já no stage) para entender o conteúdo real das alterações.
3. Caso existam arquivos novos (`untracked`), leia o conteúdo relevante deles para compreender o propósito antes de classificar o `tipo` e o `modulo`.

### Passo 2: Planejamento de Commits Atômicos

1. Agrupe os arquivos por contexto lógico/módulo. Nunca misture alterações não relacionadas (ex.: uma correção em `permissoes` junto com uma nova feature em `relatorios`) no mesmo commit, a menos que o usuário peça explicitamente.
2. Defina a ordem lógica dos commits (ex.: schema/banco antes de service/controller).

### Passo 3: Loop de Aprovação (UM COMMIT POR VEZ)

Para **cada** grupo de alterações planejado, siga rigorosamente esta sequência:

1. **Apresente a proposta ao usuário** contendo:
   - **Número do commit** (ex.: `Commit 1 de 3`).
   - **Arquivos que serão incluídos** (`git add` específico desses arquivos).
   - **Mensagem de commit proposta** formatada em bloco de código.
   - **Breve resumo** do que está sendo alterado nesse pacote.
2. **Pergunte explicitamente:** _"Você aprova este commit? (Sim / Não / Ajustar mensagem)"_
3. **Pare e aguarde a resposta do usuário.**
   - **Se o usuário aprovar:** Execute `git add <arquivos-do-grupo>` e `git commit -m "<mensagem-aprovada>"`. Em seguida, avance para o próximo commit da fila.
   - **Se o usuário pedir ajuste na mensagem ou nos arquivos:** Refaça a proposta conforme solicitado e peça confirmação novamente.
   - **Se o usuário recusar:** Não execute o commit daquele grupo, pergunte se deseja pular para o próximo ou encerrar o processo.

## Restrições Críticas

- **NUNCA** execute `git commit` sem antes receber a confirmação explícita do usuário para aquela mensagem e conjunto de arquivos específicos.
- **NUNCA** use `git add .` de forma cega se houver múltiplos contextos distintos na árvore; adicione apenas os arquivos pertencentes ao commit aprovado no momento.
- **NUNCA** execute `git push` automaticamente ao final dos commits, a menos que o usuário solicite expressamente.
