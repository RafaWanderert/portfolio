import { rodape } from '../content/site.ts'
import Icone from './Icone.tsx'

/** Rodapé leve: o ano e o nome, o código do site (quando o repositório existir) e a volta ao topo. */
export default function Rodape() {
  return (
    <footer className="rodape">
      <p className="mono">{rodape.direitos}</p>
      {rodape.codigo && (
        <a className="mono" href={rodape.codigo} target="_blank" rel="noopener noreferrer">
          {rodape.textoCodigo}
          <Icone nome="seta-fora" />
          <span className="so-leitor"> (abre em nova aba)</span>
        </a>
      )}
      <a className="mono" href="#inicio">
        {rodape.topo}
        <Icone nome="seta-cima" />
      </a>
    </footer>
  )
}
