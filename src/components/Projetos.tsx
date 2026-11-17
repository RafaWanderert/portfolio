import { useRef } from 'react'
import { projetos } from '../content/projetos.ts'
import { useFita } from '../hooks/useFita.ts'
import { janela, volta } from '../lib/fita.ts'
import Cartao from './Cartao.tsx'
import Ficha from './Ficha.tsx'
import Icone from './Icone.tsx'

const dois = (n: number) => String(n).padStart(2, '0')

/**
 * Projetos selecionados: uma fita que passa sozinha, com a ficha do projeto ativo embaixo.
 * Sem JavaScript, os projetos aparecem um embaixo do outro, cada um com a sua ficha (veja o CSS).
 */
export default function Projetos() {
  const fita = useRef<HTMLDivElement>(null)
  const trilho = useRef<HTMLOListElement>(null)
  const f = useFita(fita, trilho)
  const total = projetos.length
  const indice = volta(f.ativo, total)

  // Depois de montar, a fita desenha 3 posições de cada lado do ativo: assim sempre há cartão
  // dos dois lados e os que entram e saem ficam fora da tela. Antes disso, vale a ordem do servidor.
  const posicoes = f.montada ? janela(f.ativo, total, 3) : projetos.map((_, i) => ({ v: i, projeto: i }))

  return (
    <section
      id="projetos"
      className="projetos"
      aria-labelledby="projetos-titulo"
      aria-roledescription="carrossel"
      {...f.naSecao}
    >
      <div className="projetos__topo">
        <div>
          <p className="comentario">// projetos</p>
          <h2 id="projetos-titulo" className="titulo">
            Projetos selecionados
          </h2>
        </div>
        <span className="regua" aria-hidden="true" />
        <p className="projetos__dica mono">
          Arraste ou use
          <Icone nome="seta-esquerda" />
          <Icone nome="seta-direita" />
        </p>
      </div>

      <div ref={fita} className={f.arrastando ? 'fita fita--arrastando' : 'fita'} {...f.naFita}>
        <ol ref={trilho} className="fita__trilho">
          {posicoes.map(({ v, projeto }) => {
            const distancia = v - f.ativo
            return (
              <Cartao
                key={v}
                projeto={projetos[projeto]}
                numero={projeto + 1}
                v={f.montada ? v : undefined}
                ativo={v === f.ativo}
                // cada projeto aparece uma vez só para o teclado e o leitor de tela:
                // o vizinho da esquerda, o ativo e os seguintes, até completar a lista
                copia={f.montada && (distancia < -1 || distancia > total - 2)}
                aoEscolher={() => f.ir(v)}
              />
            )
          })}
        </ol>
      </div>

      <div className="controles">
        <button type="button" className="controles__botao" aria-label="Projeto anterior" onClick={f.anterior}>
          <Icone nome="seta-esquerda" />
        </button>
        <p className="controles__conta mono">
          <span aria-hidden="true">
            {dois(indice + 1)} / {dois(total)}
          </span>
          <span className="so-leitor">
            Projeto {indice + 1} de {total}
          </span>
        </p>
        <span className="controles__progresso" aria-hidden="true">
          {/* key: a cada projeto a linha nasce de novo e recomeça a encher */}
          <i
            key={f.ativo}
            className={f.montada && !f.poucoMovimento ? (f.rodando ? 'cheia' : 'cheia parada') : undefined}
            onAnimationEnd={f.aoTerminarProgresso}
          />
        </span>
        <button
          type="button"
          className="controles__botao controles__pausa"
          aria-label="Pausar a troca automática de projetos"
          aria-pressed={f.pausada}
          onClick={f.alternarPausa}
        >
          <Icone nome={f.pausada ? 'tocar' : 'pausa'} />
        </button>
        <button type="button" className="controles__botao" aria-label="Próximo projeto" onClick={f.proximo}>
          <Icone nome="seta-direita" />
        </button>
      </div>

      {/* Com a fita parada, o leitor de tela anuncia a ficha nova; rodando sozinha, não interrompe */}
      <div className="fichas" aria-live={f.rodando ? 'off' : 'polite'}>
        {projetos.map((p, i) => (
          <Ficha key={p.id} projeto={p} ativa={i === indice} aoTocarVideo={f.aoTocarVideo} />
        ))}
      </div>
    </section>
  )
}
