# Especificação 004: Home Page do Cliente (Descoberta e Vitrine)

## 1. Visão Geral

Substituir a tela vazia do cliente por uma Home Page moderna, responsiva e funcional que apresente a proposta do **AgendaJá** e permita ao cliente descobrir estabelecimentos parceiros e seus serviços cadastrados em tempo real.

## 2. Requisitos Funcionais

- **RF01 — Hero Section e Identidade Visual:** Cabeçalho de impacto apresentando o AgendaJá, barra de busca rápida (por nome do estabelecimento, serviço ou categoria) e CTAs usando o componente reutilizável `Botao` e os tokens de cores do sistema.

- **RF02 — Seção Interativa com React Bits (`ScrollStack`):** Implementar uma seção de destaque ("Como funciona" ou "Categorias em destaque") usando o componente `ScrollStack` (`https://reactbits.dev/components/scroll-stack`), adaptada aos tokens de cores e tipografia do projeto.

- **RF03 — Vitrine de Estabelecimentos Parceiros (Dados Reais):** Exibir uma grade de cards com as organizações cadastradas no banco de dados (nome fantasia, endereço, resumo de serviços ativos e botão de ação para acessar a página pública `/vitrine/:idOrganizacao` de cada empresa).

- **RF04 — Adaptação por Estado de Autenticação:**
  - _Visitante não logado:_ Exibe botões de **"Entrar"** e **"Cadastrar"** no topo, além de permitir navegar livremente pelas empresas e serviços.
  - _Cliente autenticado:_ Exibe saudação personalizada com o nome do usuário, acesso rápido para **"Meus Agendamentos"** e botão de sair.

## 3. Critérios de Aceite

- Nenhuma informação deve ser mockada estaticamente na listagem de empresas; os dados devem vir de endpoint público real no `servidor/` consumido via **TanStack Query**.
- Seguir obrigatoriamente as skills da pasta `.agents/`, os tokens de cores do projeto e o componente `Botao.tsx`.
- Código 100% em português com sufixos padrão do NestJS no backend.
