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
   * Publicado com o OK do Rafa em 24/11/2026.
   */
  publicado: true,
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
 * - projetos construídos (11 em 24/11/2026): os 3 da fita (Amabile, Cuidar e Helena Mendes),
 *   o GA-2100, este portfólio, 4 prévias de clientes que ainda não aprovaram aparecer (os nomes
 *   ficam nas anotações do Rafa, fora deste repositório público) e 2 ferramentas de trabalho do
 *   Rafa (o Rafa decidiu contá-las em 24/11/2026);
 * - sites no ar (4 em 24/11/2026, todos respondendo): Amabile, Helena Mendes, Cuidar e este
 *   portfólio;
 * - nota de desempenho deste site no Lighthouse. Em 24/11/2026, no site no ar (Lighthouse 13,
 *   Edge): 100 no celular e 100 no computador em desempenho, acessibilidade e boas práticas.
 *   Se não der 100 numa nova medição, entra o número real ou o item sai.
 */
export const fatos: { valor: string; rotulo: [string, string] }[] = [
  { valor: '11', rotulo: ['Projetos', 'construídos'] },
  { valor: '04', rotulo: ['Sites', 'no ar'] },
  { valor: '100', rotulo: ['Nota no', 'Lighthouse'] },
]
export const fatosConferidosEm = '2026-11-24'

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

/** Cores que o visitante pode escolher na janela de exemplo. Todas aceitam texto branco por cima. */
export type IdCor = 'violeta' | 'verde' | 'cafe' | 'rosa' | 'petroleo'
/** Letra do título na janela de exemplo (a fonte de cada uma está em comoTrabalho.letras). */
export type IdLetra = 'moderna' | 'marcante' | 'classica' | 'codigo'
/** Cantos do botão, da marca, da imagem e dos cartões da página de exemplo. */
export type IdCantos = 'retos' | 'suaves' | 'redondos'
/** Fundo da página de exemplo (a conversa e o rascunho continuam no papel branco). */
export type IdFundo = 'claro' | 'creme' | 'escuro'
/** O que o visitante escolhe no passo "Ajustes". */
export type Ajustes = { cor: IdCor; letra: IdLetra; cantos: IdCantos; fundo: IdFundo }

/**
 * "Como trabalho": o visitante escreve o nome do negócio e vê um site de exemplo nascer nos cinco passos.
 * O primeiro balão da conversa termina com ": {nome}." quando a pessoa escreveu um nome.
 * Cores e fundos também ficam em src/index.css ([data-cor], [data-fundo]); o teste da seção confere se batem.
 * Os valores de cantos e fundos aparecem no código do passo 4.
 */
