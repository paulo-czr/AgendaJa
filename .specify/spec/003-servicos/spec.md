# Especificação 003: Catálogo de Serviços e Vitrine Pública

## 1. Visão Geral

Permitir que usuários com papel `prestador` gerenciem o catálogo de serviços exclusivamente da sua própria organização, e disponibilizar uma rota pública compartilhável (landing page simples de vitrine) para que clientes visualizem os serviços ativos da empresa.

## 2. Requisitos Funcionais

- **RF01 — Criação de Serviço (Prestador):** O prestador autenticado pode cadastrar serviços vinculados **exclusivamente** à sua própria organização (`id_organizacao` resolvido a partir do usuário logado, nunca aceito livremente pelo body para evitar spoofing).
- **RF02 — Campos do Serviço:**
  - `nome_servico` (obrigatório, string entre 2 e 120 caracteres)
  - `descricao_servico` (opcional, string até 500 caracteres)
  - `categoria` (opcional, string até 60 caracteres para agrupamento na vitrine)
  - `preco_centavos` (obrigatório, inteiro >= 0)
  - `duracao_minutos` (obrigatório, número inteiro positivo >= 1, sem restrição de múltiplos)
  - `ativo` (booleano, padrão `true`)
- **RF03 — Edição e Propriedade:** O prestador pode atualizar os dados de um serviço somente se este pertencer à sua própria organização.
- **RF04 — Exclusão Lógica (Soft Delete):** A remoção de um serviço altera `ativo = false` (e registra `desativado_em`), preservando a integridade histórica de agendamentos e relatórios passados. Serviços inativos não aparecem na vitrine pública, mas podem ser reativados ou listados no painel do prestador.
- **RF05 — Listagem Privada (Painel do Prestador):** Listar todos os serviços (ativos e inativos) da organização do prestador autenticado, além de fornecer o link público compartilhável.
- **RF06 — Vitrine Pública Compartilhável (Landing Page):** Endpoint público (sem exigência de login) que retorna os dados básicos da organização (nome fantasia, endereço, telefone, horários de funcionamento) e apenas os serviços com `ativo = true`, exibidos em uma página pública dedicada no `aplicativo` com botão para iniciar o agendamento.

## 3. Critérios de Aceite

- Tentativa de editar ou desativar serviço de outra organização retorna HTTP `403 Forbidden` ou `404 Not Found`.
- `duracao_minutos` aceita qualquer inteiro positivo (ex: `15`, `25`, `45`, `90`) e rejeita `0`, negativos ou decimais via Zod.
- Exclusão nunca executa `DELETE` físico no banco de dados.
- Nomenclatura de arquivos no `servidor` respeita o domínio em português com sufixos NestJS em inglês (`.service.ts`, `.controller.ts`, `.module.ts`, `.dto.ts`, `.spec.ts`).
