# Plano Técnico 004: Home Page do Cliente

## 1. Backend (`servidor/src/modules/organizacoes/`)

- **Novo Endpoint Público:** `GET /organizacoes/publicas` (sem `GuardaAutenticacaoGuard`).
  - Aceita query param opcional `?busca=texto` (validado com `nestjs-zod`).
  - Retorna as organizações ativas/configuradas junto com a contagem de serviços ativos (`ativo = true`) e até 3 serviços de destaque para pré-visualização no card.

## 2. Frontend (`aplicativo/src/modules/home-cliente/`)

- **Componentes Visuais:**
  - `aplicativo/src/components/ui/ScrollStack.tsx`: Componente usado da referência `https://reactbits.dev/components/scroll-stack` (verificando dependências leves como `lenis` ou implementação CSS/Motion nativa conforme skills de `.agents/`).
  - `aplicativo/src/modules/home-cliente/components/HeroCliente.tsx`: Banner inicial com busca integrada.
  - `aplicativo/src/modules/home-cliente/components/CardOrganizacao.tsx`: Card moderno exibindo dados da empresa, preview de serviços/preços e `Botao` para abrir `/vitrine/:idOrganizacao`.
- **Dados (`TanStack Query`):**
  - `aplicativo/src/modules/home-cliente/services/vitrineGeral.service.ts`
  - `aplicativo/src/modules/home-cliente/hooks/usarOrganizacoesPublicas.ts` (queryKey: `['organizacoes-publicas', termoBusca]`).
- **Roteamento (`aplicativo/src/app/`):**
  - Definir `/` como a Home do Cliente por padrão (e redirecionar automaticamente usuários com `role === 'prestador'` para `/painel` ou `/empresa` caso acessem a raiz logados como empresa).
