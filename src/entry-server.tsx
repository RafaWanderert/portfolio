import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { projetos } from './content/projetos.ts'
import { contatos, pendencias, site } from './content/site.ts'
import { problemasParaPublicar } from './lib/publicacao.ts'

/** Usado só no build (scripts/prerender.mjs) para gerar o HTML completo da página. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

/** O site está marcado para ir a público? (veja "publicado" em src/content/site.ts) */
export const publicado: boolean = site.publicado

/** O que ainda falta antes de publicar: o build mostra esta lista e trava se "publicado" for true. */
export function problemas(): string[] {
  return problemasParaPublicar({ contatos, projetos: [...projetos, { nome: 'Site', pendencias }] })
}
