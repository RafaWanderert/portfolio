import { useId } from 'react'

/**
 * Saturno em vetor, redesenhado da imagem do Rafa (24/11/2026): planeta, anel e uma folga escura
 * onde o anel passa na frente e atrás do planeta. É só enfeite (aria-hidden). O movimento é do CSS:
 * o corpo flutua e o anel balança; com "reduzir movimento", fica parado.
 * Os ids dos recortes vêm de useId para nunca se repetirem na página.
 */
export default function Saturno() {
  const id = useId()
  const cima = `${id}-cima`
  const baixo = `${id}-baixo`
  const perto = `${id}-perto`
  const anel = { rx: 200, ry: 52, fill: 'none' } as const
  return (
    <svg className="saturno" viewBox="-230 -150 460 300" aria-hidden="true" focusable="false">
      <defs>
        {/* a metade de trás passa 3 unidades do meio, para as duas metades se encostarem sem risco */}
        <clipPath id={cima}>
          <rect x="-400" y="-400" width="800" height="403" />
        </clipPath>
        <clipPath id={baixo}>
          <rect x="-400" y="0" width="800" height="400" />
        </clipPath>
        <clipPath id={perto}>
          <circle r="124" />
        </clipPath>
      </defs>
      <g className="saturno__corpo">
        <g transform="rotate(-20)">
          <g className="saturno__anel">
            {/* metade de trás do anel: o planeta passa por cima */}
            <ellipse {...anel} className="saturno__tinta" strokeWidth="20" clipPath={`url(#${cima})`} />
            {/* o planeta, com uma folga escura em volta onde o anel passa atrás */}
            <circle r="108" className="saturno__planeta" strokeWidth="12" />
            {/* a folga escura e a metade da frente do anel */}
            <g clipPath={`url(#${baixo})`}>
              <ellipse {...anel} className="saturno__folga" strokeWidth="40" clipPath={`url(#${perto})`} />
            </g>
            <ellipse {...anel} className="saturno__tinta" strokeWidth="20" clipPath={`url(#${baixo})`} />
          </g>
        </g>
      </g>
    </svg>
  )
}
