import { comoTrabalho, type Ajustes } from '../content/site.ts'
import { dominioDe, nomeDoNegocio } from '../lib/exemplo.ts'
import Icone from './Icone.tsx'

type Props = { passo: number; texto: string; ajustes: Ajustes }

const { janela } = comoTrabalho

/**
 * A janela de navegador do "Como trabalho", com o site de exemplo do visitante.
 * O que muda em cada passo (conversa, rascunho, ajustes, código, no ar) sai do CSS, pelos
 * atributos data-passo, data-cor, data-letra, data-cantos e data-fundo. É só ilustração:
 * o leitor de tela pula (o texto de cada passo, ao lado, já diz o que acontece).
 */
export default function Janela({ passo, texto, ajustes }: Props) {
  const { cor, letra, cantos, fundo } = ajustes
  const nome = nomeDoNegocio(texto)
  const temNome = texto.trim() !== ''
  const inicial = (Array.from(nome)[0] ?? 'S').toUpperCase()
  const endereco = passo === 1 ? 'about:blank' : passo < 5 ? 'localhost:5173' : dominioDe(texto)
  // o código do passo 4 mostra as quatro escolhas com os valores do conteúdo
  const valor = {
    cor: comoTrabalho.cores.find((c) => c.id === cor)?.valor,
    letra: comoTrabalho.letras.find((l) => l.id === letra)?.fonte,
    cantos: comoTrabalho.cantos.find((c) => c.id === cantos)?.valor,
    fundo: comoTrabalho.fundos.find((f) => f.id === fundo)?.valor,
  }

  return (
    // translate="no": o tradutor do navegador não mexe no nome do negócio, no código nem no endereço
    <div
      className="janela"
      data-passo={passo}
      data-cor={cor}
      data-letra={letra}
      data-cantos={cantos}
      data-fundo={fundo}
      data-ui
      aria-hidden="true"
      translate="no"
    >
      <div className="janela__barra">
        <span className="janela__pontos">
          <i />
          <i />
          <i />
        </span>
        <span className="janela__endereco">
          {passo === 5 && <Icone nome="cadeado" />}
          <span key={endereco}>{endereco}</span>
        </span>
      </div>

      <div className="janela__corpo">
        <div className="janela__conversa">
          <p className="balao balao--cliente">{temNome ? `${janela.conversa[0]}: ${nome}.` : `${janela.conversa[0]}.`}</p>
          <p className="balao balao--rafael">{janela.conversa[1]}</p>
        </div>

        {/* as escolhas vêm primeiro: no celular o código aparece cortado e é esta parte que fica à mostra */}
        <pre className="janela__codigo">
          <code>
            <span className="linha">
              <i>:root</i> {'{'}
            </span>
            <span className="linha">
              {'  '}
              <i>--cor:</i> <b>{valor.cor}</b>;
            </span>
            <span className="linha">
              {'  '}
              <i>--letra:</i> <b>"{valor.letra}"</b>;
            </span>
            <span className="linha">
              {'  '}
              <i>--cantos:</i> <b>{valor.cantos}</b>;
            </span>
            <span className="linha">
              {'  '}
              <i>--fundo:</i> <b>{valor.fundo}</b>;
            </span>
            <span className="linha">{'}'}</span>
            <span className="linha"> </span>
            <span className="linha">
              <i>&lt;header&gt;</i>
            </span>
            <span className="linha">
              {'  '}
              <i>&lt;h1&gt;</i>
              <b>{nome}</b>
              <i>&lt;/h1&gt;</i>
            </span>
            <span className="linha">
              {'  '}
              <i>&lt;a href=</i>
              <b>"https://wa.me/…"</b>
              <i>&gt;</i>
            </span>
            <span className="linha">
              {'    '}
              {janela.botao}
            </span>
            <span className="linha">
              {'  '}
              <i>&lt;/a&gt;</i>
            </span>
            <span className="linha">
              <i>&lt;/header&gt;</i>
            </span>
          </code>
        </pre>

        <div className="janela__pagina">
          <div className="ms">
            <div className="ms__topo">
              <span className="ms__marca">
                <b>{inicial}</b>
                <span>{nome}</span>
              </span>
              <span className="ms__menu">
                {janela.menu.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </span>
              <Icone nome="menu" className="ms__hamburguer" />
            </div>
            <div className="ms__capa">
              <div className="ms__chamada">
                <p className="ms__titulo">{nome}</p>
                <p className="ms__texto">{janela.texto}</p>
                <span className="ms__botao">{janela.botao}</span>
              </div>
              <div className="ms__imagem">
                <b>{inicial}</b>
                {/* no rascunho, o lugar da imagem é uma caixa com um X, como num esboço */}
                <svg className="ms__x" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 0 100 100M100 0 0 100" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
            <ul className="ms__cartoes">
              {janela.cartoes.map((c) => (
                <li key={c.titulo}>
                  <b>{c.titulo}</b>
                  <span>{c.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
