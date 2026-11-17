// O texto gigante do fundo: "desenvolvedor de software" em 9 idiomas, sempre em duas linhas.
// A ordem é a da lista e começa sempre em português.

export type Idioma = {
  /** O código que aparece no canto da primeira tela. */
  codigo: string
  /** O nome por extenso, para o leitor de tela não ler só duas letras soltas. */
  nome: string
  /** O idioma no padrão da web, para o navegador escolher os desenhos certos das letras. */
  lang: string
  /** Qual letra usar: latina (Anton), japonesa, coreana ou russa (veja as classes .f-* no CSS). */
  fonte: 'la' | 'ja' | 'ko' | 'ru'
  linhas: readonly [string, string]
  /**
   * Largura da linha mais larga, em "em" (com a letra em 1em), medida no navegador com a fonte certa.
   * O CSS usa este número para o texto ocupar a largura da tela sem vazar. Se trocar uma frase
   * ou uma fonte, meça de novo (o teste de navegador avisa quando o texto vaza).
   */
  largura: number
  /** O japonês e o coreano são mais "cheios": entram um pouco menores, como no modelo aprovado. */
  escala?: number
}

export const idiomas: readonly Idioma[] = [
  // larguras medidas em 16/11/2026 (Edge), com uma folga de 0,02em
  { codigo: 'PT', nome: 'português', lang: 'pt', fonte: 'la', linhas: ['DESENVOLVEDOR', 'DE SOFTWARE'], largura: 5.97 },
  { codigo: 'EN', nome: 'inglês', lang: 'en', fonte: 'la', linhas: ['SOFTWARE', 'DEVELOPER'], largura: 4.05 },
  { codigo: 'JA', nome: 'japonês', lang: 'ja', fonte: 'ja', linhas: ['ソフトウェア', '開発者'], largura: 5.9, escala: 0.8 },
  { codigo: 'ES', nome: 'espanhol', lang: 'es', fonte: 'la', linhas: ['DESARROLLADOR', 'DE SOFTWARE'], largura: 6.05 },
  { codigo: 'FR', nome: 'francês', lang: 'fr', fonte: 'la', linhas: ['DÉVELOPPEUR', 'LOGICIEL'], largura: 5 },
  { codigo: 'KO', nome: 'coreano', lang: 'ko', fonte: 'ko', linhas: ['소프트웨어', '개발자'], largura: 4.22, escala: 0.84 },
  { codigo: 'DE', nome: 'alemão', lang: 'de', fonte: 'la', linhas: ['SOFTWARE-', 'ENTWICKLER'], largura: 4.5 },
  { codigo: 'IT', nome: 'italiano', lang: 'it', fonte: 'la', linhas: ['SVILUPPATORE', 'SOFTWARE'], largura: 5.22 },
  { codigo: 'RU', nome: 'russo', lang: 'ru', fonte: 'ru', linhas: ['РАЗРАБОТЧИК', 'ПО'], largura: 4.85 },
]
