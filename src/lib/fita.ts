// A conta da fita de projetos, sem navegador: quem liga isto à tela é o hook useFita.
//
// O cartão ativo é um número inteiro que só cresce ou diminui ("posição virtual"): 0, 1, 2, 3, 4, 5...
// O projeto mostrado é esse número dando a volta na lista. Assim, ir do último para o primeiro
// é só "mais um passo para a direita", e nenhum cartão precisa atravessar a tela para voltar.

// A fita avança sozinha quando a linha de progresso termina de encher: os 4 segundos estão
// na animação "encher", em src/index.css. Assim a linha e o avanço nunca saem de sincronia.

/** Índice que dá a volta: com 4 projetos, o 4 vira 0 e o -1 vira 3. */
export function volta(i: number, total: number): number {
  return ((i % total) + total) % total
}

/** As posições desenhadas na tela: "raio" de cada lado do ativo, cada uma com o seu projeto. */
export function janela(ativo: number, total: number, raio: number): { v: number; projeto: number }[] {
  return Array.from({ length: raio * 2 + 1 }, (_, i) => {
    const v = ativo - raio + i
    return { v, projeto: volta(v, total) }
  })
}

/**
 * Decide o que fazer quando a pessoa solta o arraste. Devolve 1 (próximo), -1 (anterior) ou 0 (fica).
 * dx é quanto o dedo andou, em px (negativo = para a esquerda). velocidade é em px por milissegundo.
 * Muda de cartão se o dedo andou bastante (20% do cartão, no mínimo 60 px) ou se foi um
 * peteleco: pouco caminho (16 px ou mais), mas rápido (0,3 px por milissegundo ou mais).
 */
export function passoDoArraste(dx: number, velocidade: number, largura: number): -1 | 0 | 1 {
  const longo = Math.abs(dx) >= Math.max(60, largura * 0.2)
  const rapido = Math.abs(dx) >= 16 && Math.abs(velocidade) >= 0.3
  if (!longo && !rapido) return 0
  return dx < 0 ? 1 : -1
}

/** A fita só avança sozinha quando está à vista e ninguém está mexendo nela. */
export function fitaRoda(e: {
  naTela: boolean
  mouseEmCima: boolean
  focoDentro: boolean
  arrastando: boolean
  pausada: boolean
  videoTocando: boolean
  poucoMovimento: boolean
}): boolean {
  return (
    e.naTela &&
    !e.mouseEmCima &&
    !e.focoDentro &&
    !e.arrastando &&
    !e.pausada &&
    !e.videoTocando &&
    !e.poucoMovimento
  )
}
