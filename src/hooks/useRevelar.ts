import { useEffect } from 'react'

/**
 * Cada [data-revelar] ganha .visto quando entra na tela; as partes dele ([data-r]) sobem em sequência.
 * O índice de cada parte vai numa variável CSS posta pelo JavaScript (a CSP não aceita style no HTML).
 * Também avisa o index.html de que o React montou (window.__revelar): sem esse aviso em 4 s,
 * a página mostra tudo sem animação.
 */
export function useRevelar() {
  useEffect(() => {
    window.__revelar = true
    const alvos = document.querySelectorAll<HTMLElement>('[data-revelar]')
    alvos.forEach((alvo) =>
      alvo.querySelectorAll<HTMLElement>('[data-r]').forEach((parte, i) => parte.style.setProperty('--i', String(i))),
    )
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visto')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -12% 0px' },
    )
    alvos.forEach((a) => io.observe(a))
    return () => io.disconnect()
  }, [])
}
