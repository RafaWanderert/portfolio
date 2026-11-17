// Todo o texto do site fica nesta pasta. Para mudar um texto, um contato ou um número, edite aqui.
// Os nomes vão em letra normal: quem põe em MAIÚSCULAS é o CSS (assim o leitor de tela lê certo).
import { linkWhatsApp } from '../lib/whatsapp.ts'

/** Espaço que não quebra linha: mantém o telefone inteiro na mesma linha. */
const nbsp = String.fromCharCode(160)

export const site = {
  nome: 'Rafael Wanderert',
  /**
   * O endereço do site, sem barra no fim. Domínio próprio, registrado pelo Rafa no Registro.br
   * em 17/11/2026. Ele também vai no render.yaml (domains); o teste confere se os dois batem.
   */
  url: 'https://rafaelwanderert.com.br',
  cidade: 'Biguaçu · SC',
  /**
   * false = prévia: a página sai com "noindex" e fica fora do Google.
   * Só troque para true depois que o Rafa aprovar. O build confere antes se não falta nada
   * (veja "pendencias" no fim deste arquivo e src/lib/publicacao.ts).
   */
  publicado: false,
}

export const seo: Record<'nome' | 'titulo' | 'descricao' | 'url' | 'robots', string> = {
  nome: site.nome,
  titulo: `${site.nome} | Sites e sistemas sob medida`,
  descricao:
    'Desenvolvedor de software em Biguaçu (SC). Crio sites e sistemas sob medida: rápidos no celular, fáceis de achar no Google e com a cara da sua marca.',
  url: site.url,
  robots: site.publicado ? 'index, follow' : 'noindex, nofollow',
}

/** O botão "Pedir um site" abre o WhatsApp com esta mensagem pronta. */
export const whatsapp = {
  numero: '5548984502000',
  mensagem: 'Olá, Rafael! Vi o seu portfólio e quero conversar sobre um site.',
}

export type Canal = {
  id: 'whatsapp' | 'email' | 'github' | 'linkedin'
  rotulo: string
  texto: string
  href: string
  /** O Rafa já disse que este contato pode ir a público? Sem isso o site não é publicado. */
  confirmado: boolean
}

export const contatos: Canal[] = [
  {
    id: 'whatsapp',
    rotulo: 'WhatsApp',
    texto: `(48)${nbsp}98450-2000`,
    href: linkWhatsApp(whatsapp.numero, whatsapp.mensagem),
    // liberado pelo Rafa em 17/11/2026
    confirmado: true,
  },
  {
    id: 'email',
    rotulo: 'E-mail',
    texto: 'rafael.j.w@hotmail.com',
    href: 'mailto:rafael.j.w@hotmail.com',
    // liberado pelo Rafa em 17/11/2026
    confirmado: true,
  },
  {
    id: 'github',
    rotulo: 'GitHub',
    texto: 'github.com/RafaWanderert',
    href: 'https://github.com/RafaWanderert',
    confirmado: true,
  },
  {
    id: 'linkedin',
    rotulo: 'LinkedIn',
    texto: 'linkedin.com/in/rafael-wanderert',
    href: 'https://www.linkedin.com/in/rafael-wanderert-92450831b',
    confirmado: true,
  },
]

export const inicio = {
  rotulo: ['Portfólio', 'Sites e sistemas'],
  disponivel: 'Disponível para novos projetos',
  ola: '// olá, eu sou',
  nome: ['Rafael', 'Wanderert'],
  papel: 'Sites e sistemas sob medida',
  texto:
    'Crio sites e sistemas para o seu negócio. Rápidos no celular, fáceis de achar no Google e com a cara da sua marca.',
  acao: 'Pedir um site',
  verProjetos: 'Ver projetos',
  local: 'Biguaçu · SC — atendo online',
  nota: ['Ideias viram sites', 'que funcionam.'],
}

