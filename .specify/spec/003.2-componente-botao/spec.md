# Especificação 003.2: Componente Reutilizável de Botão (`Botao`)

## 1. Objetivo

Criar um componente de botão padronizado, acessível e altamente estilizável em `aplicativo/src/components/ui/Botao.tsx`, utilizando os tokens de cores já previstos no sistema (primária, secundária e cores de fonte) e seguindo as skills de design da pasta `.agents/`.

## 2. Contrato de Variantes (`variante`)

- **`primario` (padrão):** Botão principal, usado para ações importantes e afirmativas (ex: _Salvar, Gravar, Criar, Confirmar_). Utiliza a cor primária e a cor de fonte contrastante configuradas no sistema.
- **`secundario`:** Ações complementares ou de apoio que possuem destaque suave sem competir com o botão principal (ex: _Editar, Ver detalhes, Filtrar_). Utiliza a cor secundária prevista no tema.
- **`outline`:** Ações neutras ou de recuo que exigem borda definida com fundo transparente/sutil (ex: _Cancelar, Voltar, Limpar_).
- **`ghost`:** Ações discretas, de navegação interna ou dentro de linhas de tabelas e cards, onde o fundo aparece apenas no hover/focus (ex: _Fechar, ações rápidas_).
- **`perigo`:** Ações destrutivas ou irreversíveis (ex: _Excluir, Desativar serviço, Cancelar agendamento_).

## 3. Tamanhos (`tamanho`)

- **`pequeno`:** Compacto, ideal para ações dentro de tabelas, badges e cards densos.
- **`medio` (padrão):** Altura e espaçamento padrão para formulários e ações gerais.
- **`grande`:** Destaque ampliado para chamadas principais (CTAs) e vitrine pública.

## 4. Props, Ícones e Boas Práticas

- **Ícones (`lucide-react`):** Aceitar via props `iconeEsquerda?: LucideIcon` e `iconeDireita?: LucideIcon` (com dimensionamento automático proporcional ao `tamanho` escolhido), além de manter suporte a `children` flexível.
- **Estado de Carregamento (`carregando?: boolean`):** Quando `true`, desabilita o botão (`disabled`), aplica `aria-busy="true"` e exibe o ícone `Loader2` (`lucide-react`) com `animate-spin` no lugar do ícone esquerdo, mantendo a largura estável.
- **Extensibilidade:** Estender `React.ButtonHTMLAttributes<HTMLButtonElement>`, encaminhar `ref` (`React.forwardRef`), definir `type="button"` por padrão (evitando submits acidentais em formulários) e mesclar classes customizadas via `className` (usando `tailwind-merge` / utilitário `cn` do projeto, se disponível).
