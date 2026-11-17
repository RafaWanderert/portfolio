import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import { fitaRoda, passoDoArraste } from '../lib/fita.ts'
import { usePoucoMovimento } from './usePoucoMovimento.ts'

type Gesto = { id: number; x0: number; x: number; t: number; velocidade: number; largura: number }

/**
 * Liga a conta da fita (src/lib/fita.ts) ao navegador: qual cartão está ativo, quando ela
 * avança sozinha, o arraste com o dedo ou o mouse e as setas do teclado.
 * "fita" é a área que recebe o arraste; "trilho" é a lista dos cartões.
 */
export function useFita(fita: RefObject<HTMLElement | null>, trilho: RefObject<HTMLElement | null>) {
  const poucoMovimento = usePoucoMovimento()
  /** Posição virtual do cartão ativo: só cresce ou diminui (veja src/lib/fita.ts). */
  const [ativo, setAtivo] = useState(0)
  /** Antes de o React montar, a tela é a que veio do servidor: os cartões em ordem, sem cópias. */
  const [montada, setMontada] = useState(false)
  const [pausada, setPausada] = useState(false)
  const [naTela, setNaTela] = useState(false)
  const [mouseEmCima, setMouseEmCima] = useState(false)
  const [focoDentro, setFocoDentro] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const [videoTocando, setVideoTocando] = useState(false)
  const gesto = useRef<Gesto | null>(null)
  const emArraste = useRef(false)
  const acabouDeArrastar = useRef(false)

  useEffect(() => setMontada(true), [])

  // A fita está à vista? (metade dela, pelo menos)
  useEffect(() => {
    if (!fita.current) return
    const io = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.5 })
    io.observe(fita.current)
    return () => io.disconnect()
  }, [fita])

  // O CSS posiciona cada cartão a partir de --ativo (vai por JavaScript: a CSP não aceita style no HTML)
  useLayoutEffect(() => {
    trilho.current?.style.setProperty('--ativo', String(ativo))
  }, [ativo, trilho])

  // Setas do teclado, enquanto a fita está na tela
  useEffect(() => {
    if (!naTela) return
    const aoTeclar = (e: KeyboardEvent) => {
      // defaultPrevented: outro controle (os códigos de idioma) já usou esta seta
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.target instanceof Element && e.target.closest('video, input, textarea, select')) return
      if (e.key === 'ArrowRight') setAtivo((a) => a + 1)
      else if (e.key === 'ArrowLeft') setAtivo((a) => a - 1)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [naTela])

  // ---- arraste (dedo, caneta ou mouse) ----
  const aoApertar = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // um segundo dedo no meio do arraste não rouba o gesto do primeiro
    if (emArraste.current) return
    const cartao = trilho.current?.querySelector<HTMLElement>('.cartao--ativo')
    gesto.current = {
      id: e.pointerId,
      x0: e.clientX,
      x: e.clientX,
      t: e.timeStamp,
      velocidade: 0,
      largura: cartao?.offsetWidth ?? 600,
    }
    acabouDeArrastar.current = false
  }

  const aoMover = (e: PointerEvent<HTMLElement>) => {
    const g = gesto.current
    if (!g || g.id !== e.pointerId) return
    const dx = e.clientX - g.x0
    if (!emArraste.current) {
      // só vira arraste depois de 8 px: um clique com a mão tremida continua sendo clique
      if (Math.abs(dx) < 8) return
      emArraste.current = true
      setArrastando(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const dt = e.timeStamp - g.t
    if (dt > 0) g.velocidade = 0.7 * ((e.clientX - g.x) / dt) + 0.3 * g.velocidade
    g.x = e.clientX
    g.t = e.timeStamp
    // os cartões acompanham o dedo: o deslocamento vai direto no trilho (um elemento só),
    // sem variável CSS, para o navegador não recalcular o estilo de cada cartão a cada movimento
    if (trilho.current) trilho.current.style.transform = `translate3d(${dx}px, 0, 0)`
  }

  const soltar = (e: PointerEvent<HTMLElement>, cancelado: boolean) => {
    const g = gesto.current
    if (!g || g.id !== e.pointerId) return
    gesto.current = null
    if (!emArraste.current) return
    emArraste.current = false
    // o navegador ainda pode disparar um "clique" ao soltar: ele é ignorado (veja "ir"),
    // e logo em seguida a fita volta a aceitar cliques e Enter normalmente
    acabouDeArrastar.current = true
    window.setTimeout(() => {
      acabouDeArrastar.current = false
    }, 0)
    setArrastando(false)
    // solta o trilho: ele volta para o lugar com a mesma curva em que os cartões andam
    if (trilho.current) trilho.current.style.transform = ''
    if (cancelado) return
    const passo = passoDoArraste(e.clientX - g.x0, g.velocidade, g.largura)
    if (passo !== 0) setAtivo((a) => a + passo)
  }

  /** Clicar num cartão leva até ele (a menos que o "clique" seja o fim de um arraste). */
  const ir = useCallback((v: number) => {
    if (acabouDeArrastar.current) {
      acabouDeArrastar.current = false
      return
    }
    setAtivo(v)
  }, [])

  const rodando =
    montada && fitaRoda({ naTela, mouseEmCima, focoDentro, arrastando, pausada, videoTocando, poucoMovimento })

  return {
    ativo,
    montada,
    pausada,
    rodando,
    arrastando,
    poucoMovimento,
    ir,
    proximo: useCallback(() => setAtivo((a) => a + 1), []),
    anterior: useCallback(() => setAtivo((a) => a - 1), []),
    alternarPausa: useCallback(() => setPausada((p) => !p), []),
    /** A linha de progresso encheu: hora do próximo projeto. */
    aoTerminarProgresso: useCallback(() => setAtivo((a) => a + 1), []),
    aoTocarVideo: setVideoTocando,
    /** Para pôr na seção inteira: com o mouse em cima ou o foco do teclado dentro, a fita espera. */
    naSecao: {
      onPointerEnter: (e: PointerEvent<HTMLElement>) => e.pointerType === 'mouse' && setMouseEmCima(true),
      onPointerLeave: (e: PointerEvent<HTMLElement>) => e.pointerType === 'mouse' && setMouseEmCima(false),
      // :focus-visible = foco que veio do teclado (um clique de mouse num botão não segura a fita)
      onFocus: (e: FocusEvent<HTMLElement>) => setFocoDentro(e.target.matches(':focus-visible')),
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocoDentro(false)
      },
    },
    /** Para pôr na área da fita: o arraste. */
    naFita: {
      onPointerDown: aoApertar,
      onPointerMove: aoMover,
      onPointerUp: (e: PointerEvent<HTMLElement>) => soltar(e, false),
      onPointerCancel: (e: PointerEvent<HTMLElement>) => soltar(e, true),
    },
  }
}
