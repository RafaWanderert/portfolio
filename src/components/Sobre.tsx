import { sobre } from '../content/site.ts'

/** Sobre: o texto do Rafa em destaque, uma segunda frase e a formação. Sem foto por enquanto. */
export default function Sobre() {
  const { formacao } = sobre
  return (
    <section id="sobre" className="sobre" aria-labelledby="sobre-titulo" data-revelar>
      <p className="comentario" data-r>
        // sobre
      </p>
      <h2 id="sobre-titulo" className="titulo" data-r>
        {sobre.titulo}
      </h2>
      <p className="sobre__destaque" data-r>
        {sobre.paragrafos[0]}
      </p>
      <p className="sobre__texto" data-r>
        {sobre.paragrafos[1]}
      </p>
      <dl className="sobre__formacao" data-r>
        <dt className="mono">{formacao.rotulo}</dt>
        <dd>
          <b>{formacao.curso}</b>
          <span>
            {formacao.escola} · {formacao.periodo}
          </span>
        </dd>
      </dl>
    </section>
  )
}
