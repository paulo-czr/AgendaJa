# Especificação 003.1: Categorias de Serviços (Adendo ao Módulo 003)

## 1. Visão Geral

Adicionar o cadastro padronizado de categorias de serviços por organização dentro da área de **Configurações**, permitindo vincular serviços existentes e novos a uma categoria sem risco de erros de digitação e agrupando a exibição na vitrine pública.

## 2. Requisitos Funcionais

- **RF01 — Gestão de Categorias (Aba em Configurações):** O prestador autenticado pode criar, listar, editar o nome e remover categorias vinculadas exclusivamente à sua própria organização através de uma nova opção **"Categorias"** na navbar de Configurações.
- **RF02 — Unicidade por Organização:** Impedir o cadastro ou renomeação de categorias com o mesmo nome (case-insensitive) dentro da mesma organização. Organizações diferentes podem ter categorias com nomes iguais.
- **RF03 — Vínculo com Serviços:** Atualizar a entidade `servicos` para aceitar `id_categoria` (UUID opcional/nullable) referenciando `categorias_servicos.id`. Validar no backend se o `id_categoria` informado pertence à organização do prestador autenticado.
- **RF04 — Remoção Segura:** Ao remover uma categoria, os serviços vinculados a ela devem ser desvinculados (`id_categoria = null`) sem serem excluídos ou desativados.
- **RF05 — Agrupamento na Vitrine Pública:** Atualizar a consulta da vitrine pública para retornar o nome da categoria de cada serviço ativo, exibindo-os agrupados por categoria (e serviços sem categoria em uma seção geral/padrão).

## 3. Critérios de Aceite

- Preservar toda a lógica e rotas já existentes do módulo `servicos`.
- Nomenclatura estritamente em português para domínio/colunas e sufixos padrão do NestJS (`.service.ts`, `.controller.ts`, `.module.ts`, `.dto.ts`, `.spec.ts`).
- Estado assíncrono no `aplicativo` gerenciado via TanStack Query.
