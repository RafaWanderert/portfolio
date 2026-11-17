import { expect, it } from 'vitest'
import { fitaRoda, janela, passoDoArraste, volta } from './fita.ts'

it('volta dá a volta nos dois sentidos', () => {
  expect(volta(4, 4)).toBe(0)
  expect(volta(-1, 4)).toBe(3)
  expect(volta(-5, 4)).toBe(3)
  expect(volta(9, 4)).toBe(1)
})

it('janela traz 2 de cada lado com o projeto certo', () => {
  expect(janela(0, 4, 2)).toEqual([
    { v: -2, projeto: 2 },
    { v: -1, projeto: 3 },
    { v: 0, projeto: 0 },
    { v: 1, projeto: 1 },
    { v: 2, projeto: 2 },
  ])
})

it('janela acompanha o ativo, inclusive negativo', () => {
  expect(janela(-1, 4, 1).map((j) => j.projeto)).toEqual([2, 3, 0])
})

it('arraste curto e lento não muda; longo ou rápido muda', () => {
  expect(passoDoArraste(-30, 0, 600)).toBe(0)
  expect(passoDoArraste(-130, 0, 600)).toBe(1) // para a esquerda = próximo
  expect(passoDoArraste(130, 0, 600)).toBe(-1)
  expect(passoDoArraste(-30, -0.6, 600)).toBe(1) // curto, mas rápido
  expect(passoDoArraste(30, 0.6, 600)).toBe(-1)
  expect(passoDoArraste(-10, -0.6, 600)).toBe(0) // toque quase parado não é arraste
})

it('um peteleco curto conta: 40 px a 0,35 px por milissegundo', () => {
  expect(passoDoArraste(-40, -0.35, 600)).toBe(1)
  expect(passoDoArraste(-40, -0.2, 600)).toBe(0) // devagar demais para ser peteleco
})

it('num cartão estreito de celular, 60 px já bastam', () => {
  expect(passoDoArraste(-64, 0, 300)).toBe(1)
  expect(passoDoArraste(-50, 0, 300)).toBe(0)
})

it('a fita só avança sozinha com tudo a favor', () => {
  const tudo = {
    naTela: true,
    mouseEmCima: false,
    focoDentro: false,
    arrastando: false,
    pausada: false,
    videoTocando: false,
    poucoMovimento: false,
  }
  expect(fitaRoda(tudo)).toBe(true)
  expect(fitaRoda({ ...tudo, naTela: false })).toBe(false)
  for (const k of ['mouseEmCima', 'focoDentro', 'arrastando', 'pausada', 'videoTocando', 'poucoMovimento'] as const) {
    expect(fitaRoda({ ...tudo, [k]: true })).toBe(false)
  }
})
