import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Projeto } from '../content/projetos.ts'
import Captura from './Captura.tsx'
import Icone from './Icone.tsx'

/** Link que abre fora do site, em outra aba (o portfólio continua aberto). */
function LinkFora({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="link-seta link-seta--fora" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <Icone nome="seta-fora" />
      <span className="so-leitor"> (abre em nova aba)</span>
    </a>
  )
}

type DemoProps = {
  video: NonNullable<Projeto['video']>
  nome: string
  ativa: boolean
  aoTocar: (tocando: boolean) => void
}

/**
 * Vídeo curto de demonstração, no lugar da captura de celular.
 * O vídeo só entra na página depois do clique: quem não assiste não baixa nada.
 * (O arquivo original tem a tela do app só no quarto de cima, à esquerda; o CSS mostra só esse
 * pedaço. Por isso os controles são os nossos, e não os do navegador.)
 */
function Demo({ video, nome, ativa, aoTocar }: DemoProps) {
  const [estado, setEstado] = useState<'parado' | 'tocando' | 'pausado'>('parado')
  const tela = useRef<HTMLVideoElement>(null)

  // Saiu deste projeto: o vídeo para e sai da página
  useEffect(() => {
    if (!ativa) setEstado('parado')
  }, [ativa])

  // Enquanto o vídeo toca, a fita não avança sozinha
  useEffect(() => {
    aoTocar(estado === 'tocando')
    return () => aoTocar(false)
  }, [estado, aoTocar])

  const alternar = () => {
    if (estado === 'parado') setEstado('tocando')
    else if (estado === 'tocando') tela.current?.pause()
    else void tela.current?.play()
  }

  return (
    <figure className="demo">
      <div className="celular">
        <Captura imagem={video.capa} sizes="190px" />
        {estado !== 'parado' && (
          <video
            ref={tela}
            className="demo__video"
            src={video.src}
            autoPlay
            muted
            playsInline
            aria-label={`Demonstração do app ${nome}`}
            onPlay={() => setEstado('tocando')}
            onPause={() => setEstado((e) => (e === 'parado' ? e : 'pausado'))}
            onEnded={() => setEstado('parado')}
          />
        )}
      </div>
      <button type="button" className="demo__botao" onClick={alternar}>
        <Icone nome={estado === 'tocando' ? 'pausa' : 'tocar'} />
        {{ parado: 'Ver a demonstração', tocando: 'Pausar', pausado: 'Continuar' }[estado]}
      </button>
      <figcaption className="demo__legenda">{video.legenda}</figcaption>
    </figure>
  )
}

type Props = {
  projeto: Projeto
  ativa: boolean
  aoTocarVideo: (tocando: boolean) => void
}

/**
 * A ficha de um projeto: o problema, o que foi feito, as tecnologias e os links.
 * As 4 fichas ficam na página; com JavaScript, só a do cartão ativo aparece.
 */
export default function Ficha({ projeto: p, ativa, aoTocarVideo }: Props) {
  const titulo = `ficha-${p.id}-titulo`
  return (
    <article id={`ficha-${p.id}`} className={ativa ? 'ficha ficha--ativa' : 'ficha'} aria-labelledby={titulo}>
      <h3 id={titulo} className="so-leitor">
        {p.nome}: {p.tipo}
      </h3>

      <div className="ficha__texto">
        <p className="ficha__selo mono">{p.selo}</p>
        <h4 className="mono">O problema</h4>
        <p>{p.problema}</p>
        <h4 className="mono">O que eu fiz</h4>
        <p>{p.feito}</p>
        {p.aviso && <p className="ficha__aviso">{p.aviso}</p>}
      </div>

      <div className="ficha__lado">
        <h4 className="mono">Tecnologias</h4>
        <ul className="etiquetas">
          {p.tecnologias.map((t) => (
            <li key={t} translate="no">
              {t}
            </li>
          ))}
        </ul>
        <div className="ficha__links">
          {p.site ? <LinkFora href={p.site}>Ver o site</LinkFora> : <p className="ficha__sem">{p.semSite}</p>}
          {p.codigo ? <LinkFora href={p.codigo}>Ver o código</LinkFora> : <p className="ficha__sem">{p.semCodigo}</p>}
        </div>
      </div>

      <div className="ficha__celular">
        {p.video ? (
          <Demo video={p.video} nome={p.nome} ativa={ativa} aoTocar={aoTocarVideo} />
        ) : (
          p.celular && (
            <div className="celular">
              <Captura imagem={p.celular} sizes="190px" />
            </div>
          )
        )}
      </div>
    </article>
  )
}
