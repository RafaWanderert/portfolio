type Dados = {
  contatos: readonly { rotulo: string; confirmado: boolean }[]
  projetos: readonly { nome: string; pendencias?: readonly string[] }[]
}

/**
 * O que ainda falta para o site poder ir a público: contato que o Rafa não confirmou
 * e projeto com pendência (um link que ainda não existe, por exemplo).
 * Lista vazia = pode publicar. O build usa esta lista (scripts/prerender.mjs).
 */
export function problemasParaPublicar({ contatos, projetos }: Dados): string[] {
  return [
    ...contatos.filter((c) => !c.confirmado).map((c) => `Contato sem confirmação: ${c.rotulo}`),
    ...projetos.flatMap((p) => (p.pendencias ?? []).map((pendencia) => `${p.nome}: ${pendencia}`)),
  ]
}
