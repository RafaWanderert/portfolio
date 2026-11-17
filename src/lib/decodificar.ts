// O efeito de "decodificar" do texto de fundo: as letras embaralham e, da esquerda para
// a direita, viram a frase no próximo idioma. Aqui fica só a conta, sem navegador:
// quem desenha na tela é o hook useDecodificar.

/** De quanto em quanto tempo o fundo troca de idioma. */
export const TROCA_MS = 3200
/** Quanto tempo as letras levam para se resolver. */
export const DURACAO_MS = 900
/** Intervalo entre um embaralhar e o próximo (mais curto que isso vira um borrão). */
export const PASSO_MS = 45

const fixa = (letra: string) => letra === ' ' || letra === '-'

/**
 * As letras que podem ser sorteadas: só as da própria frase. Assim as fontes do japonês,
 * do coreano e do russo podem ter apenas essas letras (veja scripts/fontes.mjs).
 */
export function letras(linhas: readonly string[]): string[] {
  // Array.from separa por caractere de verdade: "開" conta como 1, não como 3 bytes
  return linhas.flatMap((linha) => Array.from(linha)).filter((letra) => !fixa(letra))
}

/**
 * Um quadro da animação. "progresso" vai de 0 (tudo embaralhado) a 1 (frase pronta).
 * Espaços e hífens nunca são trocados, para a frase manter o desenho.
 * "sortear" devolve um número de 0 a 1 (nos testes ele é fixo; na tela é Math.random).
 */
export function quadro(
  linhas: readonly string[],
  progresso: number,
  sortear: () => number = Math.random,
): string[] {
  const p = Math.min(1, Math.max(0, progresso))
  const sorteaveis = letras(linhas)
  return linhas.map((linha) => {
    const finais = Array.from(linha)
    const resolvidas = Math.floor(p * finais.length)
    return finais
      .map((letra, i) =>
        i < resolvidas || fixa(letra) ? letra : sorteaveis[Math.floor(sortear() * sorteaveis.length)],
      )
      .join('')
  })
}

/**
 * O fundo só alterna de idioma quando a primeira tela está à vista, a aba está aberta,
 * nenhum idioma foi fixado e a pessoa não pediu menos movimento no sistema.
 */
export function fundoRoda(e: {
  naTela: boolean
  abaVisivel: boolean
  fixo: boolean
  poucoMovimento: boolean
}): boolean {
  return e.naTela && e.abaVisivel && !e.fixo && !e.poucoMovimento
}
