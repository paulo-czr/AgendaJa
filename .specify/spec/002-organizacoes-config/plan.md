# Plano Técnico 002: Organizações e Configurações de Agenda

## 1. Modelagem de Banco de Dados (Drizzle ORM + Supabase)
Pasta: `servidor/src/database/schemas/`. As tabelas já existem; abaixo, apenas as **alterações** decididas na seção 4 da `spec.md`.

### Tabela `organizacoes` (`organizacoes.schema.ts`)
- Mantém: `id`, `id_usuario`, `nome_fantasia`, `documento` (unique), `endereco`, `capacidade_simultanea`, `criado_em`, `atualizado_em`.
- **Adicionar** `telefone`: `varchar(20)` (nullable — preserva registros existentes).
- **Adicionar** `duracao_padrao_minutos`: `integer` (notNull, default `30`).
- **Adicionar** índice único em `id_usuario` (uma organização por prestador).

### Tabela `configuracoes_agenda` (`configuracoes-agenda.schema.ts`)
- Mantém: `id`, `id_organizacao`, `dia_semana` (0 = Domingo … 6 = Sábado), `horario_abertura`, `horario_fechamento`, `ativo`, `criado_em`, `atualizado_em`.
- **Adicionar** `inicio_pausa`: `varchar(5)` (nullable, formato `HH:MM`).
- **Adicionar** `fim_pausa`: `varchar(5)` (nullable, formato `HH:MM`).
- **Adicionar** índice único composto em (`id_organizacao`, `dia_semana`).

### Tabela `bloqueios_agenda`
- Sem alterações: `id`, `id_organizacao`, `data_hora_inicio`, `data_hora_fim`, `motivo`, `criado_em`.

Gerar a migration com `drizzle-kit generate` em `servidor/drizzle/` (não aplicar).

## 2. Endpoints da API
Todos protegidos por `GuardaAutenticacao` + `GuardaPapeis` com `@Papeis('prestador')`. A organização é sempre resolvida a partir de `@UsuarioAtual()`, nunca por `id` na URL. Para os guards funcionarem nos novos módulos, o `AutenticacaoModule` passa a reexportar o `JwtModule`.

### Módulo `servidor/src/modules/organizacoes/`
- `POST /organizacoes` — Cria a organização do prestador e a grade padrão (Seg–Sex ativos, 08:00–18:00, pausa 12:00–13:00; Sáb e Dom inativos). Retorna `409` se o prestador já possuir organização ou se o `documento` já existir.
- `GET /organizacoes/minha` — Retorna os dados da organização do prestador (`404` se não houver).
- `PATCH /organizacoes/minha` — Atualiza `nome_fantasia`, `telefone`, `endereco`, `capacidade_simultanea` e `duracao_padrao_minutos` (o `documento` é imutável).

### Módulo `servidor/src/modules/configuracoes-agenda/`
- `GET /configuracoes-agenda` — Retorna os 7 dias da grade semanal da organização do prestador.
- `PUT /configuracoes-agenda` — Substitui a grade completa (array com os 7 dias) em uma transação, validando horários e pausa (`400` em caso de inconsistência).
- `GET /configuracoes-agenda/bloqueios` — Lista os bloqueios futuros, ordenados por `data_hora_inicio`.
- `POST /configuracoes-agenda/bloqueios` — Cria um bloqueio (`data_hora_fim > data_hora_inicio`).
- `DELETE /configuracoes-agenda/bloqueios/:id` — Remove um bloqueio da própria organização (`404` se pertencer a outra).

### DTOs (`nestjs-zod`)
- `organizacoes/dtos/`: `criar-organizacao.dto.ts`, `atualizar-organizacao.dto.ts`, `respostas.dto.ts`.
- `configuracoes-agenda/dtos/`: `salvar-grade.dto.ts` (schema Zod reutilizável para `HH:MM` e regras de pausa), `criar-bloqueio.dto.ts`, `respostas.dto.ts`.

## 3. Arquitetura no Frontend (`aplicativo/src/modules/organizacoes/`)
- **Layout do painel:** criar o layout compartilhado do prestador (menu lateral, cabeçalho e título da página conforme Figma; navegação inferior no mobile) em `aplicativo/src/components/` — primeira tela que o utiliza.
- **Rota:** `/configuracoes`, envolvida por `RotaProtegida`, registrada em `aplicativo/src/app/Aplicativo.tsx`.
- **Camada lógica (desacoplada da UI):** `servicos/organizacoesServico.ts` e `servicos/configuracoesAgendaServico.ts` (chamadas via `clienteHttp`) e hooks `hooks/usarOrganizacao.ts` e `hooks/usarConfiguracoesAgenda.ts` com `useQuery(['organizacao-atual'])`, `useQuery(['grade-agenda'])`, `useQuery(['bloqueios-agenda'])` e `useMutation` com invalidação.
- **Formulário (`formulario.ts`):** estado da tela, conversão de/para a API e validação local com mensagens amigáveis (o servidor revalida tudo).
- **Página `paginas/PaginaConfiguracoes.tsx`** composta por cartões fiéis ao Figma (em `componentes/CartoesConfiguracoes.tsx` e `componentes/CartaoBloqueios.tsx`):
  - `CartaoDadosEmpresa` — Nome, Documento (somente leitura após cadastro), Telefone, Endereço, Capacidade simultânea.
  - `CartaoFuncionamento` — seletor de dias (Seg–Dom, estado ativo verde-água com ✓) + Abertura/Encerramento.
  - `CartaoPausa` — Início/Fim da pausa.
  - `CartaoDuracaoPadrao` — seleção de 15 a 120 minutos.
  - `CartaoBloqueios` — lista e formulário de bloqueios (sem Figma; mesmo padrão visual), salvos na hora e exibidos só após o cadastro da empresa.
  - `CartaoSobreDisponibilidade` — cartão azul-petróleo informativo ("Sua agenda, suas regras."), exibindo a capacidade simultânea.
- **Fluxo do RF07:** o componente `componentes/ExigirOrganizacao.tsx` envolve as rotas internas; se `role = prestador` e `GET /organizacoes/minha` retornar `404`, redireciona para `/configuracoes`, que entra em modo de cadastro (botão "Cadastrar empresa"). O cadastro cria a empresa (`POST`) e grava a grade escolhida (`PUT`).

## 4. Compatibilidade com os Schemas Existentes
As chaves continuam `serial`/`integer`, mantendo as referências de `servicos`, `configuracoes_agenda` e `bloqueios_agenda` para `organizacoes.id`. As novas colunas são nullable ou possuem default, sem quebrar dados existentes. A Constituição (Art. 2.2) define a pasta `aplicativo/src/components`; o componente `Logo` atualmente em `aplicativo/src/componentes/` deve ser movido para ela.
