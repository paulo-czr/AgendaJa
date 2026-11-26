# Design System — AgendaJá

**Versão:** 1.1.0  
**Status:** Fonte única da verdade para UI (`aplicativo/`)

---

## 1. Tokens de Cores (CSS Variables / Tailwind)

Definidos em `aplicativo/src/app/estilos.css`, `aplicativo/src/app/cores.ts` e mapeados em `aplicativo/tailwind.config.cjs`:

| Token Semântico                                 | Variável CSS (`estilos.css`)                                                | Valor Base           | Uso                                             | Classe Tailwind                                            |
| ----------------------------------------------- | --------------------------------------------------------------------------- | -------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| `cor-primaria` / `cor-secundaria`               | `--cor-primaria` (`#20c9ae`)                                                | Verde-água           | Ações principais, destaques da marca, foco      | `bg-cor-primaria text-cor-secundaria`                      |
| `cor-primaria-hover`                            | `--cor-primaria-hover` (`#1bb59c`)                                          | Verde-água escuro    | Hover de botões e ações primárias               | `hover:bg-cor-primaria-hover`                              |
| `cor-primaria-suave` / `cor-primaria-escura`    | `--cor-primaria-suave` (`#dff8f2`) / `--cor-primaria-escura` (`#087d70`)    | Verde suave / escuro | Fundos de tags ativas, badges e destaques       | `bg-cor-primaria-suave text-cor-primaria-escura`           |
| `cor-secundaria` / `cor-fonte-invertida`        | `--cor-secundaria` (`#0e2939`) / `--cor-fonte-invertida` (`#ffffff`)        | Azul-petróleo        | Sidebar, cabeçalhos escuros, botões secundários | `bg-cor-secundaria text-cor-fonte-invertida`               |
| `cor-secundaria-suave` / `cor-secundaria-borda` | `--cor-secundaria-suave` (`#173747`) / `--cor-secundaria-borda` (`#294756`) | Petróleo médio       | Superfícies e divisórias sobre fundo escuro     | `bg-cor-secundaria-suave border-cor-secundaria-borda`      |
| `cor-fundo` / `cor-fonte-primaria`              | `--cor-fundo` (`#f4f8f8`) / `--cor-fonte-primaria` (`#123449`)              | Cinza-azulado claro  | Fundo base das páginas e texto principal        | `bg-cor-fundo text-cor-fonte-primaria`                     |
| `cor-superficie` / `cor-superficie-neutra`      | `--cor-superficie` (`#ffffff`) / `--cor-superficie-neutra` (`#edf2f4`)      | Branco / Neutro      | Cards, modais e estados neutros                 | `bg-cor-superficie` / `bg-cor-superficie-neutra`           |
| `cor-fonte-secundaria`                          | `--cor-fonte-secundaria` (`#657d8a`)                                        | Cinza-petróleo       | Descrições, legendas, placeholders              | `text-cor-fonte-secundaria`                                |
| `cor-perigo` / `cor-perigo-fundo`               | `--cor-perigo` (`#b34253`) / `--cor-perigo-fundo` (`#fdecee`)               | Vermelho suave       | Ações destrutivas, exclusão, alertas de erro    | `bg-cor-perigo` / `bg-cor-perigo-fundo text-cor-perigo`    |
| `cor-sucesso` / `cor-alerta`                    | `--cor-sucesso` (`#16a34a`) / `--cor-alerta` (`#d97706`)                    | Verde / Âmbar        | Confirmações, avisos e checklists               | `text-cor-sucesso` / `bg-cor-alerta-fundo text-cor-alerta` |
| `cor-borda` / `cor-sombra`                      | `--cor-borda` (`#e4ecee`) / `--cor-sombra` (`#0e2939`)                      | Borda sutil          | Divisórias, bordas de cards/inputs e sombras    | `border-cor-borda` / `shadow-sutil`                        |

- **Modo Escuro:** Desabilitado no MVP (apenas tema claro ativo, com blocos escuros pontuais utilizando `bg-cor-secundaria`).

---

## 2. Tipografia e Escala

- **Família:** `Inter` (`font-sans`, `tabular-nums` para valores numéricos, preços, horários e contadores).
- **Hierarquia:**
  - Título de Página (`H1`): `text-2xl sm:text-3xl font-semibold tracking-tight text-cor-fonte-primaria` (ou `font-bold` no cabeçalho do `LayoutPainel`)
  - Título de Seção (`H2`): `text-lg sm:text-xl font-semibold tracking-tight text-cor-fonte-primaria`
  - Título de Card (`H3`): `text-sm sm:text-base font-semibold text-cor-fonte-primaria`
  - Corpo (`body`): `text-[13px] sm:text-sm leading-relaxed text-cor-fonte-primaria`
  - Legenda / Metadado: `text-xs text-cor-fonte-secundaria`

---

## 3. Espaçamento e Breakpoints (Mobile-First)

- **Viewport mínimo suportado:** `320px` (garantindo ausência de scroll horizontal a partir de `360px`).
- **Grade base:** múltiplos de `4px` (`gap-4`, `p-5`, `p-6`, `h-10`, `h-11`).
- **Containers padrão:**
  - Páginas públicas / cliente: `max-w-6xl mx-auto px-6 sm:px-8` (e `max-w-5xl` na vitrine pública).
  - Painel da empresa (`LayoutPainel`): `max-w-[1216px] mx-auto px-5 lg:px-10`.
- **Espaçamento entre seções:** `space-y-6` (mobile) / `space-y-8` (desktop).
- **Raio de borda padrão:** `rounded-lg` para inputs e botões (`rounded-xl` para botão `grande` e listas internas), `rounded-2xl` para cards e painéis (`shadow-sutil` + `border border-cor-borda/80`).

---

## 4. Tokens de Movimento (`motion`)

- **Microinterações (hover, tap, troca de aba):** `150ms`–`200ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)` (`.animar-painel-aba` em `estilos.css`).
- **Modais, Toasts e Dropdowns:** `200ms`–`250ms` (toasts via `src/lib/notificacoes.tsx`).
- **Entrada de página e contadores (`motion` / React Bits):** até `400ms`–`500ms`, animando apenas `opacity` e `transform`.
- **Acessibilidade:** Respeitar `@media (prefers-reduced-motion: reduce)` no CSS e `<MotionConfig reducedMotion="user">` nos componentes `motion`.
