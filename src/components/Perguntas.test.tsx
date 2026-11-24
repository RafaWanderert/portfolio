// A seção "Perguntas frequentes" do jeito que o servidor entrega (antes de o React montar no navegador).
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { perguntas } from '../content/site.ts'
import Perguntas from './Perguntas.tsx'
import Saturno from './Saturno.tsx'

const html = renderToString(<Perguntas />)
const summaries = [...html.matchAll(/<summary[^>]*>(.*?)<\/summary>/gs)].map((m) => m[1])

describe('Perguntas frequentes', () => {
  it('tem as 6 perguntas, todas fechadas', () => {
    expect(html.match(/<details/g)).toHaveLength(6)
    expect(html).not.toMatch(/<details[^>]*\sopen/)
  })

  it('o título é o da seção e dá nome a ela', () => {
    expect(html).toContain('aria-labelledby="perguntas-titulo"')
    expect(html).toMatch(new RegExp(`<h2[^>]*id="perguntas-titulo"[^>]*>${perguntas.titulo}</h2>`))
  })

  it('cada pergunta vira o botão de abrir, e a resposta vem junto no HTML', () => {
    perguntas.itens.forEach((item, n) => {
      expect(summaries[n]).toContain(item.pergunta)
      expect(html).toContain(item.resposta)
    })
  })

  it('o sinal + / − é só visual: o leitor de tela lê a pergunta', () => {
    expect(summaries.every((s) => /class="pergunta__sinal"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*class="pergunta__sinal"/.test(s))).toBe(true)
  })

  it('o Saturno vem no HTML, escondido do leitor de tela, com recortes de id único', () => {
    expect(html).toMatch(/<svg[^>]*class="saturno"[^>]*aria-hidden="true"|<svg[^>]*aria-hidden="true"[^>]*class="saturno"/)
    const dois = renderToString(
      <>
        <Saturno />
        <Saturno />
      </>,
    )
    const ids = [...dois.matchAll(/<clipPath[^>]*id="([^"]+)"/g)].map((m) => m[1])
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
    expect(dois).not.toContain('style=')
  })
})
