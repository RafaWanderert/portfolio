import { useLayoutEffect, useRef } from 'react'
import type { Projeto } from '../content/projetos.ts'
import Captura from './Captura.tsx'
import Icone from './Icone.tsx'

type Props = {
  projeto: Projeto
  /** 1, 2, 3... na ordem da fita. */
  numero: number
  /** Posição virtual na fita. Sem ela (HTML do servidor), o CSS usa a ordem dos cartões. */
  v?: number
  ativo: boolean
  /** Cópia de um projeto que já aparece em outra posição: some para o leitor de tela e para o Tab. */
  copia: boolean
  aoEscolher: () => void
}

const dois = (n: number) => String(n).padStart(2, '0')

/**
 * Um cartão da fita: a captura do site, o número e o nome. Clicar leva a fita até ele.
 * O botão é a linha do nome, mas a área de clique dele cobre o cartão inteiro (veja o ::after no CSS).
 * Assim o leitor de tela ouve só "01 Amabile Wanderert, site...", e não a descrição da imagem dentro do botão.
 */
export default function Cartao({ projeto, numero, v, ativo, copia, aoEscolher }: Props) {
  const item = useRef<HTMLLIElement>(null)

  // A posição vai numa variável CSS posta pelo JavaScript (a CSP não aceita style no HTML)
  useLayoutEffect(() => {
    if (v !== undefined) item.current?.style.setProperty('--v', String(v))
  }, [v])

  return (
    <li
      ref={item}
      className={ativo ? 'cartao cartao--ativo' : 'cartao'}
      data-projeto={projeto.id}
      aria-hidden={copia || undefined}
    >
      <span className="cartao__quadro">
        <Captura imagem={projeto.capa} sizes="(max-width: 699px) 82vw, min(40vw, 660px)" />
      </span>
      <button
        type="button"
        className="cartao__botao"
        tabIndex={copia ? -1 : undefined}
        aria-current={ativo ? 'true' : undefined}
        onClick={aoEscolher}
      >
        <b className="cartao__numero">{dois(numero)}</b>
        <span className="cartao__texto">
          <span className="cartao__nome" translate="no">
            {projeto.nome}
          </span>
          <span className="cartao__tipo mono">{projeto.tipo}</span>
        </span>
        <Icone nome="seta-direita" />
      </button>
    </li>
  )
}
