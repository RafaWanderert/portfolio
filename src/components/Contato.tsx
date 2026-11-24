import { contato, contatos, site } from '../content/site.ts'
import Icone from './Icone.tsx'

/** Contato: o título (do tamanho dos outros) e uma linha para cada canal. O e-mail abre no programa de e-mail; os outros, em nova aba. */
export default function Contato() {
  return (
    <section id="contato" className="contato" aria-labelledby="contato-titulo" data-revelar>
      <span className="cruz" />
      <span className="cruz" />
      <p className="comentario" data-r>
        // contato
      </p>
      <h2 id="contato-titulo" className="titulo" data-r>
        <span>{contato.titulo[0]}</span> <span>{contato.titulo[1]}</span>
      </h2>
      <div className="contato__corpo">
        <p className="contato__texto" data-r>
          {contato.texto}
        </p>
        <ul className="contato__lista">
          {contatos.map((c) => {
            const fora = c.id !== 'email'
            return (
              <li key={c.id} data-r>
                <a
                  className="contato__linha"
                  href={c.href}
                  target={fora ? '_blank' : undefined}
                  rel={fora ? 'noopener noreferrer' : undefined}
                >
                  <span className="contato__icone">
                    <Icone nome={c.id} />
                  </span>
                  <span className="contato__rotulo mono">{c.rotulo}</span>
                  <span className="contato__valor" translate="no">
                    {c.texto}
                  </span>
                  <Icone nome="seta-fora" className="contato__seta" />
                  {fora && <span className="so-leitor"> (abre em nova aba)</span>}
                </a>
              </li>
            )
          })}
          <li data-r>
            <p className="contato__linha">
              <span className="contato__icone">
                <Icone nome="local" />
              </span>
              <span className="contato__rotulo mono">Cidade</span>
              <span className="contato__valor">{site.cidade}</span>
            </p>
          </li>
        </ul>
      </div>
    </section>
  )
}
