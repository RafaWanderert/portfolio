// Teste do site pronto, num navegador de verdade (Edge ou Chrome, sem janela).
// Confere o que os testes do Vitest não alcançam: tamanhos, cliques, teclado, movimento e CSP.
// Uso: npm run build, npm run servir (deixe rodando) e, em outro terminal:
//      node scripts/teste-navegador.mjs                         (tudo)
//      node scripts/teste-navegador.mjs http://localhost:4190/ fita   (só um grupo)
// Grupos: geral, inicio, fita, secoes. Sai com código 1 se alguma checagem falhar.
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const lib =
  process.env.CDP_LIB ??
  pathToFileURL(join(homedir(), '.claude', 'skills', 'design-taste-frontend', 'scripts', 'lib', 'cdp.mjs')).href
const { Browser, sleep } = await import(lib)

const url = process.argv[2] || 'http://localhost:4190/'
const grupo = process.argv[3]
const roda = (g) => !grupo || grupo === g

let falhas = 0
let total = 0
const checa = (nome, ok, detalhe = '') => {
  total++
  if (!ok) falhas++
  console.log(`${ok ? 'OK     ' : 'FALHOU '} ${nome}${ok || detalhe === '' ? '' : `  → ${detalhe}`}`)
}
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// A tabela da seção 7.6 do desenho
const IDIOMAS = [
  ['PT', 'DESENVOLVEDOR', 'DE SOFTWARE'],
  ['EN', 'SOFTWARE', 'DEVELOPER'],
  ['JA', 'ソフトウェア', '開発者'],
  ['ES', 'DESARROLLADOR', 'DE SOFTWARE'],
  ['FR', 'DÉVELOPPEUR', 'LOGICIEL'],
  ['KO', '소프트웨어', '개발자'],
  ['DE', 'SOFTWARE-', 'ENTWICKLER'],
  ['IT', 'SVILUPPATORE', 'SOFTWARE'],
  ['RU', 'РАЗРАБОТЧИК', 'ПО'],
]
const PROJETOS = ['amabile', 'cuidar', 'helena']
const N = PROJETOS.length

const browser = await Browser.launch({ width: 1440, height: 900 })

