import type { Imagem } from '../content/projetos.ts'

/**
 * Captura de tela de um projeto. Com largura e altura declaradas, a página não "pula" quando
 * a imagem chega; "lazy" faz o navegador só baixar quando a pessoa está chegando perto.
 * "sizes" diz o tamanho em que a imagem aparece, para o navegador escolher o arquivo certo.
 */
export default function Captura({ imagem, sizes }: { imagem: Imagem; sizes: string }) {
  return (
    <img
      src={imagem.src}
      srcSet={imagem.srcSet}
      sizes={sizes}
      width={imagem.largura}
      height={imagem.altura}
      alt={imagem.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )
}
