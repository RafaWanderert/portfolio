import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
// As fontes vêm dos pacotes @fontsource e ficam no próprio site (nada é pedido ao Google).
import '@fontsource/anton/latin-400.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './index.css'
import App from './App.tsx'

const raiz = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// No build o HTML já vem pré-renderizado: o React só "acorda" a página.
if (raiz.hasChildNodes()) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
