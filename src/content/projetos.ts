// Os projetos da fita, na ordem em que passam: primeiro o site de cliente real,
// depois o sistema e o modelo. Para incluir um projeto, acrescente um item aqui
// e gere as capturas com "node scripts/capturas.mjs".
import amabile1440 from '../assets/projetos/amabile-1440.webp'
import amabile720 from '../assets/projetos/amabile-720.webp'
import amabileCelular390 from '../assets/projetos/amabile-celular-390.webp'
import amabileCelular780 from '../assets/projetos/amabile-celular-780.webp'
import cuidar1440 from '../assets/projetos/cuidar-1440.webp'
import cuidar720 from '../assets/projetos/cuidar-720.webp'
import cuidarDemo from '../assets/projetos/cuidar-demo.mp4'
import cuidarTela390 from '../assets/projetos/cuidar-tela-390.webp'
import helena1440 from '../assets/projetos/helena-1440.webp'
import helena720 from '../assets/projetos/helena-720.webp'
import helenaCelular390 from '../assets/projetos/helena-celular-390.webp'
import helenaCelular780 from '../assets/projetos/helena-celular-780.webp'

/** Espaço que não quebra linha: "1440 px" nunca fica dividido em duas linhas. */
const nbsp = String.fromCharCode(160)

export type Imagem = {
  /** O arquivo maior. */
  src: string
  /** Os tamanhos disponíveis: o navegador baixa só o que a tela precisa. */
  srcSet: string
  largura: number
  altura: number
  /** Descrição da imagem para quem usa leitor de tela. */
  alt: string
}

export type Projeto = {
  id: string
  nome: string
  /** Linha curta abaixo do nome no cartão. */
  tipo: string
  /** De quem é o trabalho: cliente real, projeto próprio, modelo ou estudo. */
  selo: string
  problema: string
  feito: string
  /** Aviso que a ficha precisa mostrar (pessoa fictícia, marca de terceiros...). */
  aviso?: string
  tecnologias: string[]
  /** Endereço do site no ar. Sem ele, "semSite" explica por quê. */
  site?: string
  semSite?: string
  /** Endereço do código, quando é público. Sem ele, "semCodigo" explica por quê. */
  codigo?: string
  semCodigo?: string
  /** O que falta resolver antes de o portfólio ir a público (o build confere). */
  pendencias?: string[]
  /** Captura da primeira tela no computador (1440×900). */
  capa: Imagem
  /** Captura no celular (780×1688), mostrada na ficha. */
  celular?: Imagem
  /** No lugar da captura de celular, um vídeo curto de demonstração. */
  video?: { src: string; capa: Imagem; legenda: string }
}

const capa = (menor: string, maior: string, alt: string): Imagem => ({
  src: maior,
  srcSet: `${menor} 720w, ${maior} 1440w`,
  largura: 1440,
  altura: 900,
  alt,
})

const celular = (menor: string, maior: string, alt: string): Imagem => ({
  src: maior,
  srcSet: `${menor} 390w, ${maior} 780w`,
  largura: 780,
  altura: 1688,
  alt,
})

export const projetos: readonly Projeto[] = [
  {
    id: 'amabile',
    nome: 'Amabile Wanderert',
    tipo: 'Site · psicologia infantojuvenil',
    selo: 'Cliente real',
    problema:
      'A Amabile é psicóloga e neuropsicóloga infantojuvenil e precisava de um site de apresentação, com a formação e os atendimentos dela, no clima acolhedor do consultório.',
    feito:
      'Parti das cores e dos traços da arte que ela já usava. Cada seção chega com um fio que se desenha ao rolar, e há uma brincadeira de respiração com um balão para as crianças. O texto do Sobre é dela, palavra por palavra.',
    tecnologias: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    site: 'https://psicoamabilewanderert.onrender.com',
    codigo: 'https://github.com/RafaWanderert/Site_Amabile',
    capa: capa(
      amabile720,
      amabile1440,
      'Primeira tela do site da Amabile Wanderert: o nome dela em letras claras sobre fundo roxo, ao lado de uma foto dela no consultório.',
    ),
    celular: celular(
      amabileCelular390,
      amabileCelular780,
      'O site da Amabile Wanderert no celular: a foto dela em um arco e o nome logo abaixo.',
    ),
  },
  {
    id: 'cuidar',
    nome: 'Cuidar',
    tipo: 'App · escala da família',
    selo: 'Projeto próprio',
    problema:
      'Minha família divide os cuidados com a minha avó. Faltava um lugar só para ver quem fica em cada dia, trocar de dia e deixar recado para o próximo.',
    feito:
      'Um app que se instala na tela do celular e avisa todo mundo quando alguém cancela um dia. Letras e botões grandes, porque parte da família tem pouca prática com tecnologia. Login com a conta do Google, sem senha. Banco PostgreSQL com as regras de acesso por família.',
    tecnologias: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'PWA'],
    semSite: 'App da família: o acesso é por convite.',
    semCodigo: 'Código privado.',
    capa: capa(
      cuidar720,
      cuidar1440,
      'Três telas do app Cuidar no celular: a escala do dia, o recado para quem cuida amanhã e os pedidos de troca.',
    ),
    video: {
      src: cuidarDemo,
      capa: {
        src: cuidarTela390,
        srcSet: `${cuidarTela390} 390w`,
        largura: 390,
        altura: 844,
        alt: 'Tela inicial do app Cuidar: o aviso “Hoje é o seu dia de cuidar” e o calendário do mês.',
      },
      legenda: 'Demonstração de 20 segundos, com dados de exemplo.',
    },
  },
  {
    id: 'helena',
    nome: 'Helena Mendes',
    tipo: 'Site modelo · psicologia',
    selo: 'Modelo',
    problema:
      'Modelo de página para psicóloga com atendimento online: apresentar a profissional, explicar como funciona e levar ao primeiro contato.',
    feito:
      `Desenhei o layout no Figma e programei igual, comparando as duas versões medida por medida na largura de 1440${nbsp}px. O formulário abre o WhatsApp com a mensagem pronta. Lighthouse em 04/11/2026: 100 no computador e 97 no celular.`,
    aviso: 'A psicóloga é fictícia: o site é um modelo.',
    tecnologias: ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    site: 'https://site-psicologo1.onrender.com',
    codigo: 'https://github.com/RafaWanderert/site-psicologo1',
    capa: capa(
      helena720,
      helena1440,
      'Primeira tela do site modelo da psicóloga Helena Mendes: o título “Um espaço para olhar com calma para o que você vive” ao lado de uma foto.',
    ),
    celular: celular(
      helenaCelular390,
      helenaCelular780,
      'O site modelo da Helena Mendes no celular: o título e o botão para marcar uma conversa.',
    ),
  },
]
