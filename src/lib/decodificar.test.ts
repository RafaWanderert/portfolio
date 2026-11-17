import { expect, it } from 'vitest'
import { fundoRoda, letras, quadro } from './decodificar.ts'

const PT = ['DESENVOLVEDOR', 'DE SOFTWARE'] as const

it('progresso 1 devolve o texto final', () => {
  expect(quadro(PT, 1)).toEqual([...PT])
})

it('progresso 0 mantém tamanho, espaço e hífen', () => {
  const q = quadro(['SOFTWARE-', 'DE SOFTWARE'], 0, () => 0.5)
  expect(Array.from(q[0])).toHaveLength(9)
  expect(q[0].at(-1)).toBe('-')
  expect(q[1][2]).toBe(' ')
})

it('resolve da esquerda para a direita', () => {
  const q = quadro(PT, 0.5, () => 0)
  expect(q[0].slice(0, 6)).toBe('DESENV') // floor(0,5 × 13 letras)
  expect(q[1].slice(0, 5)).toBe('DE SO') // floor(0,5 × 11 letras)
})

it('só sorteia letras do próprio idioma', () => {
  const JA = ['ソフトウェア', '開発者']
  const permitidas = new Set(letras(JA))
  for (const p of [0, 0.3, 0.7]) {
    for (const linha of quadro(JA, p)) {
      for (const c of Array.from(linha)) expect(permitidas.has(c)).toBe(true)
    }
  }
})

it('conta por caractere, não por byte', () => {
  expect(Array.from(quadro(['소프트웨어', '개발자'], 0, () => 0)[0])).toHaveLength(5)
})

it('progresso fora de 0 a 1 é limitado', () => {
  expect(quadro(PT, 7)).toEqual([...PT])
  expect(Array.from(quadro(PT, -3, () => 0)[0])).toHaveLength(13)
})

it('letras não traz espaço nem hífen', () => {
  expect(letras(['A B', 'C-D'])).toEqual(['A', 'B', 'C', 'D'])
})

it('o fundo só roda com tudo a favor', () => {
  const tudo = { naTela: true, abaVisivel: true, fixo: false, poucoMovimento: false }
  expect(fundoRoda(tudo)).toBe(true)
  for (const k of ['naTela', 'abaVisivel'] as const) expect(fundoRoda({ ...tudo, [k]: false })).toBe(false)
  for (const k of ['fixo', 'poucoMovimento'] as const) expect(fundoRoda({ ...tudo, [k]: true })).toBe(false)
})
