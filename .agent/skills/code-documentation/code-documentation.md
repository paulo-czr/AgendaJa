# code-documentation

Diretrizes para criar, ajustar e manter documentações de código limpas, objetivas e pragmáticas usando **JSDoc** (em métodos, funções e tipos públicos) e comentários inline em blocos estratégicos.

Use esta skill quando a tarefa envolver documentar novas rotas, serviços, utilitários, refatorar assinaturas de funções ou quando for solicitado adicionar JSDoc a arquivos existentes.

## Objetivo

Garantir documentação de código **suficiente para explicitar a intenção, os contratos de entrada/saída, efeitos colaterais e exceções**, com o menor ruído visual possível. Priorize clareza sobre o *propósito* e o *porquê* (intenção/regras), evitando repetir o que a assinatura de tipos ou o próprio código já tornam óbvios.

**Não crie comentários em excesso apenas para cobrir linhas ou repetir tipos.** Cada comentário deve agregar contexto real que reduza a carga cognitiva de quem lê ou mantém o código.

## Regra: O que documentar (e o que NÃO documentar)

### No JSDoc do Método/Função

- **Resumo de alto nível:** Descreva em 1 ou 2 frases curtas *o que* a função faz do ponto de vista do domínio de negócio.
- **Retorno e Comportamento (`@returns`):** O resultado esperado ou o estado retornado após o sucesso.
- **Exceções e Erros (`@throws`):** Explicite exceções de negócio ou validações lançadas intencionalmente.
- **NÃO use `@param` desnecessários:** Se o projeto utiliza TypeScript ou possui nomes de parâmetros autoexplicativos, omita `@param` triviais (ex.: `id: number`). Use `@param` apenas quando o parâmetro exigir contexto especial de formato/regra (ex.: string Base64, UUID com regra específica, máscaras).

### Comentários Inline (dentro do método)

- **Não comente o óbvio:** Evite comentários redundantes como `// faz o update no banco` ou `// lança exceção se for nulo`.
- **Comente decisões complexas e regras críticas:** Use comentários dentro do método **somente** em trechos de regra de negócio complexa, controle de concorrência, tratamentos de erro não óbvios (ex.: rollback de arquivos S3) ou contornos (*workarounds*) motivados por limitações técnicas externas.

## Fluxo Obrigatório Antes de Documentar

1. **Inspecione o padrão existente** no arquivo ou módulo. Respeite as convenções e o idioma adotados no repositório.
2. **Analise a tipagem:** Se o TypeScript já deixa claros os parâmetros e tipos de dados, enxugue a documentação e foque nas exceções e regras.
3. **Avalie a complexidade do método:** Métodos pequenos/triviais exigem apenas um JSDoc minimalista de 1 linha. Métodos complexos (como transações, geradores de PDF, integrações com S3) exigem declaração explícita de exceções (`@throws`).
4. **Aplique a documentação:** Adicione/ajuste o JSDoc acima do método e insira comentários inline estritamente onde houver risco de má interpretação.

## Seleção de Escopo: Foco no Essencial

Priorize a documentação nesta ordem:

1. **Contratos Públicos e Serviços Principais:** Métodos de controllers, services de negócio e APIs expostas.
2. **Exceções e Falhas de Negócio (`@throws`):** Mapear erros HTTP/customizados que a chamada pode gerar.
3. **Efeitos Colaterais Importantes:** Operações assíncronas com dependências externas (upload de S3, envio de e-mails, transações de banco).
4. **Pontos de Atenção Internos (Inline):** Blocos de código que fazem limpeza de recursos em caso de falha (rollback manual), tratamentos de corrida/concorrência ou validações de estado complexas.

Evite documentar:

- Métodos privados/internos triviais ou autoexplicativos.
- Getters, setters, mappers diretos e DTOs sem regras anexas.
- Parâmetros cujos nomes e tipos TypeScript já expressam claramente o uso.

## Exemplo Prático de Aplicação

### ❌ Antes (Poluído e Redundante)

**TypeScript**

```typescript
/**
 * Conclui a ordem de serviço
 * @param id O id da ordem
 * @param nomeAssinante Nome de quem assinou
 * @param assinaturaBase64 String da assinatura
 * @param idUsuario ID do usuario
 * @param acessoGlobal Booleano de acesso
 * @returns Retorna a OS
 */
async concluirOrdemServico(id: number, nomeAssinante: string, ...) {
  // busca a OS no banco
  const os = await this.buscar(id);
  // se nao achar lança erro
  if (!os) throw new NotFoundException();
}
```

### ✅ Depois (Limpo, Pragmático e Orientado à Regra)

**TypeScript**

```typescript
/**
 * Conclui uma Ordem de Serviço registrando a assinatura em formato Base64 e a data/hora do término.
 *
 * @returns Retorna a Ordem de Serviço atualizada com status 'Concluida'.
 *
 * @throws {NotFoundException} Se a Ordem de Serviço não for encontrada ou estiver excluída.
 * @throws {ForbiddenException} Se o usuário não tiver permissão de acesso à Ordem de Serviço.
 * @throws {BadRequestException} Se a Ordem de Serviço não estiver com o status 'EmAtendimento'.
 */
async concluirOrdemServico(
  id: number,
  nomeAssinante: string,
  assinaturaBase64: string,
  idUsuario: string,
  acessoGlobal: boolean,
) {
  // ... lógica ...

  try {
    // ... upload e alteração do banco ...
  } catch (error: unknown) {
    if (caminhoPdf) {
      // Garante a limpeza do PDF no S3 caso ocorra erro na conclusão da OS,
      // evitando arquivos órfãos sem referência no banco de dados.
      await this.excluirPdfSemFalhar(caminhoPdf);
    }
    throw error;
  }
}
```

## Critérios de Conclusão

Ao finalizar a documentação de um arquivo ou módulo:

1. Verifique se o JSDoc não duplica desnecessariamente as tipagens do TypeScript.
2. Garanta que todas as exceções importantes lançadas pelo método estejam listadas com `@throws`.
3. Confirme que os comentários inline internos explicam **motivações/intenções** e não a sintaxe da linguagem.
4. Informe resumidamente:
   - Quais métodos/módulos foram documentados.
   - Se foram removidos comentários redundantes ou obsoletos.
   - Quais exceções ou pontos críticos foram destacados no processo.