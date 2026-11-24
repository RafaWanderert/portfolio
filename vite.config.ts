import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { seo } from './src/content/site.ts'

// Preenche os {{marcadores}} do index.html (título, descrição, endereço...) com os dados de
// src/content/site.ts: para mudar o nome ou o endereço do site, basta editar aquele arquivo.
function dadosDoSite(): Plugin {
  const escapar = (texto: string) =>
    texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return {
    name: 'dados-do-site',
    transformIndexHtml: (html) =>
      html.replace(/\{\{(\w+)\}\}/g, (marcador, chave: string) =>
        Object.hasOwn(seo, chave) ? escapar(seo[chave as keyof typeof seo]) : marcador,
      ),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), dadosDoSite()],
  // Testes da lógica (src/lib e src/content) e do HTML que o servidor entrega (src/components):
  // rodam no Node, sem navegador. Os cliques são conferidos em scripts/teste-navegador.mjs.
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
})