export const comoTrabalho: {
  titulo: string
  texto: string
  campo: { rotulo: string; exemplo: string; max: number }
  passos: { titulo: string; texto: string }[]
  rotulos: Record<keyof Ajustes, string>
  cores: { id: IdCor; nome: string; valor: string }[]
  letras: { id: IdLetra; nome: string; fonte: string }[]
  cantos: { id: IdCantos; nome: string; valor: string }[]
  fundos: { id: IdFundo; nome: string; valor: string }[]
  padrao: Ajustes
  acao: string
  aviso: string
  pausa: { pausar: string; continuar: string; deNovo: string }
  janela: {
    conversa: [string, string]
    menu: string[]
    texto: string
    botao: string
    cartoes: { titulo: string; texto: string }[]
  }
} = {
  titulo: 'Como trabalho',
  texto: 'Seu negócio ainda não tem site? Escreva o nome dele e veja, passo a passo, como ele sai do papel.',
  campo: { rotulo: 'Nome do seu negócio', exemplo: 'Ex.: Padaria do Zé', max: 40 },
  passos: [
    { titulo: 'Conversa', texto: 'Entendo o seu negócio, o seu público e o que o site precisa resolver.' },
    { titulo: 'Rascunho', texto: 'Monto a primeira versão visual para você ver antes de qualquer compromisso.' },
    { titulo: 'Ajustes', texto: 'Você diz o que mudar e eu refino até ficar do seu jeito.' },
    {
      titulo: 'Desenvolvimento',
      texto: 'Programo o site para abrir rápido, funcionar no celular e aparecer no Google.',
    },
    { titulo: 'No ar', texto: 'Publico, testo e entrego tudo funcionando, no endereço do seu negócio.' },
  ],
  rotulos: { cor: 'Cor', letra: 'Letra', cantos: 'Cantos', fundo: 'Fundo' },
  cores: [
    { id: 'violeta', nome: 'Violeta', valor: '#6f4bff' },
    { id: 'verde', nome: 'Verde', valor: '#15803d' },
    { id: 'cafe', nome: 'Café', valor: '#92400e' },
    { id: 'rosa', nome: 'Rosa', valor: '#be185d' },
    { id: 'petroleo', nome: 'Petróleo', valor: '#0e7490' },
  ],
  letras: [
    { id: 'moderna', nome: 'Moderna', fonte: 'Instrument Sans' },
    { id: 'marcante', nome: 'Marcante', fonte: 'Anton' },
    { id: 'classica', nome: 'Clássica', fonte: 'Instrument Serif' },
    { id: 'codigo', nome: 'Código', fonte: 'JetBrains Mono' },
  ],
  cantos: [
    { id: 'retos', nome: 'Retos', valor: '0' },
    { id: 'suaves', nome: 'Suaves', valor: '8px' },
    { id: 'redondos', nome: 'Redondos', valor: '999px' },
  ],
  fundos: [
    { id: 'claro', nome: 'Claro', valor: '#ffffff' },
    { id: 'creme', nome: 'Creme', valor: '#f8f3ea' },
    { id: 'escuro', nome: 'Escuro', valor: '#1b1a21' },
  ],
  padrao: { cor: 'violeta', letra: 'moderna', cantos: 'suaves', fundo: 'claro' },
  acao: 'Pedir um site',
  aviso: 'Exemplo ilustrativo. Cada site é feito do zero, para o negócio de quem pede.',
  pausa: { pausar: 'Pausar', continuar: 'Continuar', deNovo: 'Ver de novo' },
  janela: {
    conversa: [
      'Oi, Rafael! Quero um site para o meu negócio',
      'Vamos lá! Me conte quem são os seus clientes e o que eles procuram.',
    ],
    menu: ['Início', 'Sobre', 'Contato'],
    texto: 'Conheça o nosso trabalho e fale com a gente pelo WhatsApp.',
    botao: 'Chamar no WhatsApp',
    cartoes: [
      { titulo: 'Sobre', texto: 'Quem somos e como atendemos.' },
      { titulo: 'Serviços', texto: 'O que você encontra aqui.' },
      { titulo: 'Contato', texto: 'Endereço, horários e WhatsApp.' },
    ],
  },
}

export const contato = {
  titulo: ['Vamos', 'conversar'],
  texto: 'Estou disponível para novos projetos. Me chame pelo canal que preferir.',
}

/** Perguntas frequentes, com as respostas do Rafa (aprovadas em 23/11/2026). Mudar um valor aqui muda no site. */
export const perguntas: { titulo: string; itens: { pergunta: string; resposta: string }[] } = {
  titulo: 'Perguntas frequentes',
  itens: [
    {
      pergunta: 'Quanto tempo leva para o site ficar pronto?',
      resposta: 'Em média 5 dias, da nossa primeira conversa até o site no ar.',
    },
    {
      pergunta: 'Quanto custa?',
      resposta: 'A partir de R$ 350. O valor final depende do tamanho do site: me chame no WhatsApp que eu passo o orçamento.',
    },
    {
      pergunta: 'Preciso pagar domínio e hospedagem?',
      resposta:
        'O domínio (.com.br) fica no seu nome e custa cerca de R$ 40 por ano no Registro.br. A hospedagem também fica no seu nome, no Render, e para um site como esse o plano gratuito costuma bastar.',
    },
    {
      pergunta: 'Consigo mudar o site depois?',
      resposta:
        'Sim. Uma alteração depois de pronto custa R$ 50. Se você precisa de atualizações com frequência, existe um plano mensal: é só me chamar para combinar.',
    },
    {
      pergunta: 'O site aparece no Google?',
      resposta:
        'Sim. Ele é feito para o Google encontrar, e eu cadastro o seu negócio no Perfil da Empresa no Google (o antigo Google Meu Negócio).',
    },
    {
      pergunta: 'Como é o pagamento?',
      resposta: 'Metade no início e metade na entrega.',
    },
  ],
}

export const rodape = {
  direitos: `© 2026 ${site.nome}`,
  topo: 'Voltar ao topo',
}

/** O que falta no site como um todo antes de publicar (os contatos e os projetos têm as suas). */
// Os três números da primeira tela foram conferidos no dia de publicar (24/11/2026).
export const pendencias: string[] = []
