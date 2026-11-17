import { chamada, whatsapp } from '../content/site.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import Icone from './Icone.tsx'

/** O bloco roxo: uma pergunta direta e o botão que abre o WhatsApp. */
export default function Chamada() {
  return (
    <aside className="chamada" aria-label={chamada.acao} data-revelar>
      <span className="cruz" />
      <p className="chamada__texto" data-r>
        <span>{chamada.texto[0]}</span> <span>{chamada.texto[1]}</span>
      </p>
      <a className="botao botao--claro" href={linkWhatsApp(whatsapp.numero, whatsapp.mensagem)} data-r>
        {chamada.acao}
        <Icone nome="seta-direita" />
      </a>
    </aside>
  )
}
