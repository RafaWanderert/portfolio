import { useEffect, useState } from 'react'
import { inicio, site, whatsapp } from '../content/site.ts'
import { linkWhatsApp } from '../lib/whatsapp.ts'

const links = [
  { href: '#projetos', nome: 'projetos' },
  { href: '#sobre', nome: 'sobre' },
  { href: '#contato', nome: 'contato' },
]

/**
 * Barra presa no alto. Só aparece depois que a primeira tela sai da vista, para o nome
 * não ficar repetido lá em cima. No celular mostra só o nome e o botão.
 */
export default function Barra() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const tela = document.getElementById('inicio')
    if (!tela) return
    // rootMargin: a primeira tela conta como "fora" quando só restam os 80px de cima dela.
    // Assim a barra já aparece quando alguém pula direto para os projetos.
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0), {
      rootMargin: '-80px 0px 0px 0px',
    })
    io.observe(tela)
    return () => io.disconnect()
  }, [])

  return (
    // inert: enquanto está escondida, a barra não recebe foco nem clique
    <div className={visivel ? 'barra barra--visivel' : 'barra'} inert={!visivel}>
      <a className="barra__nome" href="#inicio" translate="no">
        {site.nome}
      </a>
      <nav className="barra__links" aria-label="Atalhos">
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.nome}
          </a>
        ))}
      </nav>
      <a
        className="botao botao--pequeno"
        href={linkWhatsApp(whatsapp.numero, whatsapp.mensagem)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inicio.acao}
        <span className="so-leitor"> (abre em nova aba)</span>
      </a>
    </div>
  )
}
