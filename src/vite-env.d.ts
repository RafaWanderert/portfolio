/// <reference types="vite/client" />
interface Window {
  /** O React avisa aqui que montou: sem isso em 4 s, o index.html mostra tudo sem animação. */
  __revelar?: boolean
}

// O Vite devolve o endereço final do arquivo quando um vídeo é importado.
declare module '*.mp4' {
  const endereco: string
  export default endereco
}
