// Contas da demonstração "Como trabalho": o visitante escreve o nome do negócio e a janela
// de exemplo usa esse nome no título, no endereço e na mensagem do WhatsApp.

/** Espaços juntados e sem sobra nas pontas. */
const limpar = (texto: string) => texto.replace(/\s+/g, ' ').trim()

/** Nome como aparece na janela; sem nome, fala do negócio da pessoa. */
export function nomeDoNegocio(texto: string): string {
  return limpar(texto) || 'Seu negócio'
}

/** Endereço de exemplo: "Padaria do Zé" → "padariadoze.com.br". */
export function dominioDe(texto: string): string {
  const base = texto
    .normalize('NFD')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 30)
  return (base || 'seunegocio') + '.com.br'
}

/** Mensagem pronta do botão "Pedir um site": com o nome, já diz para qual negócio é. */
export function mensagemPedido(texto: string, padrao: string): string {
  const nome = limpar(texto)
  return nome ? `Olá, Rafael! Vi o seu portfólio e quero um site para o meu negócio: ${nome}.` : padrao
}

/** Próximo passo da demonstração, ou null quando já está no último. */
export function proximaEtapa(atual: number, total: number): number | null {
  return atual < total ? atual + 1 : null
}

/**
 * Trocas do roteiro que ainda não aconteceram, depois de `decorrido` ms já tocados,
 * com quanto falta para cada uma. Assim pausar e continuar não perde o compasso.
 */
export function pendentes<T>(
  roteiro: readonly { em: number; muda: T }[],
  decorrido: number,
): { espera: number; muda: T }[] {
  return roteiro.filter((t) => t.em > decorrido).map((t) => ({ espera: t.em - decorrido, muda: t.muda }))
}
