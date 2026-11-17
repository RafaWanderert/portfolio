import { habilidades } from '../content/site.ts'

/** As tecnologias usadas nos projetos, em quatro grupos. Sem barras de nível nem porcentagem. */
export default function Habilidades() {
  return (
    <section id="habilidades" className="habilidades" aria-labelledby="habilidades-titulo" data-revelar>
      <p className="comentario" data-r>
        // habilidades
      </p>
      <h2 id="habilidades-titulo" className="titulo" data-r>
        {habilidades.titulo}
      </h2>
      <div className="habilidades__lista">
        {habilidades.grupos.map((g) => (
          <div key={g.grupo} className="habilidades__grupo" data-r>
            <h3 className="mono">{g.grupo}</h3>
            <ul className="etiquetas">
              {g.itens.map((item) => (
                <li key={item} translate="no">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
