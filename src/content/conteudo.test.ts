// Confere o conteúdo de verdade do site: se alguém apagar um link, trocar a ordem dos
// projetos ou deixar uma imagem sem descrição, estes testes avisam antes do build.
import { describe, expect, it } from 'vitest'
import blueprint from '../../render.yaml?raw'
import { problemasParaPublicar } from '../lib/publicacao.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import { idiomas } from './idiomas.ts'
import { projetos } from './projetos.ts'
import { comoTrabalho, contatos, fatos, habilidades, pendencias, rodape, seo, site, whatsapp } from './site.ts'

describe('projetos', () => {
  it('são os 3 combinados, na ordem da fita', () => {
    expect(projetos.map((p) => p.id)).toEqual(['amabile', 'cuidar', 'helena'])
  })

  it('nenhum link fica vazio: ou tem endereço https, ou diz por que não tem', () => {
    for (const p of projetos) {
      for (const link of [p.site, p.codigo]) if (link !== undefined) expect(link).toMatch(/^https:\/\/\S+$/)
      expect(p.site ?? p.semSite, `${p.nome}: site`).toBeTruthy()
      expect(p.codigo ?? p.semCodigo, `${p.nome}: código`).toBeTruthy()
    }
  })

  it('toda capa mede 1440×900 e descreve a tela', () => {
    for (const p of projetos) {
      expect([p.capa.largura, p.capa.altura], p.nome).toEqual([1440, 900])
      expect(p.capa.alt.length, `${p.nome}: alt`).toBeGreaterThanOrEqual(20)
      expect(p.capa.src, p.nome).toBeTruthy()
    }
  })

  it('toda ficha tem uma tela de celular ou um vídeo', () => {
    for (const p of projetos) expect(p.celular ?? p.video, p.nome).toBeTruthy()
  })

  it('todo projeto conta o problema, o que foi feito e as tecnologias', () => {
    for (const p of projetos) {
      expect(p.problema.length, p.nome).toBeGreaterThan(40)
      expect(p.feito.length, p.nome).toBeGreaterThan(40)
      expect(p.tecnologias.length, p.nome).toBeGreaterThanOrEqual(4)
    }
  })
})

describe('idiomas do fundo', () => {
  it('são 9, começando pelo português', () => {
    expect(idiomas.map((i) => i.codigo)).toEqual(['PT', 'EN', 'JA', 'ES', 'FR', 'KO', 'DE', 'IT', 'RU'])
    expect(idiomas[0].linhas).toEqual(['DESENVOLVEDOR', 'DE SOFTWARE'])
  })

  it('cada um tem duas linhas e uma largura medida', () => {
    for (const i of idiomas) {
      expect(i.linhas, i.codigo).toHaveLength(2)
      expect(i.largura, i.codigo).toBeGreaterThan(0)
    }
  })
})

describe('site', () => {
  it('mostra 3 números, todos só com dígitos', () => {
    expect(fatos).toHaveLength(3)
    for (const f of fatos) expect(f.valor).toMatch(/^\d{2,3}$/)
  })

  it('tem o LinkedIn e o GitHub que o Rafa confirmou', () => {
    const por = Object.fromEntries(contatos.map((c) => [c.id, c]))
    expect(por.linkedin.href).toBe('https://www.linkedin.com/in/rafael-wanderert-92450831b')
    expect(por.linkedin.confirmado).toBe(true)
    expect(por.github.href).toBe('https://github.com/RafaWanderert')
    expect(por.github.confirmado).toBe(true)
    expect(por.email.href).toMatch(/^mailto:\S+@\S+$/)
  })

  it('o botão do WhatsApp tem um número válido', () => {
    expect(() => linkWhatsApp(whatsapp.numero, whatsapp.mensagem)).not.toThrow()
  })

  it('tem 4 grupos de habilidades e 5 passos de trabalho', () => {
    expect(habilidades.grupos.map((h) => h.grupo)).toEqual(['Linguagens', 'Front-end', 'Back-end e dados', 'Ferramentas'])
    expect(habilidades.grupos.flatMap((h) => h.itens)).toHaveLength(18)
    expect(comoTrabalho.passos.map((p) => p.titulo)).toEqual(['Conversa', 'Rascunho', 'Ajustes', 'Desenvolvimento', 'No ar'])
  })

  it('a descrição para o Google tem de 70 a 160 letras', () => {
    expect(seo.descricao.length).toBeGreaterThanOrEqual(70)
    expect(seo.descricao.length).toBeLessThanOrEqual(160)
  })

  it('usa domínio próprio, e não um endereço emprestado do Render', () => {
    expect(site.url).toMatch(/^https:\/\/[a-z0-9.-]+$/)
    expect(site.url).not.toContain('onrender.com')
  })

  it('o render.yaml liga no Render o mesmo domínio do site', () => {
    const dominio = new URL(site.url).hostname.replaceAll('.', '\\.')
    expect(blueprint).toMatch(new RegExp(`^ {4}domains:\\r?\\n {6}- ${dominio}\\r?$`, 'm'))
  })

  it('o Rafa liberou todos os contatos (17/11/2026)', () => {
    expect(contatos.filter((c) => !c.confirmado).map((c) => c.id)).toEqual([])
  })

  it('o rodapé leva ao código do portfólio no GitHub, e o repositório saiu das pendências', () => {
    expect(rodape.codigo).toBe('https://github.com/RafaWanderert/portfolio')
    expect(pendencias.filter((p) => p.includes('repositório'))).toEqual([])
  })

  it('enquanto o domínio não for registrado, a publicação fica travada', () => {
    const provisorio = site.url.endsWith('.invalid')
    expect(pendencias.some((p) => p.includes('domínio'))).toBe(provisorio)
  })

  it('fica fora do Google enquanto não for publicado', () => {
    expect(seo.robots).toBe(site.publicado ? 'index, follow' : 'noindex, nofollow')
  })

  it('não pode estar marcado como publicado com algo por confirmar', () => {
    const problemas = problemasParaPublicar({ contatos, projetos: [...projetos, { nome: 'Site', pendencias }] })
    expect(site.publicado === false || problemas.length === 0).toBe(true)
  })
})
