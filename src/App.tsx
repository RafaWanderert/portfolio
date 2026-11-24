import Barra from './components/Barra.tsx'
import ComoTrabalho from './components/ComoTrabalho.tsx'
import Contato from './components/Contato.tsx'
import DadosEstruturados from './components/DadosEstruturados.tsx'
import Habilidades from './components/Habilidades.tsx'
import Inicio from './components/Inicio.tsx'
import Perguntas from './components/Perguntas.tsx'
import Projetos from './components/Projetos.tsx'
import Rodape from './components/Rodape.tsx'
import Sobre from './components/Sobre.tsx'
import { useRevelar } from './hooks/useRevelar.ts'

export default function App() {
  useRevelar()
  return (
    <>
      <a className="pular" href="#projetos">
        Pular para os projetos
      </a>
      <Barra />
      <Inicio />
      <main id="conteudo">
        <Projetos />
        {/* faixa de duas colunas, entre linhas com uma cruzinha em cada ponta */}
        <div className="dupla">
          <span className="cruz" />
          <span className="cruz" />
          <Sobre />
          <Habilidades />
        </div>
        <ComoTrabalho />
        <Perguntas />
        <Contato />
      </main>
      <Rodape />
      <DadosEstruturados />
    </>
  )
}
