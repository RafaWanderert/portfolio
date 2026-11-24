// Confere o conteúdo de verdade do site: se alguém apagar um link, trocar a ordem dos
// projetos ou deixar uma imagem sem descrição, estes testes avisam antes do build.
import { describe, expect, it } from 'vitest'
import blueprint from '../../render.yaml?raw'
import { problemasParaPublicar } from '../lib/publicacao.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'
import { idiomas } from './idiomas.ts'
import { projetos } from './projetos.ts'
import { comoTrabalho, contatos, fatos, fatosConferidosEm, habilidades, pendencias, perguntas, rodape, seo, site, whatsapp } from './site.ts'

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

  it('os números conferidos em 24/11/2026: 11 projetos, 4 sites no ar, Lighthouse 100', () => {
    expect(fatos.map((f) => f.valor)).toEqual(['11', '04', '100'])
    expect(fatosConferidosEm).toBe('2026-11-24')
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

  it('a demonstração tem 5 cores legíveis com texto branco, 4 letras, 3 cantos e 3 fundos', () => {
    // contraste da WCAG entre a cor e o branco: o botão da janela de exemplo leva texto branco
    const luz = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    expect(comoTrabalho.cores.map((c) => c.id)).toEqual(['violeta', 'verde', 'cafe', 'rosa', 'petroleo'])
    for (const c of comoTrabalho.cores) {
      expect(c.valor, c.nome).toMatch(/^#[0-9a-f]{6}$/)
      expect(1.05 / (luz(c.valor) + 0.05), c.nome).toBeGreaterThanOrEqual(4.5)
    }
    expect(comoTrabalho.letras.map((l) => l.id)).toEqual(['moderna', 'marcante', 'classica', 'codigo'])
    expect(comoTrabalho.letras.map((l) => l.fonte)).toEqual(['Instrument Sans', 'Anton', 'Instrument Serif', 'JetBrains Mono'])
    expect(comoTrabalho.cantos.map((c) => [c.id, c.valor])).toEqual([
      ['retos', '0'],
      ['suaves', '8px'],
      ['redondos', '999px'],
    ])
    expect(comoTrabalho.fundos.map((f) => [f.id, f.valor])).toEqual([
      ['claro', '#ffffff'],
      ['creme', '#f8f3ea'],
      ['escuro', '#1b1a21'],
    ])
    expect(comoTrabalho.rotulos).toEqual({ cor: 'Cor', letra: 'Letra', cantos: 'Cantos', fundo: 'Fundo' })
    expect(comoTrabalho.padrao).toEqual({ cor: 'violeta', letra: 'moderna', cantos: 'suaves', fundo: 'claro' })
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

  it('as perguntas frequentes são as 6 aprovadas, com os valores do Rafa', () => {
    expect(perguntas.titulo).toBe('Perguntas frequentes')
    expect(perguntas.itens.map((i) => i.pergunta)).toEqual([
      'Quanto tempo leva para o site ficar pronto?',
      'Quanto custa?',
      'Preciso pagar domínio e hospedagem?',
      'Consigo mudar o site depois?',
      'O site aparece no Google?',
      'Como é o pagamento?',
    ])
    const valores = ['5 dias', 'R$ 350', 'R$ 40 por ano', 'R$ 50', 'Perfil da Empresa no Google', 'Metade no início e metade na entrega']
    perguntas.itens.forEach((item, n) => expect(item.resposta).toContain(valores[n]))
  })

  it('o Rafa liberou todos os contatos (17/11/2026)', () => {
    expect(contatos.filter((c) => !c.confirmado).map((c) => c.id)).toEqual([])
  })

  it('o rodapé não leva mais ao código do site (o Rafa tirou em 24/11/2026)', () => {
    expect(rodape).not.toHaveProperty('codigo')
    expect(rodape).not.toHaveProperty('textoCodigo')
    expect(pendencias.filter((p) => p.includes('repositório'))).toEqual([])
  })

  it('enquanto o domínio não for registrado, a publicação fica travada', () => {
    const provisorio = site.url.endsWith('.invalid')
    expect(pendencias.some((p) => p.includes('domínio'))).toBe(provisorio)
  })

  it('está publicado e aberto ao Google (o Rafa aprovou em 24/11/2026)', () => {
    expect(site.publicado).toBe(true)
    expect(seo.robots).toBe('index, follow')
  })

  it('fica fora do Google enquanto não for publicado', () => {
    expect(seo.robots).toBe(site.publicado ? 'index, follow' : 'noindex, nofollow')
  })

  it('não pode estar marcado como publicado com algo por confirmar', () => {
    const problemas = problemasParaPublicar({ contatos, projetos: [...projetos, { nome: 'Site', pendencias }] })
    expect(site.publicado === false || problemas.length === 0).toBe(true)
  })
})
