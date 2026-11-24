import { describe, expect, it } from 'vitest'
import { dominioDe, mensagemPedido, nomeDoNegocio, pendentes, proximaEtapa } from './exemplo.ts'

const padrao = 'Olá, Rafael! Vi o seu portfólio e quero conversar sobre um site.'

describe('nomeDoNegocio', () => {
  it('junta os espaços e corta as pontas', () => {
    expect(nomeDoNegocio('  Ana   Doces ')).toBe('Ana Doces')
  })
  it('sem nome, fala do negócio da pessoa', () => {
    expect(nomeDoNegocio('')).toBe('Seu negócio')
    expect(nomeDoNegocio('   ')).toBe('Seu negócio')
  })
})

describe('dominioDe', () => {
  it('tira acentos, espaços e símbolos', () => {
    expect(dominioDe('Padaria do Zé')).toBe('padariadoze.com.br')
    expect(dominioDe('Café & Cia. 24h')).toBe('cafecia24h.com.br')
  })
  it('sem letra nem número que sirva, usa o exemplo', () => {
    expect(dominioDe('')).toBe('seunegocio.com.br')
    expect(dominioDe('   ')).toBe('seunegocio.com.br')
    expect(dominioDe('!!!')).toBe('seunegocio.com.br')
    expect(dominioDe('🙂')).toBe('seunegocio.com.br')
  })
  it('para em 30 letras antes do .com.br', () => {
    expect(dominioDe('a'.repeat(60))).toBe('a'.repeat(30) + '.com.br')
  })
})

describe('mensagemPedido', () => {
  it('com nome, já diz para qual negócio é o site', () => {
    expect(mensagemPedido('  Padaria   do Zé ', padrao)).toBe(
      'Olá, Rafael! Vi o seu portfólio e quero um site para o meu negócio: Padaria do Zé.',
    )
  })
  it('sem nome, usa a mensagem de sempre', () => {
    expect(mensagemPedido('  ', padrao)).toBe(padrao)
  })
})

describe('proximaEtapa', () => {
  it('avança um passo', () => {
    expect(proximaEtapa(1, 5)).toBe(2)
    expect(proximaEtapa(4, 5)).toBe(5)
  })
  it('para no último', () => {
    expect(proximaEtapa(5, 5)).toBeNull()
  })
})

describe('pendentes', () => {
  const roteiro = [
    { em: 900, muda: 'a' },
    { em: 2000, muda: 'b' },
    { em: 4200, muda: 'c' },
  ]
  it('o que falta do roteiro, depois do tempo já tocado', () => {
    expect(pendentes(roteiro, 0)).toEqual([
      { espera: 900, muda: 'a' },
      { espera: 2000, muda: 'b' },
      { espera: 4200, muda: 'c' },
    ])
    // a troca marcada para os 900 ms já aconteceu
    expect(pendentes(roteiro, 900)).toEqual([
      { espera: 1100, muda: 'b' },
      { espera: 3300, muda: 'c' },
    ])
    expect(pendentes(roteiro, 2500)).toEqual([{ espera: 1700, muda: 'c' }])
    expect(pendentes(roteiro, 5000)).toEqual([])
  })
})
