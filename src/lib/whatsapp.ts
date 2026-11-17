/**
 * Link que abre o WhatsApp com a mensagem já escrita (a pessoa ainda decide se envia).
 * O número vai só com dígitos: 55 (Brasil) + DDD + número. Se vier em outro formato,
 * a função para o build em vez de publicar um botão que não funciona.
 */
export function linkWhatsApp(numero: string, mensagem: string): string {
  if (!/^55\d{10,11}$/.test(numero)) {
    throw new Error(`Número de WhatsApp fora do formato 55 + DDD + número: "${numero}"`)
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}
