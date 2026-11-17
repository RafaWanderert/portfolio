# Portfólio do Rafael Wanderert

Site de uma página que apresenta o meu trabalho para quem quer um site ou um sistema.
Preto e violeta, com o texto "desenvolvedor de software" que se decodifica em 9 idiomas no fundo
e uma fita com os projetos.

## Tecnologias

- **React 19** e **TypeScript**
- **Vite 8**, com a página pré-renderizada no build (o HTML já sai pronto)
- **Tailwind CSS 4** como base, com o CSS do site em `src/index.css`
- **Vitest** para a lógica e um teste de navegador para o site pronto
- Sem biblioteca de animação: o movimento é CSS e poucos arquivos de TypeScript

## Como rodar

Você precisa do [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
npm install        # instala as dependências (só na primeira vez)
npm run dev        # abre o site em modo de desenvolvimento
```

Para ver o site do jeito que ele vai ao ar:

```bash
npm run build      # gera a pasta dist
npm run servir     # serve a dist em http://localhost:4190 com os mesmos cabeçalhos do Render
```

## Testes

```bash
npm test           # lógica e conteúdo (Vitest)
npm run lint       # oxlint
```

O teste de navegador confere o site pronto em várias larguras: cliques, teclado, movimento,
tamanhos de toque e se a política de segurança (CSP) bloqueia algo.
Com `npm run servir` rodando em outro terminal:

```bash
node scripts/teste-navegador.mjs                             # tudo
node scripts/teste-navegador.mjs http://localhost:4190/ fita # só um grupo
```

Grupos: `geral`, `inicio`, `fita` e `secoes`.

## Onde mudar o conteúdo

Todo o texto fica em `src/content/`. Não é preciso mexer nos componentes.

| Arquivo | O que tem |
| --- | --- |
| `site.ts` | Nome, contatos, textos, números da primeira tela, sobre, habilidades e passos |
| `projetos.ts` | Os projetos da fita, na ordem em que aparecem |
| `idiomas.ts` | As frases do texto de fundo |

### Incluir um projeto

1. Acrescente o site em `scripts/capturas.mjs` e rode `node scripts/capturas.mjs nome-do-projeto`.
   As capturas saem em `src/assets/projetos/`, já em WebP e em dois tamanhos.
2. Acrescente o projeto em `src/content/projetos.ts`.
3. Rode `npm test`: ele avisa se faltar um link, uma imagem ou uma descrição.

## Como o código está organizado

| Pasta | Papel |
| --- | --- |
| `src/content/` | Textos e dados |
| `src/lib/` | Contas que não dependem do navegador, cada uma com o seu teste |
| `src/hooks/` | Ligam essas contas ao navegador (tempo, arraste, teclado) |
| `src/components/` | As seções da página |
| `scripts/` | Pré-renderização, servidor local, capturas e teste de navegador |

Dois pontos que valem a leitura:

- **Decodificar** (`src/lib/decodificar.ts`): as letras embaralham e viram a frase no próximo idioma,
  da esquerda para a direita. As letras sorteadas são sempre da própria frase.
- **Fita** (`src/lib/fita.ts`): o cartão ativo é um número que só cresce ou diminui, e o projeto é
  esse número dando a volta na lista. Por isso a fita nunca "pula" ao voltar para o primeiro.

## Publicação

O site é estático e fica no [Render](https://render.com) (`render.yaml`), com o domínio próprio
`rafaelwanderert.com.br`, registrado no [Registro.br](https://registro.br).

- O endereço do site fica em `url`, em `src/content/site.ts`, e o mesmo domínio vai em `domains`,
  no `render.yaml`. Um teste confere se os dois batem.
- O DNS fica no próprio Registro.br, com dois registros:

  | Tipo | Nome | Valor |
  | --- | --- | --- |
  | `A` | (vazio) | `216.24.57.1` |
  | `CNAME` | `www` | o endereço `.onrender.com` que o Render mostra |

  O Render leva o www para o endereço sem www e cria o certificado do https sozinho.
  Nenhum registro `AAAA`: o Render usa só IPv4.
- Enquanto `publicado` for `false` em `src/content/site.ts`, a página sai com `noindex`
  e fica fora do Google.
- O build mostra o que ainda falta antes de publicar (um contato sem confirmação,
  um projeto com link pendente). Com `publicado: true` e algo faltando, o build para.
- A política de segurança (CSP) do `render.yaml` é conferida a cada build. Se ela ficar
  desatualizada, o build mostra a linha certa para colar.

## Acessibilidade e desempenho

- Um `h1`, títulos em ordem, foco visível e navegação por teclado.
- Tudo que se move sozinho tem pausa: os códigos de idioma fixam o fundo e a fita tem botão de pausa.
- Com "reduzir movimento" ligado no sistema, o fundo fica parado e a fita não avança sozinha.
- Sem JavaScript, a página inteira aparece e os projetos ficam um embaixo do outro.
- Fontes, imagens e vídeo ficam no próprio site: nada é pedido a terceiros.

## Fontes

Todas têm licença livre (SIL Open Font License) e são servidas pelo próprio site:
Anton, JetBrains Mono, Instrument Sans, Noto Sans JP, Black Han Sans e Sofia Sans Extra Condensed.
As três últimas entram recortadas, só com as letras das frases (`scripts/fontes.mjs`).

## Aviso

A psicóloga Helena Mendes é fictícia: o site dela é um modelo.
