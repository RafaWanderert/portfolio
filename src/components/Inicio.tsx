import { useRef } from 'react'
import { fatos, inicio, whatsapp } from '../content/site.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import FundoIdiomas from './FundoIdiomas.tsx'
import Icone from './Icone.tsx'

const links = [
  { href: '#projetos', nome: 'projetos' },
  { href: '#sobre', nome: 'sobre' },
  { href: '#contato', nome: 'contato' },
]

/**
 * Primeira tela: quem é o Rafael, o que ele faz e os dois caminhos (pedir um site ou ver os projetos).
 * O centro fica livre de propósito: é o lugar da foto, quando houver.
 */
export default function Inicio() {
  const tela = useRef<HTMLElement>(null)
  return (
    <header className="inicio" id="inicio" ref={tela}>
      <div className="inicio__alto mono">
        <p className="inicio__rotulo">
          <b>{inicio.rotulo[0]}</b>
          <br />
          {inicio.rotulo[1]}
        </p>
        <div className="inicio__direita">
          <nav className="inicio__links" aria-label="Seções">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.nome}
              </a>
            ))}
          </nav>
          <p className="inicio__disponivel">
            {inicio.disponivel}
            <Icone nome="estrela" />
          </p>
        </div>
        <span className="cruz" />
        <span className="cruz" />
      </div>

      <FundoIdiomas alvo={tela} />

      <div className="inicio__corpo">
        <div className="inicio__id">
          <p className="comentario">{inicio.ola}</p>
          <h1 className="inicio__nome">
            <span>{inicio.nome[0]}</span> <span>{inicio.nome[1]}</span>
          </h1>
          <p className="inicio__papel">{inicio.papel}</p>
          <p className="inicio__texto">{inicio.texto}</p>
          <div className="inicio__acoes">
            <a
              className="botao"
              href={linkWhatsApp(whatsapp.numero, whatsapp.mensagem)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {inicio.acao}
              <span className="so-leitor"> (abre em nova aba)</span>
              <Icone nome="seta-direita" />
            </a>
            <a className="link-seta" href="#projetos">
              {inicio.verProjetos}
              <Icone nome="seta-baixo" />
            </a>
          </div>
          <p className="inicio__local mono">{inicio.local}</p>
        </div>

        <p className="inicio__nota mono">
          <Icone nome="mais" />
          <span>
            {inicio.nota[0]}
            <br />
            {inicio.nota[1]}
          </span>
        </p>

        <ul className="fatos">
          {fatos.map((f) => (
            <li key={f.rotulo.join(' ')}>
              <b>{f.valor}</b>
              <span className="mono">
                {f.rotulo[0]}
                <br />
                {f.rotulo[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
