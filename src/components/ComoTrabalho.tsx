import { useEffect, useId, useRef, useState } from 'react'
import { comoTrabalho, whatsapp, type Ajustes } from '../content/site.ts'
import { useDemonstracao } from '../hooks/useDemonstracao.ts'
import { mensagemPedido, pendentes } from '../lib/exemplo.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import Icone from './Icone.tsx'
import Janela from './Janela.tsx'

const dois = (n: number) => String(n).padStart(2, '0')
const total = comoTrabalho.passos.length

/**
 * O passo 3 sem escolha da pessoa: os ajustes acontecendo, um de cada vez (ms desde o começo do passo).
 * A barrinha do passo 3 dura 6 s (src/index.css), o tempo de as quatro trocas aparecerem.
 */
const roteiro: readonly { em: number; muda: Partial<Ajustes> }[] = [
  { em: 900, muda: { cor: 'cafe' } },
  { em: 2000, muda: { letra: 'classica' } },
  { em: 3100, muda: { cantos: 'redondos' } },
  { em: 4200, muda: { fundo: 'creme' } },
]

type Escolher = <K extends keyof Ajustes>(campo: K, valor: Ajustes[K]) => void

/**
 * Um grupo de ajustes (cor, letra, cantos ou fundo). Cada grupo é um conjunto de rádios com nome próprio:
 * Tab passa de um grupo ao outro e as setas andam dentro dele. Cor, cantos e fundo são amostras
 * desenhadas (o nome fica para o leitor de tela); a letra mostra o nome escrito na própria letra.
 */
