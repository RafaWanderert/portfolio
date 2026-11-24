// A seção "Como trabalho" do jeito que o servidor entrega (antes de o React montar no navegador).
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { comoTrabalho, whatsapp } from '../content/site.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import ComoTrabalho from './ComoTrabalho.tsx'
import Janela from './Janela.tsx'

const html = renderToString(<ComoTrabalho />)
// lido do disco: o Vitest entrega arquivos .css vazios quando importados
const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const doc = (padrao: RegExp) => [...html.matchAll(padrao)].map((m) => m[1])
/** Declarações da regra da página de exemplo num fundo (a regra pode ter outros seletores junto). */
const bloco = (id: string) =>
  new RegExp(`\\.janela\\[data-fundo='${id}'\\] \\.janela__pagina[^{]*\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
/** Cor (#rrggbb) de --ms-{nome} nesse fundo. */
const token = (id: string, nome: string) => new RegExp(`--ms-${nome}:\\s*(#[0-9a-f]{6})`).exec(bloco(id))?.[1] ?? ''
/** Luminância e contraste da WCAG (a mesma conta de conteudo.test.ts). */
const luz = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a: string, b: string) => {
  const [claro, escuro] = [luz(a), luz(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

describe('Como trabalho', () => {
  it('o campo do nome tem um rótulo ligado a ele', () => {
    const [id] = doc(/<input[^>]*\bid="([^"]+)"/g)
    expect(id).toBeTruthy()
    expect(html).toContain(`for="${id}"`)
    expect(html).toContain(comoTrabalho.campo.rotulo)
    expect(html).toContain(`maxLength="${comoTrabalho.campo.max}"`)
  })

  it('mostra os 5 passos em ordem, começando pelo primeiro', () => {
    const botoes = doc(/<button[^>]*data-etapa="(\d)"/g)
    expect(botoes).toEqual(['1', '2', '3', '4', '5'])
    expect(doc(/<button[^>]*aria-current="step"[^>]*data-etapa="(\d)"/g)).toEqual(['1'])
    for (const p of comoTrabalho.passos) expect(html).toContain(p.titulo)
  })

  it('a janela de exemplo começa no passo 1, na cor e na letra padrão', () => {
    expect(html).toMatch(/class="janela"[^>]*data-passo="1"/)
    expect(html).toMatch(/data-cor="violeta"/)
    expect(html).toMatch(/data-letra="moderna"/)
    expect(html).toMatch(/data-cantos="suaves"/)
    expect(html).toMatch(/data-fundo="claro"/)
  })

  it('os ajustes têm quatro grupos, com as opções do conteúdo e a padrão marcada', () => {
    expect(doc(/<legend>([^<]+)<\/legend>/g)).toEqual(['Cor', 'Letra', 'Cantos', 'Fundo'])
    // cada grupo é um conjunto de rádios com nome próprio: Tab passa de um grupo ao outro, as setas andam dentro
    const grupos = doc(/<input type="radio" name="[^"]*-(\w+)"/g)
    expect(['cor', 'letra', 'cantos', 'fundo'].map((g) => grupos.filter((x) => x === g).length)).toEqual([5, 4, 3, 3])
    // o React escreve checked antes de value: cada rádio é lido inteiro, sem depender da ordem
    const marcados = doc(/(<input type="radio"[^>]*>)/g)
      .filter((tag) => tag.includes('checked=""'))
      .map((tag) => /value="(\w+)"/.exec(tag)?.[1])
    expect(marcados).toEqual(['violeta', 'moderna', 'suaves', 'claro'])
  })

  it('o código do passo 4 começa pelas quatro escolhas', () => {
    const j = renderToString(
      <Janela passo={4} texto="Padaria do Zé" ajustes={{ cor: 'rosa', letra: 'classica', cantos: 'redondos', fundo: 'escuro' }} />,
    )
    expect(j).toMatch(/data-cantos="redondos"/)
    expect(j).toMatch(/data-fundo="escuro"/)
    for (const v of ['#be185d', 'Instrument Serif', '999px', '#1b1a21']) expect(j).toContain(v)
    expect(j.indexOf(':root')).toBeLessThan(j.indexOf('&lt;header&gt;'))
  })

  it('o botão abre o WhatsApp, em nova aba, com a mensagem de sempre', () => {
    const href = linkWhatsApp(whatsapp.numero, whatsapp.mensagem).replaceAll('&', '&amp;')
    expect(html).toMatch(new RegExp(`<a[^>]*href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*target="_blank"`))
  })

  it('não usa style no HTML (a CSP do site bloqueia)', () => {
    expect(html).not.toMatch(/\sstyle="/)
  })

  it('nenhuma variável do CSS aponta para ela mesma (o valor fica inválido e a borda some)', () => {
    const ciclos = [...css.matchAll(/(--[\w-]+)\s*:\s*var\(\s*\1\s*[,)]/g)].map((m) => m[1])
    expect(ciclos).toEqual([])
  })

  it('as cores do CSS são as mesmas do conteúdo', () => {
    for (const c of comoTrabalho.cores) {
      expect(css, c.nome).toMatch(new RegExp(`\\[data-cor='${c.id}'\\]\\s*\\{\\s*--cor:\\s*${c.valor};`))
    }
  })

  it('cada letra, canto e fundo tem a sua regra no CSS', () => {
    // a Moderna é a letra normal da página: não precisa de regra própria
    for (const l of comoTrabalho.letras.slice(1)) expect(css, l.nome).toContain(`.janela[data-letra='${l.id}'] .ms__titulo`)
    for (const c of comoTrabalho.cantos) expect(css, c.nome).toContain(`.janela[data-cantos='${c.id}']`)
    for (const f of comoTrabalho.fundos) expect(bloco(f.id), f.nome).toContain(`--ms-papel: ${f.valor};`)
  })

  it('em cada fundo, a tinta e o texto suave da página de exemplo têm contraste AA', () => {
    for (const f of comoTrabalho.fundos)
      for (const t of ['tinta', 'suave']) expect(contraste(token(f.id, t), f.valor), `${f.nome}: ${t}`).toBeGreaterThanOrEqual(4.5)
  })
})
