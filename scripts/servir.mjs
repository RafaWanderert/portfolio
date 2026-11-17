// Serve a pasta dist no PC com os mesmos cabeçalhos que o Render vai mandar (os do render.yaml).
// Assim dá para testar a página do jeito que ela vai ao ar: se a CSP bloquear algo, aparece aqui.
// Uso: npm run build e depois npm run servir (ou node scripts/servir.mjs 4190)
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { brotliCompressSync, constants, gzipSync } from 'node:zlib'

const raiz = resolve(import.meta.dirname, '..')
const dist = resolve(raiz, 'dist')
const porta = Number(process.argv[2]) || 4190

if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('Não achei dist/index.html. Rode "npm run build" antes.')
  process.exit(1)
}

/** Lê os cabeçalhos do render.yaml: cada item tem path, name e value. */
function lerCabecalhos() {
  const linhas = readFileSync(resolve(raiz, 'render.yaml'), 'utf8').split(/\r?\n/)
  const lista = []
  let atual = null
  for (const linha of linhas) {
    const caminho = linha.match(/^\s*-\s*path:\s*(.+)$/)
    if (caminho) {
      atual = { path: caminho[1].trim() }
      lista.push(atual)
      continue
    }
    const campo = linha.match(/^\s*(name|value):\s*(.+)$/)
    if (campo && atual) atual[campo[1]] = campo[2].trim().replace(/^"(.*)"$/, '$1')
  }
  return lista.filter((c) => c.name && c.value)
}

const cabecalhos = lerCabecalhos().map((c) =>
  c.name === 'Content-Security-Policy'
    ? // no PC o endereço é http://localhost: sem isto, o navegador tentaria trocar tudo por https
      { ...c, value: c.value.replace(/;\s*upgrade-insecure-requests/, '') }
    : c,
)

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8',
}

// O Render entrega os arquivos de texto compactados (brotli ou gzip). Aqui fazemos o mesmo,
// para o tamanho dos arquivos e as medições de velocidade no PC serem parecidos com os do site no ar.
const compactaveis = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt'])
const guardados = new Map()
function compactar(arquivo, modificado, formato) {
  const chave = `${arquivo}|${modificado}|${formato}`
  if (!guardados.has(chave)) {
    const dados = readFileSync(arquivo)
    // qualidade 5: compacta rápido (a máxima seguraria o servidor por meio segundo no primeiro pedido)
    const opcoes = { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }
    guardados.set(chave, formato === 'br' ? brotliCompressSync(dados, opcoes) : gzipSync(dados))
  }
  return guardados.get(chave)
}

createServer((req, res) => {
  let caminho
  try {
    caminho = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end('Endereço inválido')
    return
  }
  for (const c of cabecalhos) {
    const vale = c.path === '/*' || (c.path.endsWith('/*') && caminho.startsWith(c.path.slice(0, -1)))
    if (vale) res.setHeader(c.name, c.value)
  }

  let arquivo = resolve(dist, `.${caminho}`)
  // nada de sair da pasta dist com "../"
  if (arquivo !== dist && !arquivo.startsWith(dist + sep)) {
    res.writeHead(403).end('Proibido')
    return
  }
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = resolve(arquivo, 'index.html')
  if (!existsSync(arquivo)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado')
    return
  }

  const { size: tamanho, mtimeMs: modificado } = statSync(arquivo)
  const extensao = extname(arquivo).toLowerCase()
  res.setHeader('Content-Type', tipos[extensao] ?? 'application/octet-stream')

  if (compactaveis.has(extensao)) {
    const aceita = String(req.headers['accept-encoding'] ?? '')
    const formato = /\bbr\b/.test(aceita) ? 'br' : /\bgzip\b/.test(aceita) ? 'gzip' : null
    res.setHeader('Vary', 'Accept-Encoding')
    if (formato) {
      const corpo = compactar(arquivo, modificado, formato)
      res.writeHead(200, { 'Content-Encoding': formato, 'Content-Length': corpo.length })
      res.end(req.method === 'HEAD' ? undefined : corpo)
      return
    }
  }
  res.setHeader('Accept-Ranges', 'bytes')

  // O vídeo pede pedaços do arquivo (Range): sem isso o navegador não deixa avançar nem voltar.
  const pedaco = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/)
  if (pedaco && (pedaco[1] || pedaco[2])) {
    const inicio = pedaco[1] ? Number(pedaco[1]) : Math.max(0, tamanho - Number(pedaco[2]))
    const fim = pedaco[1] && pedaco[2] ? Math.min(Number(pedaco[2]), tamanho - 1) : tamanho - 1
    if (inicio > fim || inicio >= tamanho) {
      res.writeHead(416, { 'Content-Range': `bytes */${tamanho}` }).end()
      return
    }
    res.writeHead(206, { 'Content-Range': `bytes ${inicio}-${fim}/${tamanho}`, 'Content-Length': fim - inicio + 1 })
    if (req.method === 'HEAD') res.end()
    else createReadStream(arquivo, { start: inicio, end: fim }).pipe(res)
    return
  }

  res.writeHead(200, { 'Content-Length': tamanho })
  if (req.method === 'HEAD') res.end()
  else createReadStream(arquivo).pipe(res)
}).listen(porta, () => {
  console.log(`Site no ar em http://localhost:${porta}/ (com os cabeçalhos do render.yaml)`)
})