function Ajuste<K extends keyof Ajustes>({
  campo,
  opcoes,
  valor,
  grupo,
  escolher,
}: {
  campo: K
  opcoes: { id: Ajustes[K]; nome: string }[]
  valor: Ajustes[K]
  grupo: string
  escolher: Escolher
}) {
  const amostra = campo !== 'letra'
  return (
    <fieldset className={`ajuste ajuste--${campo}`}>
      <legend>{comoTrabalho.rotulos[campo]}</legend>
      <div className="ajuste__opcoes">
        {opcoes.map((o) => {
          // data-cor, data-letra, data-cantos ou data-fundo: o CSS desenha a amostra por ele
          const dado = { [`data-${campo}`]: o.id } as Record<`data-${string}`, string>
          return (
            <label key={o.id} className={amostra ? 'amostra' : 'opcao'} {...dado}>
              <input
                type="radio"
                name={`${grupo}-${campo}`}
                value={o.id}
                checked={valor === o.id}
                onChange={() => escolher(campo, o.id)}
              />
              <span className={amostra ? 'so-leitor' : undefined}>{o.nome}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/**
 * "Como trabalho": o visitante escreve o nome do negócio e vê um site de exemplo nascer
 * nos cinco passos. A demonstração anda sozinha quando a janela aparece (veja useDemonstracao);
 * clicar num passo ou mexer nos ajustes faz ela parar ali. O botão leva ao WhatsApp
 * com o nome do negócio na mensagem.
 */
export default function ComoTrabalho() {
  const vitrine = useRef<HTMLDivElement>(null)
  const d = useDemonstracao(total, vitrine)
  const [texto, setTexto] = useState('')
  const [ajustes, setAjustes] = useState<Ajustes>(comoTrabalho.padrao)
  /** A pessoa já escolheu algum ajuste: a demonstração não mexe mais neles. */
  const escolheu = useRef(false)
  /** Quanto do roteiro do passo 3 já tocou: a pausa guarda; trocar de passo ou a barrinha recomeçar zera. */
  const decorrido = useRef(0)
  const id = useId()

  // Precisa vir antes do efeito do roteiro: o roteiro começa do zero junto com a barrinha
  // (ao entrar num passo, ou quando a demonstração volta a andar depois de parada)
  useEffect(() => {
    decorrido.current = 0
  }, [d.etapa, d.barra])

  // Sem escolha da pessoa, o passo 3 mostra os ajustes acontecendo, um de cada vez.
  // Pausar no meio e continuar não perde o compasso: as trocas que faltam esperam só o tempo que falta.
  useEffect(() => {
    if (d.etapa !== 3 || !d.andando || escolheu.current) return
    const inicio = performance.now() - decorrido.current
    const ids = pendentes(roteiro, decorrido.current).map(({ espera, muda }) =>
      window.setTimeout(() => setAjustes((a) => ({ ...a, ...muda })), espera),
    )
    return () => {
      decorrido.current = performance.now() - inicio
      ids.forEach((i) => window.clearTimeout(i))
    }
  }, [d.etapa, d.andando])

  // Ao recomeçar ("Ver de novo"), a janela volta ao visual do início para os ajustes acontecerem de novo
  useEffect(() => {
    if (d.etapa !== 1 || escolheu.current) return
    setAjustes(comoTrabalho.padrao)
  }, [d.etapa])

  /** A pessoa escolheu um ajuste: antes do passo 3 a página ainda não tem cor, então vai para ele. */
  const escolher: Escolher = (campo, valor) => {
    escolheu.current = true
    if (d.etapa < 3) d.irPara(3)
    else d.parar()
    setAjustes((a) => ({ ...a, [campo]: valor }))
  }

  const pausa = d.tocando
    ? { icone: 'pausa' as const, texto: comoTrabalho.pausa.pausar }
    : { icone: 'tocar' as const, texto: d.etapa === total ? comoTrabalho.pausa.deNovo : comoTrabalho.pausa.continuar }

  return (
    <section id="como-trabalho" className="estudio" aria-labelledby="processo-titulo" data-revelar>
      <span className="cruz" />
      <span className="cruz" />

      <div className="estudio__cabeca">
        <p className="comentario" data-r>
          // como trabalho
        </p>
        <h2 id="processo-titulo" className="titulo" data-r>
          {comoTrabalho.titulo}
        </h2>
        <p className="estudio__texto" data-r>
          {comoTrabalho.texto}
        </p>
        <div className="campo" data-r>
          <label htmlFor={`${id}-nome`}>{comoTrabalho.campo.rotulo}</label>
          <input
            id={`${id}-nome`}
            name="negocio"
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={comoTrabalho.campo.max}
            placeholder={comoTrabalho.campo.exemplo}
            autoComplete="organization"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="done"
          />
        </div>
      </div>

      <div ref={vitrine} className="estudio__janela" data-r>
        <Janela passo={d.etapa} texto={texto} ajustes={ajustes} />
        {/* os ajustes e a pausa ficam sempre no mesmo lugar, logo embaixo da janela que eles controlam */}
        <div className="estudio__controles">
          <Ajuste campo="cor" opcoes={comoTrabalho.cores} valor={ajustes.cor} grupo={id} escolher={escolher} />
          <Ajuste campo="letra" opcoes={comoTrabalho.letras} valor={ajustes.letra} grupo={id} escolher={escolher} />
          <Ajuste campo="cantos" opcoes={comoTrabalho.cantos} valor={ajustes.cantos} grupo={id} escolher={escolher} />
          <Ajuste campo="fundo" opcoes={comoTrabalho.fundos} valor={ajustes.fundo} grupo={id} escolher={escolher} />
          {!d.poucoMovimento && (
            <button type="button" className="estudio__pausa" onClick={d.alternar}>
              <Icone nome={pausa.icone} />
              {pausa.texto}
            </button>
          )}
        </div>
        <p className="estudio__aviso">{comoTrabalho.aviso}</p>
      </div>

      <div className="estudio__passos">
        <ol className="etapas" data-andando={d.andando} data-r>
          {comoTrabalho.passos.map((p, i) => {
            const n = i + 1
            const ativa = n === d.etapa
            return (
              <li key={p.titulo} className={ativa ? 'etapa etapa--ativa' : 'etapa'}>
                <button
                  type="button"
                  className="etapa__botao"
                  aria-current={ativa ? 'step' : undefined}
                  data-etapa={n}
                  aria-expanded={ativa}
                  aria-controls={`${id}-passo-${n}`}
                  onClick={() => d.irPara(n)}
                >
                  {/* a lista já é numerada para o leitor de tela: o número grande é só visual */}
                  <span className="etapa__numero" aria-hidden="true">
                    {dois(n)}
                  </span>
                  <span className="etapa__titulo">{p.titulo}</span>
                  {/* na pausa a barrinha continua ali, parada: Continuar segue de onde ela estava */}
                  {ativa && d.barra && n < total && (
                    <span className="etapa__barra" aria-hidden="true" onAnimationEnd={d.aoTerminarBarra} />
                  )}
                </button>
                <div id={`${id}-passo-${n}`} className="etapa__corpo">
                  <div>
                    <p>{p.texto}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="estudio__acoes" data-r>
          <a
            className="botao"
            href={linkWhatsApp(whatsapp.numero, mensagemPedido(texto, whatsapp.mensagem))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {comoTrabalho.acao}
            <span className="so-leitor"> (abre em nova aba)</span>
            <Icone nome="seta-direita" />
          </a>
        </div>
      </div>
    </section>
  )
}
