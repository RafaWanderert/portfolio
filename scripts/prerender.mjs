// Pré-renderização: depois do build, gera o HTML completo da página
// (aparece antes do JavaScript carregar e é bom para o Google).
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')
const ssr = resolve(raiz, 'dist-ssr')

const { render, problemas, publicado } = await import(pathToFileURL(resolve(ssr, 'entry-server.js')).href)

// Trava de publicação: contato que o Rafa ainda não confirmou ou projeto com link pendente
// não podem ir a público. Enquanto o site é prévia ("publicado: false"), o build só avisa.
const falta = problemas()
if (falta.length > 0) {
  const lista = falta.map((f) => `  - ${f}`).join('\n')
  if (publicado) {
    throw new Error(`O site está marcado como publicado, mas ainda falta:\n${lista}\nResolva em src/content/ antes de publicar.`)
  }
  console.log(`Antes de publicar, falta:\n${lista}`)
}

const arquivo = resolve(dist, 'index.html')
let html = readFileSync(arquivo, 'utf8')
const marcador = '<div id="root"></div>'
if (!html.includes(marcador)) throw new Error('dist/index.html sem <div id="root"></div>')
html = html.replace(marcador, `<div id="root">${render()}</div>`)

// A CSP não aceita style="..." no HTML. Se o React pré-renderizar algum, o build para aqui
// (valores que mudam por elemento entram por classe ou por JavaScript, depois que a página monta).
const comEstilo = html.match(/<[a-z][^>]*\sstyle="[^"]*"/i)
if (comEstilo) throw new Error(`HTML pré-renderizado com style="...": a CSP bloquearia.\n  ${comEstilo[0].slice(0, 160)}`)

// Pré-carrega as fontes da primeira tela: Anton (nome e fundo), Instrument Sans (texto) e JetBrains Mono (rótulos)
const assets = readdirSync(resolve(dist, 'assets'))
const fontes = [
  /^anton-latin-400-normal-.+\.woff2$/,
  /^instrument-sans-latin-wght-normal-.+\.woff2$/,
  /^jetbrains-mono-latin-wght-normal-.+\.woff2$/,
]
  .map((padrao) => assets.find((f) => padrao.test(f)))
  .filter(Boolean)
if (fontes.length !== 3) throw new Error('Fontes da primeira tela não encontradas em dist/assets')
const preloads = fontes
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
html = html.replace('</head>', `  ${preloads}\n  </head>`)

writeFileSync(arquivo, html)
rmSync(ssr, { recursive: true, force: true })

// A CSP libera só o que o site usa: arquivos do próprio endereço e o script inline do <head>,
// identificado pelo hash. Se o conteúdo desse script mudar, o hash é recalculado aqui.
// (WhatsApp, GitHub e LinkedIn são links que abrem fora do site: a CSP não os bloqueia.)
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
  (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`,
)
const csp = [
  "default-src 'self'",
  `script-src 'self' ${inline.join(' ')}`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

// No Render, os cabeçalhos ficam no render.yaml. Aqui só conferimos se a CSP de lá é a mesma
// calculada agora; se não for, o build para e mostra a linha certa para colar no render.yaml.
const blueprint = readFileSync(resolve(raiz, 'render.yaml'), 'utf8')
if (!blueprint.includes(`value: "${csp}"`)) {
  throw new Error(
    `A CSP do render.yaml está desatualizada. Troque o value do Content-Security-Policy por:\n  value: "${csp}"`,
  )
}
console.log('CSP do render.yaml confere com a página')
console.log(`Pré-renderizado: dist/index.html (${Math.round(html.length / 1024)} KB)`)
