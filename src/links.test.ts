import { expect, it } from 'vitest'
import { render } from './entry-server.tsx'

/** Todo <a> da página renderizada, com os atributos que importam aqui. */
function links(html: string) {
  return [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) => ({
    tag,
    href: /href="([^"]*)"/.exec(tag)?.[1] ?? '',
    target: /target="([^"]*)"/.exec(tag)?.[1],
    rel: /rel="([^"]*)"/.exec(tag)?.[1] ?? '',
  }))
}

it('todo link para outro site abre em nova aba, sem dar acesso à página', () => {
  const externos = links(render()).filter((l) => /^https?:\/\//.test(l.href))
  expect(externos.length).toBeGreaterThan(0)
  for (const l of externos) {
    expect(l.target, l.tag).toBe('_blank')
    expect(l.rel, l.tag).toContain('noopener')
  }
})

it('links internos (#seção) e o e-mail continuam na mesma aba', () => {
  const internos = links(render()).filter((l) => l.href.startsWith('#') || l.href.startsWith('mailto:'))
  expect(internos.length).toBeGreaterThan(0)
  for (const l of internos) expect(l.target, l.tag).toBeUndefined()
})
