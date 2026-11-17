import { comoTrabalho } from '../content/site.ts'
import Icone from './Icone.tsx'

const dois = (n: number) => String(n).padStart(2, '0')

/** Os cinco passos de um projeto, na ordem em que acontecem, com uma linha ligando os ícones. */
export default function ComoTrabalho() {
  return (
    <section id="como-trabalho" className="processo" aria-labelledby="processo-titulo" data-revelar>
      <p className="comentario" data-r>
        // como trabalho
      </p>
      <h2 id="processo-titulo" className="titulo" data-r>
        {comoTrabalho.titulo}
      </h2>
      <ol className="passos">
        {comoTrabalho.passos.map((p, i) => (
          <li key={p.titulo} data-r>
            {/* a lista já é numerada para o leitor de tela: o número grande é só visual */}
            <span className="passos__numero" aria-hidden="true">
              {dois(i + 1)}
            </span>
            <span className="passos__icone">
              <Icone nome={p.icone} />
            </span>
            <div>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