/** Abre a página numa tela nova e passa a anotar erros do console e bloqueios da CSP. */
async function abrir(tela, { semMovimento = false, semJs = false, semFontes = false } = {}) {
  const page = await browser.newPage({ ...tela, reducedMotion: semMovimento })
  page.erros = page.consoleErrors
  browser.on(page.sessionId, 'Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error') page.erros.push(p.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300))
  })
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + (e.blockedURI || 'inline')));`,
  })
  if (semJs) await page.send('Emulation.setScriptExecutionDisabled', { value: true })
  if (semFontes) {
    await page.send('Network.enable')
    await page.send('Network.setBlockedURLs', { urls: ['*.woff2', '*.woff'] })
  }
  await page.goto(url, { settleMs: 1200 })
  return page
}

/** Centro de um elemento na tela, depois de rolar até ele. */
const centro = (page, seletor) =>
  page.eval(`(() => {
    const e = document.querySelector(${JSON.stringify(seletor)});
    if (!e) return null;
    e.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = e.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  })()`)

const mouse = (page, type, x, y, extra = {}) =>
  page.send('Input.dispatchMouseEvent', { type, x, y, button: 'none', ...extra })

/** Clique de verdade (com o mouse), não um .click() do JavaScript. */
async function clicar(page, seletor) {
  const p = await centro(page, seletor)
  if (!p) throw new Error(`Não achei ${seletor}`)
  await mouse(page, 'mouseMoved', p.x, p.y)
  await mouse(page, 'mousePressed', p.x, p.y, { button: 'left', clickCount: 1 })
  await mouse(page, 'mouseReleased', p.x, p.y, { button: 'left', clickCount: 1 })
}

/** Tira o mouse de cima de tudo (canto de cima, à esquerda). */
const afastarMouse = (page) => mouse(page, 'mouseMoved', 2, 2)

const tecla = async (page, key) => {
  const code = { ArrowRight: 39, ArrowLeft: 37 }[key]
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode: code })
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode: code })
}

// ------------------------------------------------------------------ geral
if (roda('geral')) {
  const telas = [
    { width: 320, height: 700, dsf: 2, mobile: true },
    { width: 390, height: 844, dsf: 2, mobile: true },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1300 },
  ]
  for (const tela of telas) {
    const tag = `[geral ${tela.width}]`
    const page = await abrir(tela, { semMovimento: true })
    const r = await page.eval(`(async () => {
      // passa pela página inteira para as imagens preguiçosas e as seções aparecerem
      for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((f) => setTimeout(f, 60)); }
      scrollTo(0, 0);
      const niveis = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
      const cortados = [...document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,span')].filter((e) => {
        if (e.closest('[aria-hidden="true"], .so-leitor, .fita')) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
      }).map((e) => (e.className || e.tagName) + ':' + e.textContent.trim().slice(0, 30));
      return {
        vaza: document.documentElement.scrollWidth - innerWidth,
        h1: document.querySelectorAll('h1').length,
        pulos: niveis.filter((n, i) => i > 0 && n - niveis[i - 1] > 1).length,
        imgsRuins: [...document.images].filter((i) => !i.hasAttribute('alt') || !i.getAttribute('width') || !i.getAttribute('height')).length,
        cortados,
        csp: window.__csp,
        robots: document.querySelector('meta[name=robots]')?.content,
      };
    })()`)
    checa(`${tag} nada vaza para o lado`, r.vaza <= 0, `${r.vaza}px a mais`)
    checa(`${tag} nenhum texto cortado na lateral`, r.cortados.length === 0, r.cortados.slice(0, 4).join(' | '))
    checa(`${tag} um só h1`, r.h1 === 1, `achou ${r.h1}`)
    checa(`${tag} títulos em ordem`, r.pulos === 0, `${r.pulos} pulo(s) de nível`)
    checa(`${tag} imagens com alt, width e height`, r.imgsRuins === 0, `${r.imgsRuins} sem`)
    checa(`${tag} sem bloqueio da CSP`, r.csp.length === 0, r.csp.join(' | '))
    checa(`${tag} sem erro no console`, page.erros.length === 0, page.erros.join(' | '))
    if (tela.width === 1440) {
      checa(`${tag} fora do Google (noindex)`, r.robots === 'noindex, nofollow', r.robots)
      const html = await page.eval(`fetch(location.href).then((r) => r.text())`)
      checa(`${tag} HTML do servidor sem style="..."`, !/<[a-z][^>]*\sstyle="/i.test(html))
      checa(`${tag} HTML do servidor já traz o conteúdo`, html.includes('Wanderert</') && html.includes('Vamos'))
    }
    if (tela.width === 390) {
      const toque = await page.eval(`(() => {
        const visivel = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('[inert], [aria-hidden="true"], [hidden]') && getComputedStyle(e).visibility !== 'hidden'; };
        const alvos = [...document.querySelectorAll('a, button')].filter(visivel);
        const baixos = alvos.filter((e) => { const r = e.getBoundingClientRect(); return r.height < 44 || r.width < 24; }).map((e) => (e.textContent.trim() || e.getAttribute('aria-label') || e.className).slice(0, 24) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height));
        // rótulos em letra de código (.mono) e comentários "// ..." não são texto corrido
        const miudos = [...document.querySelectorAll('p')].filter((p) => visivel(p) && !p.closest('.mono, .comentario, .so-leitor') && parseFloat(getComputedStyle(p).fontSize) < 16).map((p) => p.className + ' ' + getComputedStyle(p).fontSize);
        return { baixos, miudos, alvos: alvos.length };
      })()`)
      checa(`${tag} alvos de toque com 44px ou mais (${toque.alvos})`, toque.baixos.length === 0, toque.baixos.slice(0, 6).join(' | '))
      checa(`${tag} texto corrido com 16px ou mais`, toque.miudos.length === 0, toque.miudos.slice(0, 4).join(' | '))
    }
    await page.close()
  }

  // Sem JavaScript: tudo aparece, e os 4 projetos ficam um embaixo do outro com a sua ficha
  {
    const page = await abrir({ width: 1440, height: 900 }, { semJs: true })
    const r = await page.eval(`(() => {
      const aparece = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.99 && r.height > 0; };
      return {
        fichas: [...document.querySelectorAll('.ficha')].filter(aparece).length,
        escondidos: [...document.querySelectorAll('[data-revelar], [data-r]')].filter((e) => !aparece(e)).length,
        fundo: document.querySelector('.fundo__texto')?.textContent ?? '',
        vaza: document.documentElement.scrollWidth - innerWidth,
        ordem: [...document.querySelectorAll('#projetos .cartao, #projetos .ficha')].map((e) => ({ t: e.classList.contains('ficha') ? 'f' : 'c', y: Math.round(e.getBoundingClientRect().top + scrollY) })).sort((a, b) => a.y - b.y).map((e) => e.t).join(''),
      };
    })()`)
    checa(`[geral sem JS] as ${N} fichas aparecem`, r.fichas === N, `${r.fichas} visíveis`)
    checa('[geral sem JS] cada cartão vem seguido da sua ficha', r.ordem === 'cf'.repeat(N), r.ordem)
    checa('[geral sem JS] nenhuma parte fica escondida', r.escondidos === 0, `${r.escondidos} escondida(s)`)
    checa('[geral sem JS] fundo em português', r.fundo.includes('DESENVOLVEDOR'), r.fundo)
    checa('[geral sem JS] nada vaza para o lado', r.vaza <= 0, `${r.vaza}px a mais`)
    await page.close()
  }

  // Fontes bloqueadas: entra a fonte reserva e a página continua sem rolagem lateral
  for (const tela of [{ width: 390, height: 844, dsf: 2, mobile: true }, { width: 1440, height: 900 }]) {
    const page = await abrir(tela, { semFontes: true })
    const vaza = await page.eval(`document.documentElement.scrollWidth - innerWidth`)
    checa(`[geral ${tela.width} sem fontes] nada vaza para o lado`, vaza <= 0, `${vaza}px a mais`)
    await page.close()
  }
}

// ------------------------------------------------------------------ início
if (roda('inicio')) {
  {
    const page = await abrir({ width: 1440, height: 900 }, { semMovimento: true })
    const r = await page.eval(`(() => {
      const botao = [...document.querySelectorAll('.inicio a')].find((a) => a.textContent.includes('Pedir um site'));
      const ver = [...document.querySelectorAll('.inicio a')].find((a) => a.textContent.includes('Ver projetos'));
      return {
        h1: document.querySelector('h1')?.textContent.replace(/\\s+/g, ' ').trim(),
        whats: botao?.href ?? '',
        ver: ver?.getAttribute('href'),
        fundoEscondido: document.querySelector('.fundo')?.getAttribute('aria-hidden'),
        linhas: [...document.querySelectorAll('.fundo__texto span')].map((s) => s.textContent),
        codigos: [...document.querySelectorAll('.idiomas button')].map((b) => b.textContent.trim()),
        paradasDeTab: document.querySelectorAll('.idiomas button[tabindex="0"]').length,
        barraInerte: document.querySelector('.barra')?.hasAttribute('inert'),
      };
    })()`)
    checa('[inicio] h1 é o nome', r.h1 === 'Rafael Wanderert', r.h1)
    checa('[inicio] "Pedir um site" abre o WhatsApp com a mensagem', r.whats.startsWith('https://wa.me/5548984502000?text=Ol%C3%A1'), r.whats)
    checa('[inicio] "Ver projetos" leva à fita', r.ver === '#projetos', r.ver)
    checa('[inicio] fundo é enfeite (aria-hidden)', r.fundoEscondido === 'true', r.fundoEscondido)
    checa('[inicio] fundo começa em português', igual(r.linhas, ['DESENVOLVEDOR', 'DE SOFTWARE']), JSON.stringify(r.linhas))
    checa('[inicio] 9 códigos de idioma, na ordem', igual(r.codigos, IDIOMAS.map((i) => i[0])), JSON.stringify(r.codigos))
    checa('[inicio] os códigos são uma parada de Tab só', r.paradasDeTab === 1, `${r.paradasDeTab} paradas`)
    checa('[inicio] barra presa escondida no topo', r.barraInerte === true)
    await sleep(4200)
    const depois = await page.eval(`document.querySelector('.fundo__texto span')?.textContent`)
    checa('[inicio sem movimento] o fundo fica parado em português', depois === 'DESENVOLVEDOR', depois)
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ behavior: 'instant' })`)
    await sleep(500)
    const barra = await page.eval(`document.querySelector('.barra')?.hasAttribute('inert')`)
    checa('[inicio] barra presa aparece depois da primeira tela', barra === false)
    await page.close()
  }

  // Cada idioma: clicar fixa, o texto é o da tabela e cabe na largura (três tamanhos de tela)
  for (const tela of [{ width: 390, height: 844, dsf: 2, mobile: true }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    const page = await abrir(tela)
    const problemas = []
    for (const [i, [codigo, l1, l2]] of IDIOMAS.entries()) {
      await clicar(page, `.idiomas button:nth-child(${i + 1})`)
      await sleep(1300)
      const r = await page.eval(`(() => {
        const t = document.querySelector('.fundo__texto'); const h = document.querySelector('.inicio');
        const maior = Math.max(...[...t.querySelectorAll('span')].map((s) => s.getBoundingClientRect().right));
        return {
          fixo: document.querySelector('.idiomas button:nth-child(${i + 1})').getAttribute('aria-pressed'),
          linhas: [...t.querySelectorAll('span')].map((s) => s.textContent),
          sobra: h.getBoundingClientRect().right - maior,
          tamanho: parseFloat(getComputedStyle(t).fontSize),
        };
      })()`)
      if (r.fixo !== 'true') problemas.push(`${codigo}: não fixou`)
      if (!igual(r.linhas, [l1, l2])) problemas.push(`${codigo}: texto ${JSON.stringify(r.linhas)}`)
      if (r.sobra < 0) problemas.push(`${codigo}: vaza ${Math.round(-r.sobra)}px`)
      if (r.sobra > tela.width * 0.45 && tela.width <= 390) problemas.push(`${codigo}: pequeno demais (sobra ${Math.round(r.sobra)}px)`)
    }
    checa(`[inicio ${tela.width}] os 9 idiomas fixam, mostram o texto certo e cabem na tela`, problemas.length === 0, problemas.join(' | '))
    if (tela.width === 1440) {
      await clicar(page, '.idiomas button:nth-child(9)')
      await sleep(300)
      const solto = await page.eval(`document.querySelector('.idiomas button:nth-child(9)').getAttribute('aria-pressed')`)
      checa('[inicio] clicar de novo no mesmo código solta', solto === 'false', solto)
    }
    await page.close()
  }

  // Sem fixar: depois de 4 s o idioma já trocou sozinho
  {
    const page = await abrir({ width: 1440, height: 900 })
    await sleep(4300)
    const r = await page.eval(`({ atual: document.querySelector('.idiomas .idiomas__codigo--atual')?.textContent.trim(), linha: document.querySelector('.fundo__texto span')?.textContent })`)
    checa('[inicio] o fundo troca de idioma sozinho', r.atual !== 'PT' && r.linha !== 'DESENVOLVEDOR', JSON.stringify(r))
    await page.close()
  }

  // Telas baixas: nada se sobrepõe nem fica cortado; a primeira tela cresce
  for (const tela of [{ width: 1440, height: 600 }, { width: 844, height: 390, dsf: 2, mobile: true }, { width: 1440, height: 900 }, { width: 390, height: 844, dsf: 2, mobile: true }]) {
    const page = await abrir(tela, { semMovimento: true })
    const r = await page.eval(`(() => {
      const caixa = (s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { e: s, x1: r.left, y1: r.top + scrollY, x2: r.right, y2: r.bottom + scrollY }; };
      const cruza = (a, b) => a.x1 < b.x2 - 1 && b.x1 < a.x2 - 1 && a.y1 < b.y2 - 1 && b.y1 < a.y2 - 1;
      const partes = ['.inicio__alto', '.inicio__nome', '.inicio__papel', '.inicio__texto', '.inicio__acoes', '.inicio__local', '.fatos'].map(caixa);
      const heroi = caixa('.inicio');
      const cruzes = [];
      for (let i = 0; i < partes.length; i++) for (let j = i + 1; j < partes.length; j++) if (cruza(partes[i], partes[j])) cruzes.push(partes[i].e + ' × ' + partes[j].e);
      const fora = partes.filter((p) => p.y1 < heroi.y1 - 1 || p.y2 > heroi.y2 + 1 || p.x1 < -1 || p.x2 > innerWidth + 1).map((p) => p.e);
      const codigos = caixa('.idiomas');
      if (cruza(codigos, partes[1])) cruzes.push('.idiomas × .inicio__nome');
      if (cruza(codigos, partes[0])) cruzes.push('.idiomas × .inicio__alto');
      return { cruzes, fora, altura: heroi.y2 - heroi.y1, janela: innerHeight };
    })()`)
    const tag = `[inicio ${tela.width}×${tela.height}]`
    checa(`${tag} nome, botões e números não se sobrepõem`, r.cruzes.length === 0, r.cruzes.join(' | '))
    checa(`${tag} nada sai da primeira tela`, r.fora.length === 0, r.fora.join(' | '))
    checa(`${tag} a primeira tela ocupa a janela inteira ou mais`, r.altura >= r.janela - 1, `${Math.round(r.altura)} de ${r.janela}`)
    await page.close()
  }
}

