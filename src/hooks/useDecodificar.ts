import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { idiomas } from '../content/idiomas.ts'
import { DURACAO_MS, PASSO_MS, TROCA_MS, fundoRoda, quadro } from '../lib/decodificar.ts'
import { usePoucoMovimento } from './usePoucoMovimento.ts'

// As três fontes recortadas (japonês, coreano e russo) são carregadas antes de o fundo começar
// a alternar: assim nenhuma frase aparece, nem por um instante, numa letra errada.
const fontesDoFundo: [string, string][] = [
  ['900 1em "Noto Sans JP Recorte"', 'ソ'],
  ['400 1em "Black Han Sans Recorte"', '소'],
  ['900 1em "Sofia Sans XC Recorte"', 'Р'],
]

/**
 * Faz o texto de fundo alternar entre os idiomas com o efeito de decodificar.
 * "alvo" é a primeira tela: quando ela sai da vista, a troca para (não gasta bateria à toa).
 */
export function useDecodificar(alvo: RefObject<HTMLElement | null>) {
  const poucoMovimento = usePoucoMovimento()
  const [indice, setIndice] = useState(0)
  const [fixo, setFixo] = useState(false)
  const [linhas, setLinhas] = useState<readonly string[]>(idiomas[0].linhas)
  const [naTela, setNaTela] = useState(true)
  const [abaVisivel, setAbaVisivel] = useState(true)
  const [fontesProntas, setFontesProntas] = useState(false)

  // A primeira tela está à vista?
  useEffect(() => {
    if (!alvo.current) return
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting))
    io.observe(alvo.current)
    return () => io.disconnect()
  }, [alvo])

  // A aba do navegador está aberta?
  useEffect(() => {
    const aoMudar = () => setAbaVisivel(!document.hidden)
    aoMudar()
    document.addEventListener('visibilitychange', aoMudar)
    return () => document.removeEventListener('visibilitychange', aoMudar)
  }, [])

  // Espera as fontes do fundo (no máximo 3 s: se a rede falhar, segue com a fonte reserva)
  useEffect(() => {
    let vivo = true
    const pronto = () => vivo && setFontesProntas(true)
    const limite = window.setTimeout(pronto, 3000)
    Promise.allSettled(fontesDoFundo.map(([fonte, letra]) => document.fonts.load(fonte, letra))).then(pronto)
    return () => {
      vivo = false
      window.clearTimeout(limite)
    }
  }, [])

  // Passa para o próximo idioma de tempos em tempos
  const rodando = fontesProntas && fundoRoda({ naTela, abaVisivel, fixo, poucoMovimento })
  useEffect(() => {
    if (!rodando) return
    const id = window.setInterval(() => setIndice((i) => (i + 1) % idiomas.length), TROCA_MS)
    return () => window.clearInterval(id)
  }, [rodando])

  // A cada troca de idioma, embaralha as letras e resolve da esquerda para a direita
  const anterior = useRef(indice)
  useEffect(() => {
    if (anterior.current === indice) return
    anterior.current = indice
    const finais = idiomas[indice].linhas
    if (poucoMovimento) {
      setLinhas(finais)
      return
    }
    const inicio = performance.now()
    setLinhas(quadro(finais, 0))
    const id = window.setInterval(() => {
      const progresso = (performance.now() - inicio) / DURACAO_MS
      setLinhas(quadro(finais, progresso))
      if (progresso >= 1) window.clearInterval(id)
    }, PASSO_MS)
    return () => window.clearInterval(id)
  }, [indice, poucoMovimento])

  /** Clicar num código fixa aquele idioma. Clicar de novo no mesmo código volta a alternar. */
  const escolher = useCallback(
    (i: number) => {
      if (fixo && i === indice) {
        setFixo(false)
        return
      }
      setFixo(true)
      setIndice(i)
    },
    [fixo, indice],
  )

  return { indice, fixo, linhas, escolher }
}
