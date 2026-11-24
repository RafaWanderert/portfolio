import type { ReactNode } from 'react'

// Desenhos de traço fino (24×24, traço de 1,5), feitos à mão para este site.
// Setas e estrela são desenhos, e não caracteres, para não depender da fonte de cada aparelho.
const desenhos = {
  'seta-direita': <path d="M4 12h16M14 6l6 6-6 6" />,
  'seta-esquerda': <path d="M20 12H4M10 6l-6 6 6 6" />,
  'seta-baixo': <path d="M12 4v16M6 14l6 6 6-6" />,
  'seta-cima': <path d="M12 20V4M6 10l6-6 6 6" />,
  'seta-fora': <path d="M7 17 17 7M8 7h9v9" />,
  pausa: <path d="M8 5v14M16 5v14" />,
  tocar: <path d="M8 5.5v13l11-6.5z" />,
  estrela: (
    <path
      d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z"
      fill="currentColor"
      stroke="none"
    />
  ),
  mais: <path d="M12 5v14M5 12h14" />,
  whatsapp: (
    <>
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3a8.5 8.5 0 1 1 15.4-4.7z" />
      <path d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5" />
    </>
  ),
  email: <path d="M3.5 6h17v12h-17zM3.5 7l8.5 6 8.5-6" />,
  github: (
    <>
      <circle cx="6" cy="5.5" r="2" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="8.5" r="2" />
      <path d="M6 7.5v9M18 10.5c0 4-12 2-12 6" />
    </>
  ),
  linkedin: <path d="M4 4h16v16H4zM8 10.5V16M8 7.6v.4M12 16v-5.5M12 13c0-1.5 1-2.5 2.4-2.5s2.1 1 2.1 2.5v3" />,
  local: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </>
  ),
  // cadeado da barra de endereço e menu do celular, na janela de exemplo do "Como trabalho"
  cadeado: <path d="M6.5 11h11v9h-11zM9 11V8a3 3 0 0 1 6 0v3" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} satisfies Record<string, ReactNode>

export type NomeIcone = keyof typeof desenhos

/** Ícone de enfeite: o leitor de tela pula (o texto ao lado já diz o que é). */
export default function Icone({ nome, className }: { nome: NomeIcone; className?: string }) {
  return (
    <svg
      className={className ? `icone ${className}` : 'icone'}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {desenhos[nome]}
    </svg>
  )
}
