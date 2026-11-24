# Especificação 002: Organizações e Configurações de Agenda

## 1. Visão Geral
Permitir que o usuário **prestador** cadastre e mantenha os dados da sua organização (empresa) e defina as regras de funcionamento da agenda — dias de atendimento, expediente, intervalo de pausa, duração padrão e bloqueios pontuais — na tela **Configurações** do **AgendaJá** (Figma: página "agendamento geral", frames `Configurações` e `Configurações • Mobile`). Essas regras serão consumidas pelo cálculo de disponibilidade da feature `004-agendamentos` (Constituição, Art. 5.2 e 5.3).

## 2. Requisitos Funcionais
- **RF01 — Cadastro da Organização:** Um usuário com `role = prestador` sem organização deve cadastrar a sua informando `nome_fantasia`, `documento` (CPF ou CNPJ, único), `telefone`, `endereco` (opcional) e `capacidade_simultanea` (inteiro ≥ 1, padrão `1`). Nesta feature, cada prestador possui **uma única** organização.
- **RF02 — Consulta e Edição da Organização:** O prestador visualiza e edita os dados da sua organização (bloco "Sua empresa" do Figma). O `documento` não pode ser alterado após o cadastro.
- **RF03 — Dias e Horários de Funcionamento:** O prestador seleciona os dias da semana em que atende (Seg a Dom) e define o horário de **abertura** e **encerramento** no formato `HH:MM`. Dias desmarcados ficam com `ativo = false` e não aceitam agendamentos.
- **RF04 — Intervalo de Pausa:** O prestador pode definir um intervalo diário (`inicio_pausa` e `fim_pausa`), que não aparece como disponível para reservas. O intervalo é opcional.
- **RF05 — Duração Padrão:** O prestador escolhe a duração padrão dos atendimentos (15, 30, 45, 60, 90 ou 120 minutos; padrão `30`), usada para pré-preencher a duração ao cadastrar serviços na feature `003-servicos`.
- **RF06 — Bloqueios Pontuais:** O prestador cadastra, lista e remove bloqueios de datas/horários (feriados, férias, manutenções) com `data_hora_inicio`, `data_hora_fim` e `motivo` (opcional), que se sobrepõem à grade semanal.
- **RF07 — Redirecionamento do Prestador sem Organização:** Ao entrar no sistema, um prestador sem organização cadastrada é levado à tela de Configurações para concluir o RF01 antes de acessar as demais áreas.

## 3. Critérios de Aceite
- Somente usuários autenticados com `role = prestador` acessam os endpoints desta feature; `cliente` recebe HTTP `403 Forbidden`.
- Um prestador só lê e altera a **própria** organização; não há endpoint que receba `id` de organização de terceiros.
- Prestador sem organização recebe HTTP `404 Not Found` com mensagem clara ao consultar dados da organização ou da agenda.
- Cadastro com `documento` já existente retorna HTTP `409 Conflict`.
- Horários validados no formato `HH:MM` (00:00 a 23:59), com `abertura < encerramento`; quando houver pausa, `abertura ≤ inicio_pausa < fim_pausa ≤ encerramento`. Violações retornam HTTP `400 Bad Request`.
- Bloqueios exigem `data_hora_fim > data_hora_inicio`.
- Todos os payloads validados com `nestjs-zod`.
- As migrations devem ser somente geradas; o desenvolvedor é quem as aplica.
- Interface fiel ao Figma (tokens do `tailwind.config.cjs`), responsiva (desktop e mobile) e com estado assíncrono via TanStack Query.
- Código 100% em português conforme Constituição.

## 4. Decisões sobre as Divergências Figma x Schema (T00 — resolvido)
O Figma e os schemas divergiam nos itens abaixo. A validação foi delegada pelo time; as decisões tomadas foram:
1. **Telefone da empresa:** adicionada a coluna `telefone` em `organizacoes` (nullable no banco para preservar registros antigos; obrigatório no cadastro e na edição pela API). A tela pré-preenche com o telefone do usuário.
2. **Documento (CPF/CNPJ) e capacidade simultânea:** incluídos no bloco "Sua empresa". O documento é aceito com ou sem máscara, armazenado somente com dígitos, validado pelos dígitos verificadores e exibido como somente leitura após o cadastro.
3. **Pausa e duração padrão:** novas colunas `inicio_pausa`/`fim_pausa` (em `configuracoes_agenda`) e `duracao_padrao_minutos` (em `organizacoes`).
4. **Expediente único x por dia:** a interface aplica o mesmo expediente e a mesma pausa a todos os dias; a API grava uma linha por dia e já aceita horários diferentes por dia.
5. **Bloqueios pontuais:** novo cartão "Bloqueios na agenda" no mesmo padrão visual dos demais. Cada bloqueio é criado/removido na hora, sem depender do botão "Salvar alterações".
6. **"Sem sobreposição para a mesma equipe":** o conceito de equipe fica fora do escopo. O texto do cartão informativo passa a exibir a capacidade simultânea real da empresa.
7. **Elementos de demonstração do Figma** ("Ambiente de exemplo" e "Exemplo: toque nos campos…") não foram implementados por serem conteúdo de protótipo.
8. **Menu de navegação:** itens de páginas que ainda não existem (Agendamentos, Clientes, Serviços) aparecem desabilitados com a indicação "Em breve", evitando levar o usuário à página 404.
