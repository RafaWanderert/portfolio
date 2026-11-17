import { contatos, habilidades, seo, site } from '../content/site.ts'

// Dados estruturados (schema.org): contam ao Google, em formato de máquina, quem é o Rafael,
// o que ele faz e quais são os perfis dele. Telefone e e-mail ficam de fora de propósito.
const dados = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.nome,
  jobTitle: 'Desenvolvedor de software',
  description: seo.descricao,
  url: `${site.url}/`,
  image: `${site.url}/og.jpg`,
  address: { '@type': 'PostalAddress', addressLocality: 'Biguaçu', addressRegion: 'SC', addressCountry: 'BR' },
  sameAs: contatos.filter((c) => c.confirmado && (c.id === 'github' || c.id === 'linkedin')).map((c) => c.href),
  knowsAbout: habilidades.grupos.flatMap((g) => g.itens),
}

export default function DadosEstruturados() {
  return (
    <script
      type="application/ld+json"
      // "<" vira < para o texto nunca fechar a tag <script> por engano
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, '\\u003c') }}
    />
  )
}
