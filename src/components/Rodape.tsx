import { rodape } from '../content/site.ts'
import Icone from './Icone.tsx'

/** Rodapé leve: o ano e o nome, e a volta ao topo. */
export default function Rodape() {
  return (
    <footer className="rodape">
      <p className="mono">{rodape.direitos}</p>
      <a className="mono" href="#inicio">
        {rodape.topo}
        <Icone nome="seta-cima" />
      </a>
    </footer>
  )
}
