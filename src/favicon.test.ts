// O ícone da aba é o Saturno da seção de perguntas (o Rafa pediu em 24/11/2026).
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

describe('favicon', () => {
  it('é o Saturno: planeta (círculo) e anel (elipse), em violeta sobre o preto do site', () => {
    expect(svg).toMatch(/<circle\b/)
    expect(svg).toMatch(/<ellipse\b/)
    expect(svg).toContain('#08070b')
    expect(svg).toContain('#7a59ff')
    expect(svg).not.toContain('M13.5 7') // as barras "//" antigas saíram
  })

  it('a página aponta para ele', () => {
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />')
  })
})