// ------------------------------------------------------------------ fita
if (roda('fita')) {
  const estado = (page) =>
    page.eval(`({
      conta: document.querySelector('.controles__conta [aria-hidden]')?.textContent.trim(),
      cartao: document.querySelector('.cartao--ativo')?.dataset.projeto,
      ficha: document.querySelector('.ficha--ativa')?.id,
    })`)
  const coerente = (e, n) => e.conta === `0${n + 1} / 0${N}` && e.cartao === PROJETOS[n] && e.ficha === `ficha-${PROJETOS[n]}`

  {
    const page = await abrir({ width: 1440, height: 900 })
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ block: 'start', behavior: 'instant' })`)
    // pausa para os cliques não disputarem com o avanço sozinho
    await clicar(page, '.controles__pausa')
    let e = await estado(page)
    checa('[fita] começa no 01, com a ficha da Amabile', coerente(e, 0), JSON.stringify(e))
    const pausa = await page.eval(`document.querySelector('.controles__pausa').getAttribute('aria-pressed')`)
    checa('[fita] o botão de pausa fica marcado', pausa === 'true', pausa)

    await clicar(page, 'button[aria-label="Próximo projeto"]')
    await sleep(1100)
    e = await estado(page)
    checa('[fita] seta → vai para o 02 (Cuidar)', coerente(e, 1), JSON.stringify(e))
    await clicar(page, 'button[aria-label="Projeto anterior"]')
    await sleep(1100)
    await clicar(page, 'button[aria-label="Projeto anterior"]')
    await sleep(1100)
    e = await estado(page)
    checa('[fita] do 01, seta ← dá a volta para o último', coerente(e, N - 1), JSON.stringify(e))

    const lados = await page.eval(`(() => {
      const a = document.querySelector('.cartao--ativo').getBoundingClientRect();
      const outros = [...document.querySelectorAll('.cartao:not(.cartao--ativo)')].map((c) => c.getBoundingClientRect());
      return {
        esquerda: outros.some((r) => r.right <= a.left && r.right > 40),
        direita: outros.some((r) => r.left >= a.right && r.left < innerWidth - 40),
        centro: Math.abs(a.left + a.width / 2 - innerWidth / 2),
      };
    })()`)
    checa('[fita] há cartão visível dos dois lados do ativo', lados.esquerda && lados.direita, JSON.stringify(lados))
    checa('[fita] o cartão ativo fica no centro', lados.centro < 2, `${lados.centro}px fora`)

    await clicar(page, 'button[aria-label="Próximo projeto"]') // volta ao 01
    await sleep(1100)
    for (let i = 0; i < 10; i++) await clicar(page, 'button[aria-label="Próximo projeto"]')
    await sleep(1300)
    e = await estado(page)
    // dez passos a partir do 01, dando a volta quantas vezes for preciso
    const depoisDeDez = 10 % N
    checa('[fita] dez cliques seguidos terminam no lugar certo, com tudo coerente', coerente(e, depoisDeDez), JSON.stringify(e))

    await afastarMouse(page)
    await page.eval(`document.activeElement?.blur()`)
    await tecla(page, 'ArrowRight')
    await sleep(1100)
    e = await estado(page)
    checa('[fita] tecla → avança', coerente(e, (depoisDeDez + 1) % N), JSON.stringify(e))
    await tecla(page, 'ArrowLeft')
    await sleep(1100)
    e = await estado(page)
    checa('[fita] tecla ← volta', coerente(e, depoisDeDez), JSON.stringify(e))

    // Fichas: conteúdo e links de cada projeto (antes, volta ao 01)
    for (let i = depoisDeDez; i % N !== 0; i++) {
      await clicar(page, 'button[aria-label="Próximo projeto"]')
      await sleep(700)
    }
    await sleep(500)
    const problemas = []
    for (const [n, id] of PROJETOS.entries()) {
      const f = await page.eval(`(() => {
        const f = document.querySelector('.ficha--ativa');
        return {
          id: f.id,
          rotulos: [...f.querySelectorAll('h4')].map((h) => h.textContent.trim()),
          paragrafos: f.querySelectorAll('p').length,
          etiquetas: f.querySelectorAll('.etiquetas li').length,
          links: [...f.querySelectorAll('a')].map((a) => ({ t: a.textContent.trim(), h: a.href, alvo: a.target, rel: a.rel })),
          demo: !!f.querySelector('.demo__botao'),
          imagem: !!f.querySelector('.ficha__celular img'),
        };
      })()`)
      if (f.id !== `ficha-${id}`) problemas.push(`${id}: ficha ${f.id}`)
      for (const rotulo of ['O problema', 'O que eu fiz', 'Tecnologias']) if (!f.rotulos.includes(rotulo)) problemas.push(`${id}: falta "${rotulo}"`)
      if (f.etiquetas < 4) problemas.push(`${id}: ${f.etiquetas} tecnologias`)
      if (!f.imagem) problemas.push(`${id}: sem tela de celular`)
      for (const l of f.links) if (!l.h.startsWith('https://') || l.alvo !== '_blank' || !l.rel.includes('noopener')) problemas.push(`${id}: link "${l.t}" ${l.h}`)
      const temSite = f.links.some((l) => l.t.startsWith('Ver o site'))
      const temCodigo = f.links.some((l) => l.t.startsWith('Ver o código'))
      if ((id === 'amabile' || id === 'helena') && !(temSite && temCodigo)) problemas.push(`${id}: faltam os links`)
      if (id === 'cuidar' && f.links.length !== 0) problemas.push(`${id}: não devia ter link`)
      if (id === 'cuidar' && !f.demo) problemas.push('cuidar: sem botão do vídeo')
      if (n < N - 1) {
        await clicar(page, 'button[aria-label="Próximo projeto"]')
        await sleep(1100)
      }
    }
    checa(`[fita] as ${N} fichas têm problema, o que eu fiz, tecnologias e os links certos`, problemas.length === 0, problemas.join(' | '))

    // Vídeo do Cuidar: só carrega quando a pessoa pede
    await clicar(page, 'button[aria-label="Próximo projeto"]') // 01
    await sleep(600)
    await clicar(page, 'button[aria-label="Próximo projeto"]') // 02 (Cuidar)
    await sleep(1100)
    const antes = await page.eval(`document.querySelectorAll('video').length`)
    await clicar(page, '.ficha--ativa .demo__botao')
    await sleep(1500)
    const video = await page.eval(`(() => { const v = document.querySelector('.ficha--ativa video'); return v ? { tocando: !v.paused, tempo: v.currentTime, mudo: v.muted } : null; })()`)
    checa('[fita] o vídeo do Cuidar só entra na página depois do clique', antes === 0, `${antes} vídeo(s) antes`)
    checa('[fita] o vídeo do Cuidar toca ao clicar', !!video && video.tocando && video.tempo > 0, JSON.stringify(video))
    checa('[fita] sem erro no console', page.erros.length === 0, page.erros.join(' | '))
    await page.close()
  }

  // Avanço sozinho, pausa com o mouse e pelo botão
  {
    const page = await abrir({ width: 1440, height: 900 })
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ block: 'start', behavior: 'instant' })`)
    await afastarMouse(page)
    await sleep(4700)
    let e = await estado(page)
    checa('[fita] avança sozinha depois de ~4 s', coerente(e, 1), JSON.stringify(e))
    const p = await centro(page, '.cartao--ativo')
    await mouse(page, 'mouseMoved', p.x, p.y)
    await sleep(5000)
    e = await estado(page)
    checa('[fita] com o mouse em cima, não avança', coerente(e, 1), JSON.stringify(e))
    await afastarMouse(page)
    await sleep(4700)
    e = await estado(page)
    checa('[fita] tirando o mouse, volta a avançar', coerente(e, 2), JSON.stringify(e))
    await clicar(page, '.controles__pausa')
    await afastarMouse(page)
    await page.eval(`document.activeElement?.blur()`)
    await sleep(5000)
    e = await estado(page)
    checa('[fita] o botão de pausa segura a fita', coerente(e, 2), JSON.stringify(e))
    await clicar(page, '.controles__pausa')
    await afastarMouse(page)
    await page.eval(`document.activeElement?.blur()`)
    await sleep(4700)
    e = await estado(page)
    checa('[fita] soltando a pausa, volta a avançar', coerente(e, 3 % N), JSON.stringify(e))
    await page.close()
  }

  // Arraste com o mouse: 200 px para a esquerda avança um
  {
    const page = await abrir({ width: 1440, height: 900 })
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ block: 'start', behavior: 'instant' })`)
    await clicar(page, '.controles__pausa')
    const p = await centro(page, '.cartao--ativo .cartao__quadro')
    await mouse(page, 'mouseMoved', p.x, p.y)
    await mouse(page, 'mousePressed', p.x, p.y, { button: 'left', clickCount: 1 })
    for (let dx = 20; dx <= 200; dx += 20) {
      await mouse(page, 'mouseMoved', p.x - dx, p.y, { button: 'left', buttons: 1 })
      await sleep(16)
    }
    await mouse(page, 'mouseReleased', p.x - 200, p.y, { button: 'left', clickCount: 1 })
    await sleep(1200)
    const e = await estado(page)
    checa('[fita] arrastar 200 px para a esquerda avança um', coerente(e, 1), JSON.stringify(e))
    await page.close()
  }

  // Com "reduzir movimento": nada avança sozinho, mas as setas continuam funcionando
  {
    const page = await abrir({ width: 1440, height: 900 }, { semMovimento: true })
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ block: 'start', behavior: 'instant' })`)
    await afastarMouse(page)
    await sleep(5000)
    let e = await estado(page)
    checa('[fita sem movimento] não avança sozinha', coerente(e, 0), JSON.stringify(e))
    await clicar(page, 'button[aria-label="Próximo projeto"]')
    await sleep(300)
    e = await estado(page)
    checa('[fita sem movimento] a seta troca na hora', coerente(e, 1), JSON.stringify(e))
    await page.close()
  }

  // Celular: um cartão por vez, com a ponta do próximo, e a ficha empilhada
  {
    const page = await abrir({ width: 390, height: 844, dsf: 2, mobile: true }, { semMovimento: true })
    await page.eval(`document.querySelector('#projetos').scrollIntoView({ block: 'start', behavior: 'instant' })`)
    await sleep(400)
    const r = await page.eval(`(() => {
      const a = document.querySelector('.cartao--ativo').getBoundingClientRect();
      const prox = [...document.querySelectorAll('.cartao:not(.cartao--ativo)')].map((c) => c.getBoundingClientRect()).filter((r) => r.left >= a.right - 1).sort((x, y) => x.left - y.left)[0];
      const f = document.querySelector('.ficha--ativa');
      const texto = f.querySelector('.ficha__texto').getBoundingClientRect();
      const lado = f.querySelector('.ficha__lado').getBoundingClientRect();
      return { largura: a.width, ponta: prox ? innerWidth - prox.left : 0, empilhada: lado.top >= texto.bottom - 1 };
    })()`)
    checa('[fita 390] um cartão por vez, quase da largura da tela', r.largura > 280 && r.largura < 390, `${Math.round(r.largura)}px`)
    checa('[fita 390] a ponta do próximo aparece', r.ponta > 8 && r.ponta < 120, `${Math.round(r.ponta)}px`)
    checa('[fita 390] ficha empilhada', r.empilhada)
    await page.close()
  }
}