/**
 * Os três números da primeira tela. Todos são reais e precisam ser conferidos de novo
 * no dia de publicar:
 * - projetos construídos: os 3 da fita (Amabile, Cuidar e Helena Mendes), o GA-2100 (saiu da
 *   fita em 17/11/2026, mas continua sendo um projeto feito; se o Rafa preferir não contar,
 *   o número vira 07) e 4 prévias de clientes que ainda não aprovaram aparecer (os nomes ficam
 *   nas anotações do Rafa, fora deste repositório público);
 * - sites no ar: Amabile, Helena Mendes e Cuidar;
 * - nota de desempenho deste site no Lighthouse, medida depois do build. Em 16/11/2026, no PC
 *   (npm run servir + Edge): 100 no celular e 100 no computador. Meça de novo com o site no ar;
 *   se não der 100, entra o número real ou o item sai.
 */
export const fatos: { valor: string; rotulo: [string, string] }[] = [
  { valor: '08', rotulo: ['Projetos', 'construídos'] },
  { valor: '03', rotulo: ['Sites', 'no ar'] },
  { valor: '100', rotulo: ['Nota no', 'Lighthouse'] },
]
export const fatosConferidosEm = '2026-11-16'

export const sobre = {
  titulo: 'Sobre',
  paragrafos: [
    'Olá! Me chamo Rafael, sou desenvolvedor de software formado em Análise e Desenvolvimento de Sistemas. Construo meus projetos com JavaScript, TypeScript, Python, HTML e CSS.',
    'Crio sites e sistemas sob medida para pequenos negócios, do primeiro rascunho até a publicação. Hoje estudo automação e inteligência artificial para levar aos próximos projetos.',
  ],
  formacao: {
    rotulo: 'Formação',
    curso: 'Análise e Desenvolvimento de Sistemas',
    escola: 'Uniasselvi',
    periodo: '2024–2026',
  },
}

export const habilidades = {
  titulo: 'Tecnologias que uso nos projetos',
  grupos: [
    { grupo: 'Linguagens', itens: ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'SQL'] },
    { grupo: 'Front-end', itens: ['React', 'Tailwind CSS', 'Vite', 'GSAP', 'PWA'] },
    { grupo: 'Back-end e dados', itens: ['Node.js', 'Express', 'PostgreSQL'] },
    { grupo: 'Ferramentas', itens: ['Git', 'GitHub', 'Figma', 'Render'] },
  ],
}

/** Nome do desenho que acompanha cada passo (os desenhos ficam em src/components/Icone.tsx). */
export type IconePasso = 'conversa' | 'rascunho' | 'ajustes' | 'codigo' | 'foguete'

export const comoTrabalho: { titulo: string; passos: { titulo: string; texto: string; icone: IconePasso }[] } = {
  titulo: 'Como trabalho',
  passos: [
    {
      titulo: 'Conversa',
      texto: 'Entendo o seu negócio, o seu público e o que o site precisa resolver.',
      icone: 'conversa',
    },
    {
      titulo: 'Rascunho',
      texto: 'Monto a primeira versão visual para você ver antes de qualquer compromisso.',
      icone: 'rascunho',
    },
    {
      titulo: 'Ajustes',
      texto: 'Você diz o que mudar e eu refino até ficar do seu jeito.',
      icone: 'ajustes',
    },
    {
      titulo: 'Desenvolvimento',
      texto: 'Programo o site para abrir rápido, funcionar no celular e aparecer no Google.',
      icone: 'codigo',
    },
    {
      titulo: 'No ar',
      texto: 'Publico, testo e entrego tudo funcionando.',
      icone: 'foguete',
    },
  ],
}

export const chamada = {
  texto: ['Seu negócio ainda não tem site?', 'Me conte o que você precisa.'],
  acao: 'Pedir um site',
}

export const contato = {
  titulo: ['Vamos', 'conversar'],
  texto: 'Estou disponível para novos projetos. Me chame pelo canal que preferir.',
}

export const rodape = {
  direitos: `© 2026 ${site.nome}`,
  topo: 'Voltar ao topo',
  /** Endereço do código deste site no GitHub (repositório público, criado em 17/11/2026). */
  codigo: 'https://github.com/RafaWanderert/portfolio' as string | undefined,
  textoCodigo: 'Ver o código deste site',
}

/** O que falta no site como um todo antes de publicar (os contatos e os projetos têm as suas). */
export const pendencias: string[] = [
  'conferir de novo os três números da primeira tela ("fatos") no dia de publicar',
]
