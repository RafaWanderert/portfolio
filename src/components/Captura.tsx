import { useCallback, useEffect, useRef, useState } from 'react'
import type { Imagem } from '../content/projetos.ts'

/** Se a imagem não chegar (a rede oscilou), quantas vezes pedir de novo e quanto esperar antes. */
const NOVAS_TENTATIVAS = 3
const ESPERA_MS = 2000

/**
 * Captura de tela de um projeto. Com largura e altura declaradas, a página não "pula" quando
 * a imagem chega; "lazy" faz o navegador só baixar quando a pessoa está chegando perto.
 * "sizes" diz o tamanho em que a imagem aparece, para o navegador escolher o arquivo certo.
 *
 * O navegador não pede de novo uma imagem que falhou: sem isto, o quadro ficava escuro até
 * recarregar a página. Uma <img> nova (a "key" muda) faz um pedido novo, no mesmo endereço,
 * e o cache de um ano dos arquivos continua valendo.
 */
export default function Captura({ imagem, sizes }: { imagem: Imagem; sizes: string }) {
  const [tentativa, setTentativa] = useState(0)
  const img = useRef<HTMLImageElement>(null)
  const relogio = useRef<number | undefined>(undefined)

  const falhou = useCallback(() => {
    if (relogio.current !== undefined || tentativa >= NOVAS_TENTATIVAS) return
    relogio.current = window.setTimeout(() => {
      relogio.current = undefined
      setTentativa((t) => t + 1)
    }, ESPERA_MS)
  }, [tentativa])

  // A imagem do HTML pré-renderizado pode falhar antes de o React chegar, e aí o onError não vem:
  // "complete" com largura 0 é imagem quebrada (uma "lazy" que ainda não começou não está "complete").
  useEffect(() => {
    const i = img.current
    if (i?.complete && i.naturalWidth === 0) falhou()
  }, [falhou])

  useEffect(() => () => window.clearTimeout(relogio.current), [])

  return (
    <img
      key={tentativa}
      ref={img}
      src={imagem.src}
      srcSet={imagem.srcSet}
      sizes={sizes}
      width={imagem.largura}
      height={imagem.altura}
      alt={imagem.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={falhou}
    />
  )
}
