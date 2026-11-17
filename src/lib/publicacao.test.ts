import { expect, it } from 'vitest'
import { problemasParaPublicar } from './publicacao.ts'

it('sem pendência, a lista vem vazia', () => {
  expect(
    problemasParaPublicar({ contatos: [{ rotulo: 'GitHub', confirmado: true }], projetos: [{ nome: 'A' }] }),
  ).toEqual([])
})

it('lista contato sem confirmação e pendência de projeto', () => {
  expect(
    problemasParaPublicar({
      contatos: [
        { rotulo: 'WhatsApp', confirmado: false },
        { rotulo: 'GitHub', confirmado: true },
      ],
      projetos: [{ nome: 'Loja Exemplo', pendencias: ['publicar o site e preencher os links'] }],
    }),
  ).toEqual(['Contato sem confirmação: WhatsApp', 'Loja Exemplo: publicar o site e preencher os links'])
})
