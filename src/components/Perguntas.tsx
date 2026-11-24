import { perguntas } from '../content/site.ts'
import Saturno from './Saturno.tsx'

/**
 * Perguntas frequentes: o que o comerciante pergunta antes de pedir um site (prazo, preço, domínio...).
 * Cada pergunta é um <details> do navegador: abre com clique, Enter ou espaço, sem JavaScript.
 */
export default function Perguntas() {
  return (
    <section id="perguntas" className="perguntas" aria-labelledby="perguntas-titulo" data-revelar>
      <span className="cruz" />
      <span className="cruz" />
      <div className="perguntas__cabeca">
        <p className="comentario" data-r>
          // perguntas
        </p>
        <h2 id="perguntas-titulo" className="titulo" data-r>
          {perguntas.titulo}
        </h2>
        {/* enfeite na coluna vazia (só no computador) */}
        <Saturno />
      </div>
      <div className="perguntas__lista" data-r>
        {perguntas.itens.map((item) => (
          <details key={item.pergunta} className="pergunta">
            <summary>
              {item.pergunta}
              {/* o + vira − ao abrir (desenhado no CSS) */}
              <span className="pergunta__sinal" aria-hidden="true" />
            </summary>
            <div className="pergunta__resposta">
              <p>{item.resposta}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
