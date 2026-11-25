# Especificação 004.1: Home Page da Empresa (Painel do Prestador)

## 1. Visão Geral

Criar a página inicial operacional para usuários com papel `prestador` (`/empresa`), oferecendo visão rápida do status da organização, métricas do catálogo e acesso direto às configurações de agenda, categorias, serviços e link público da vitrine.

## 2. Requisitos Funcionais

- **RF01 — Cabeçalho Operacional e Link Compartilhável:** Exibir o nome fantasia da organização, status de configuração da agenda e botão com feedback visual para copiar o link público (`/vitrine/:idOrganizacao`).
- **RF02 — Cards de Resumo (Indicadores Reais):** Exibir métricas reais da organização: total de serviços ativos, total de categorias cadastradas e status dos dias de atendimento configurados (além de placeholder estruturado para "Agendamentos de Hoje" que será alimentado no módulo `005-agendamentos`).
- **RF03 — Acesso Rápido (Ações Principais):** Cards interativos `Botao` e os componentes do React Bits (`SpotlightCard` ou `ScrollStack`) para navegar rapidamente para:
  1. **Gerenciar Serviços**
  2. **Configurar Horários e Dias da Agenda**
  3. **Gerenciar Categorias**
  4. **Visualizar Minha Vitrine Pública**
- **RF04 — Checklist de Ativação:** Caso a empresa ainda não tenha configurado horários de funcionamento ou não possua nenhum serviço ativo, exibir um alerta orientativo com botão direto para completar o cadastro.

## 3. Critérios de Aceite

- Rota protegida exclusivamente para usuários autenticados com `role === 'prestador'`.
- Seguir obrigatoriamente as skills de `.agents/`, tokens de cores do sistema e componente `Botao.tsx`.
