import { useEffect, useState, type RefObject } from 'react'
import { proximaEtapa } from '../lib/exemplo.ts'
import { usePoucoMovimento } from './usePoucoMovimento.ts'

/**
 * A demonstração do "Como trabalho": qual passo está na janela e se ela avança sozinha.
 * Quem marca o tempo é a barrinha do passo ativo (CSS): quando ela termina de encher,
 * aoTerminarBarra() leva ao próximo passo. A barrinha só anda com a janela de exemplo (alvo)
 * à vista e a aba aberta; na pausa ela fica parada onde estava, sem perder o compasso.
 * Para no último passo, quando a pessoa escolhe um passo ou mexe nos ajustes, e nunca roda
 * com "reduzir movimento" ligado.
 */
export function useDemonstracao(total: number, alvo: RefObject<HTMLElement | null>) {
  const poucoMovimento = usePoucoMovimento()
  const [etapa, setEtapa] = useState(1)
  /** A pessoa não escolheu um passo nem mexeu nos ajustes, e a demonstração ainda não chegou ao fim. */
  const [ligada, setLigada] = useState(true)
  /** A pessoa apertou "Pausar": a barrinha fica parada onde estava até "Continuar". */
  const [pausada, setPausada] = useState(false)
  const [naTela, setNaTela] = useState(false)
  const [abaAberta, setAbaAberta] = useState(true)

  // A janela de exemplo está à vista? (metade dela, pelo menos)
  useEffect(() => {
    if (!alvo.current) return
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.5 })
    io.observe(alvo.current)
    return () => io.disconnect()
  }, [alvo])

  // Com a aba escondida, a barrinha espera
  useEffect(() => {
    const aoMudar = () => setAbaAberta(!document.hidden)
    document.addEventListener('visibilitychange', aoMudar)
    return () => document.removeEventListener('visibilitychange', aoMudar)
  }, [])

  /** A barrinha do passo ativo existe (enchendo, ou parada na pausa): a demonstração está ligada e o movimento é permitido. */
  const barra = ligada && !poucoMovimento
  /** A demonstração está tocando: o botão mostra "Pausar". */
  const tocando = barra && !pausada
  /** A barrinha está enchendo agora. */
  const andando = tocando && naTela && abaAberta

  return {
    etapa,
    barra,
    tocando,
    andando,
    /** "Reduzir movimento" ligado: sem demonstração automática (e sem o botão de pausa). */
    poucoMovimento,
    /** A pessoa escolheu um passo: a demonstração para ali. */
    irPara(n: number) {
      setLigada(false)
      setPausada(false)
      setEtapa(n)
    },
    /** A pessoa mexeu nos ajustes: a demonstração para no passo em que está. */
    parar() {
      setLigada(false)
      setPausada(false)
    },
    /**
     * Pausar / Continuar / Ver de novo. Pausar congela a barrinha e Continuar segue de onde ela parou.
     * Depois de parada (passo escolhido ou ajuste), Continuar recomeça o passo; no último, volta ao primeiro.
     */
    alternar() {
      if (tocando) return setPausada(true)
      setPausada(false)
      if (barra) return
      if (etapa === total) setEtapa(1)
      setLigada(true)
    },
    /** A barrinha do passo ativo encheu: vai para o próximo; no último, a demonstração acaba. */
    aoTerminarBarra() {
      const proxima = proximaEtapa(etapa, total)
      if (proxima === null) return setLigada(false)
      setEtapa(proxima)
      if (proxima === total) setLigada(false)
    },
  }
}
