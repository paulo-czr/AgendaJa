# Plano Técnico 004.1: Home Page da Empresa

## 1. Backend (`servidor/src/modules/organizacoes/`)

- **Endpoint de Resumo:** `GET /organizacoes/minha/resumo` (protegido por `GuardaAutenticacaoGuard` + `GuardaPapeisGuard('prestador')`).
  - Retorna dados básicos da organização, `total_servicos_ativos`, `total_categorias`, `agenda_configurada` (boolean) e `id_organizacao`.

## 2. Frontend (`aplicativo/src/modules/home-empresa/`)

- **Serviço e Hook:** `resumoEmpresa.service.ts` e `usarResumoEmpresa.ts` (`useQuery` com chave `['resumo-empresa']`).
- **Interface (`PaginaHomeEmpresa.tsx`):**
  - Banner de boas-vindas com `Botao` (`variante="secundario"` ou `"outline"`) para copiar link da vitrine e `Botao` (`variante="primario"`) para "+ Novo Serviço".
  - Banner condicional de Checklist caso `agenda_configurada === false` ou `total_servicos_ativos === 0`.
  - Grade de KPIs e cards de atalho com microinterações inspiradas no React Bits.
