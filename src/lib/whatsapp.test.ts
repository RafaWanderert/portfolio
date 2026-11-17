import { expect, it } from 'vitest'
import { linkWhatsApp } from './whatsapp.ts'

it('monta o link com a mensagem codificada', () => {
  expect(linkWhatsApp('5548984502000', 'Olá, Rafael! Vi o seu portfólio e quero conversar sobre um site.')).toBe(
    'https://wa.me/5548984502000?text=Ol%C3%A1%2C%20Rafael!%20Vi%20o%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20site.',
  )
})

it('recusa número fora do formato 55 + DDD + número', () => {
  for (const ruim of ['(48) 98450-2000', '48984502000', '+5548984502000', '']) {
    expect(() => linkWhatsApp(ruim, 'oi')).toThrow()
  }
})