// ------------------------------------------------------------------ seções
if (roda('secoes')) {
  const page = await abrir({ width: 1440, height: 900 }, { semMovimento: true })
  const r = await page.eval(`(() => {
    const links = [...document.querySelectorAll('#contato a')].map((a) => a.href);
    return {
      secoes: ['sobre', 'habilidades', 'como-trabalho', 'contato'].map((id) => !!document.querySelector('#' + id + ' h2')),
      sobre: document.querySelector('#sobre')?.textContent ?? '',
      grupos: document.querySelectorAll('#habilidades .habilidades__grupo').length,
      etiquetas: document.querySelectorAll('#habilidades .etiquetas li').length,
      passos: [...document.querySelectorAll('#como-trabalho .passos > li h3')].map((h) => h.textContent.trim()),
      chamada: document.querySelector('.chamada a')?.href ?? '',
      links,
      contatoTitulo: document.querySelector('#contato h2')?.textContent.replace(/\\s+/g, ' ').trim(),
      rodape: document.querySelector('footer')?.textContent ?? '',
      topo: document.querySelector('footer a[href="#inicio"]')?.textContent.trim(),
      dados: (() => { try { return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent); } catch { return null; } })(),
    };
  })()`)
  checa('[secoes] sobre, habilidades, como trabalho e contato têm título', r.secoes.every(Boolean), JSON.stringify(r.secoes))
  checa('[secoes] o Sobre traz o texto do Rafa e a formação', r.sobre.includes('Me chamo Rafael') && r.sobre.includes('Uniasselvi'), r.sobre.slice(0, 80))
  checa('[secoes] 4 grupos e 18 tecnologias', r.grupos === 4 && r.etiquetas === 18, `${r.grupos} grupos, ${r.etiquetas} etiquetas`)
  checa('[secoes] 5 passos, na ordem', igual(r.passos, ['Conversa', 'Rascunho', 'Ajustes', 'Desenvolvimento', 'No ar']), JSON.stringify(r.passos))
  checa('[secoes] a chamada leva ao WhatsApp', r.chamada.startsWith('https://wa.me/5548984502000?text='), r.chamada)
  checa('[secoes] título do contato', r.contatoTitulo === 'Vamos conversar', r.contatoTitulo)
  checa(
    '[secoes] contato tem WhatsApp, e-mail, GitHub e LinkedIn',
    r.links.some((l) => l.startsWith('https://wa.me/5548984502000')) &&
      r.links.includes('mailto:rafael.j.w@hotmail.com') &&
      r.links.includes('https://github.com/RafaWanderert') &&
      r.links.includes('https://www.linkedin.com/in/rafael-wanderert-92450831b'),
    JSON.stringify(r.links),
  )
  checa('[secoes] rodapé com o ano, o nome e a volta ao topo', r.rodape.includes('© 2026 Rafael Wanderert') && r.topo === 'Voltar ao topo', r.rodape.slice(0, 80))
  checa(
    '[secoes] dados estruturados de pessoa, sem telefone nem e-mail',
    r.dados?.['@type'] === 'Person' && r.dados.name === 'Rafael Wanderert' && r.dados.sameAs?.length === 2 && !r.dados.telephone && !r.dados.email,
    JSON.stringify(r.dados)?.slice(0, 160),
  )
  checa('[secoes] sem erro no console', page.erros.length === 0, page.erros.join(' | '))
  await page.close()
}

await browser.close()
console.log(falhas ? `\n${falhas} de ${total} checagens falharam` : `\nTudo certo: ${total} checagens`)
process.exit(falhas ? 1 : 0)
