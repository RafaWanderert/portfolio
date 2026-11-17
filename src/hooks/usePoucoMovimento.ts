import { useSyncExternalStore } from 'react'

const consulta = '(prefers-reduced-motion: reduce)'

function assinar(avisar: () => void) {
  const mq = window.matchMedia(consulta)
  mq.addEventListener('change', avisar)
  return () => mq.removeEventListener('change', avisar)
}

/**
 * true quando a pessoa pediu menos movimento no sistema (Windows, celular...).
 * Nesse caso o fundo fica parado, a fita não avança sozinha e as trocas são instantâneas.
 * No HTML pré-renderizado o valor é false; o React corrige assim que a página monta.
 */
export function usePoucoMovimento(): boolean {
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(consulta).matches,
    () => false,
  )
}
