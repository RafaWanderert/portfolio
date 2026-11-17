import { useLayoutEffect, useRef, type KeyboardEvent, type RefObject } from 'react'
import { idiomas } from '../content/idiomas.ts'
import { useDecodificar } from '../hooks/useDecodificar.ts'

/**
 * O texto gigante do fundo ("desenvolvedor de software") e os códigos dos idiomas.
 * - O texto é enfeite: o leitor de tela não lê (aria-hidden).
 * - Os códigos mostram o idioma atual. Clicar num deles fixa o idioma e pausa a troca;
 *   clicar de novo no mesmo volta a alternar. É a "pausa" de quem prefere o fundo parado.
 */
export default function FundoIdiomas({ alvo }: { alvo: RefObject<HTMLElement | null> }) {
  const { indice, fixo, linhas, escolher } = useDecodificar(alvo)
  const idioma = idiomas[indice]
  const texto = useRef<HTMLParagraphElement>(null)
  const botoes = useRef<(HTMLButtonElement | null)[]>([])

  // A largura de cada frase muda com o idioma: o CSS calcula o tamanho da letra a partir de --l.
  // Vai por JavaScript porque a CSP não aceita style="..." no HTML.
  useLayoutEffect(() => {
    texto.current?.style.setProperty('--l', String(idioma.largura))
    texto.current?.style.setProperty('--k', String(idioma.escala ?? 1))
  }, [idioma])

  // Os 9 códigos são uma parada de Tab só: dentro do grupo, as setas andam de um para o outro.
  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const atual = botoes.current.findIndex((b) => b === document.activeElement)
    if (atual < 0) return
    const destino = {
      ArrowRight: (atual + 1) % idiomas.length,
      ArrowLeft: (atual - 1 + idiomas.length) % idiomas.length,
      Home: 0,
      End: idiomas.length - 1,
    }[e.key]
    if (destino === undefined) return
    e.preventDefault() // avisa a fita de projetos que esta seta já teve dono
    botoes.current[destino]?.focus()
  }

  return (
    <>
      <div className="fundo" aria-hidden="true">
        <p ref={texto} className={`fundo__texto f-${idioma.fonte}`} lang={idioma.lang} translate="no">
          <span>{linhas[0]}</span>
          <span>{linhas[1]}</span>
        </p>
      </div>
      <div className="idiomas" role="group" aria-label="Idioma do texto de fundo" onKeyDown={aoTeclar}>
        {idiomas.map((i, k) => (
          <button
            key={i.codigo}
            ref={(b) => {
              botoes.current[k] = b
            }}
            type="button"
            className={k === indice ? 'idiomas__codigo idiomas__codigo--atual' : 'idiomas__codigo'}
            aria-label={`${i.codigo}: ${i.nome}`}
            aria-pressed={fixo && k === indice}
            tabIndex={k === indice ? 0 : -1}
            translate="no"
            onClick={() => escolher(k)}
          >
            {i.codigo}
          </button>
        ))}
      </div>
    </>
  )
}
