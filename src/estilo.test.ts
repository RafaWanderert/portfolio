// Regras de CSS que valem para o site inteiro. Os efeitos de verdade (mouse, foco, movimento)
// são conferidos no navegador, em scripts/teste-navegador.mjs (grupo botoes).
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// lido do disco: o Vitest entrega arquivos .css vazios quando importados
const css = readFileSync(new URL('./index.css', import.meta.url), 'utf8')
/** O corpo do primeiro bloco cujo seletor é exatamente este. */
const bloco = (seletor: string) => {
  const i = css.indexOf(`\n${seletor} {`)
  return i < 0 ? '' : css.slice(i, css.indexOf('}', i))
}
/** Todos os blocos @media com esta consulta, juntos (cada um vai até o "}" no começo da linha). */
const media = (consulta: string) =>
  css
    .split(`@media ${consulta}`)
    .slice(1)
    .map((resto) => resto.slice(0, resto.indexOf('\n}')))
    .join('\n')

describe('Botões de vidro escuro', () => {
  it('o botão é vidro escuro, não violeta chapado', () => {
    const b = bloco('.botao')
    expect(b).not.toBe('')
    expect(b).not.toContain('background: var(--roxo)')
    expect(b).toContain('#0d0b14')
  })

  it('o fio neon gira com @property e acende parado no foco e no toque', () => {
    expect(css).toContain('@property --giro')
    expect(css).toContain('@keyframes girar')
    expect(css).toContain('.botao:focus-visible::before')
    expect(css).toContain('.botao:active::before')
  })

  it('com "reduzir movimento" o fio não gira e a faixa de luz some', () => {
    const m = media('(prefers-reduced-motion: reduce)')
    expect(m).toMatch(/\.botao[^{]*::before[^{]*\{[^}]*animation: none/)
    expect(m).toMatch(/\.botao::after[^{]*\{[^}]*display: none/)
  })

  it('o botão claro (do bloco roxo que saiu) não existe mais', () => {
    expect(css).not.toContain('.botao--claro')
  })
})
