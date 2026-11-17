// Baixa, uma vez só, os recortes das três fontes do texto de fundo (japonês, coreano e russo).
// Cada recorte tem apenas as letras da frase "desenvolvedor de software" naquele idioma,
// por isso os arquivos são pequenos. Depois disso o site não pede nada ao Google: as fontes
// ficam em src/assets/fontes. As três têm licença livre (SIL Open Font License).
// Uso: node scripts/fontes.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pasta = resolve(import.meta.dirname, '..', 'src', 'assets', 'fontes')
mkdirSync(pasta, { recursive: true })

const recortes = [
  { familia: 'Noto+Sans+JP:wght@900', texto: 'ソフトウェア開発者', arquivo: 'noto-sans-jp-900-recorte.woff2' },
  { familia: 'Black+Han+Sans', texto: '소프트웨어개발자', arquivo: 'black-han-sans-recorte.woff2' },
  {
    familia: 'Sofia+Sans+Extra+Condensed:wght@900',
    texto: 'РАЗРАБОТЧИКПО',
    arquivo: 'sofia-sans-extra-condensed-900-recorte.woff2',
  },
]

// O Google só entrega woff2 para quem se apresenta como um navegador atual.
const navegador =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

for (const r of recortes) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${r.familia}&text=${encodeURIComponent(r.texto)}&display=swap`,
    { headers: { 'User-Agent': navegador } },
  ).then((resposta) => {
    if (!resposta.ok) throw new Error(`${r.familia}: o Google respondeu ${resposta.status}`)
    return resposta.text()
  })
  const endereco = css.match(/src:\s*url\(([^)]+)\)\s*format\('woff2'\)/)?.[1]
  if (!endereco) throw new Error(`${r.familia}: não achei o woff2 no CSS:\n${css}`)
  const dados = Buffer.from(await fetch(endereco).then((resposta) => resposta.arrayBuffer()))
  // todo woff2 começa com as letras "wOF2"
  if (dados.subarray(0, 4).toString('latin1') !== 'wOF2') throw new Error(`${r.familia}: o arquivo não é woff2`)
  writeFileSync(resolve(pasta, r.arquivo), dados)
  console.log(`${r.arquivo}  ${(dados.length / 1024).toFixed(1)} KB`)
}
