// Tira as capturas que aparecem na fita de projetos e a imagem de compartilhamento.
// Cada site é fotografado no computador (1440×900) e no celular (390×844), já em WebP e em dois tamanhos.
// Uso: node scripts/capturas.mjs            (tudo)
//      node scripts/capturas.mjs amabile og (só o que for pedido)
// Alvos: amabile, helena, cuidar, og.
// Para um site que ainda não está no ar, sirva a pasta dele no PC e use o endereço local.
import { mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// O navegador é controlado pela biblioteca da skill design-taste-frontend (a mesma dos outros sites).
// Em outro computador, aponte CDP_LIB para o arquivo cdp.mjs.
const lib =
  process.env.CDP_LIB ??
  pathToFileURL(join(homedir(), '.claude', 'skills', 'design-taste-frontend', 'scripts', 'lib', 'cdp.mjs')).href
const { Browser, sleep } = await import(lib)

const raiz = resolve(import.meta.dirname, '..')
const pasta = resolve(raiz, 'src', 'assets', 'projetos')
mkdirSync(pasta, { recursive: true })

const sites = {
  amabile: 'https://psicoamabilewanderert.onrender.com/',
  helena: 'https://site-psicologo1.onrender.com/',
}
const pedidos = process.argv.slice(2)
const quer = (alvo) => pedidos.length === 0 || pedidos.includes(alvo)

/** Grava o que está na tela. "escala" 0.5 dá a versão com metade do tamanho. */
async function gravar(page, arquivo, { largura, altura, escala = 1, formato = 'webp', qualidade = 82 }) {
  const { data } = await page.send(
    'Page.captureScreenshot',
    { format: formato, quality: qualidade, clip: { x: 0, y: 0, width: largura, height: altura, scale: escala } },
    45000,
  )
  writeFileSync(arquivo, Buffer.from(data, 'base64'))
  console.log(arquivo.split(/[/\\]/).pop())
}

/** Espera as fontes e as imagens e volta para o topo da página. */
async function assentar(page) {
  await page.eval(`(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((i) => i.loading !== 'lazy').map((i) => i.decode().catch(() => {})));
    window.scrollTo(0, 0);
    return true;
  })()`)
  await sleep(1200)
}

/** Põe cada vídeo da página no segundo indicado em data-t e espera o quadro aparecer. */
async function pararVideos(page) {
  await page.eval(`(async () => {
    await Promise.all([...document.querySelectorAll('video')].map((v) => new Promise((pronto) => {
      const ir = () => { v.addEventListener('seeked', pronto, { once: true }); v.currentTime = Number(v.dataset.t); };
      if (v.readyState >= 1) ir(); else v.addEventListener('loadedmetadata', ir, { once: true });
    })));
    return true;
  })()`)
  await sleep(600)
}

const browser = await Browser.launch({ width: 1440, height: 900 })

for (const [nome, url] of Object.entries(sites)) {
  if (!quer(nome)) continue
  // "reduzir movimento" faz as animações de entrada já aparecerem no estado final
  const computador = await browser.newPage({ width: 1440, height: 900, reducedMotion: true })
  await computador.goto(url, { settleMs: 2500 })
  await assentar(computador)
  await gravar(computador, resolve(pasta, `${nome}-1440.webp`), { largura: 1440, altura: 900 })
  await gravar(computador, resolve(pasta, `${nome}-720.webp`), { largura: 1440, altura: 900, escala: 0.5 })
  await computador.close()

  // dsf 2 = tela de celular com o dobro de pontos: a captura sai com 780×1688
  const celular = await browser.newPage({ width: 390, height: 844, dsf: 2, mobile: true, reducedMotion: true })
  await celular.goto(url, { settleMs: 2500 })
  await assentar(celular)
  await gravar(celular, resolve(pasta, `${nome}-celular-780.webp`), { largura: 390, altura: 844 })
  await gravar(celular, resolve(pasta, `${nome}-celular-390.webp`), { largura: 390, altura: 844, escala: 0.5 })
  await celular.close()
}

if (quer('cuidar')) {
  // O Cuidar é um app de celular e o acesso é por convite: a capa são três quadros do vídeo de demonstração.
  const capa = pathToFileURL(resolve(raiz, 'scripts', 'cuidar-capa.html')).href
  const computador = await browser.newPage({ width: 1440, height: 900 })
  await computador.goto(capa, { settleMs: 1200 })
  await pararVideos(computador)
  await gravar(computador, resolve(pasta, 'cuidar-1440.webp'), { largura: 1440, altura: 900 })
  await gravar(computador, resolve(pasta, 'cuidar-720.webp'), { largura: 1440, altura: 900, escala: 0.5 })
  await computador.close()

  // Capa do vídeo na ficha: a primeira tela sozinha (o vídeo tem 390×844 de imagem útil)
  const tela = await browser.newPage({ width: 390, height: 844 })
  await tela.goto(`${capa}?uma`, { settleMs: 1200 })
  await pararVideos(tela)
  await gravar(tela, resolve(pasta, 'cuidar-tela-390.webp'), { largura: 390, altura: 844 })
  await tela.close()
}

if (quer('og')) {
  // Imagem que aparece quando o link é compartilhado (WhatsApp, LinkedIn...). JPEG, porque nem todo app lê WebP.
  const page = await browser.newPage({ width: 1200, height: 630 })
  await page.goto(pathToFileURL(resolve(raiz, 'scripts', 'og.html')).href, { settleMs: 800 })
  const fontes = await page.eval(`(async () => {
    await document.fonts.ready;
    return ['Anton', 'Mono', 'Sans'].every((f) => document.fonts.check('20px "' + f + '"'));
  })()`)
  if (!fontes) throw new Error('og.html: as fontes não carregaram (rode "npm install" antes)')
  await gravar(page, resolve(raiz, 'public', 'og.jpg'), { largura: 1200, altura: 630, formato: 'jpeg', qualidade: 88 })
  await page.close()
}

await browser.close()
process.exit(0)
