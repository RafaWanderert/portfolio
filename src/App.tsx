import Barra from './components/Barra.tsx'
import Chamada from './components/Chamada.tsx'
import ComoTrabalho from './components/ComoTrabalho.tsx'
import Contato from './components/Contato.tsx'
import DadosEstruturados from './components/DadosEstruturados.tsx'
import Habilidades from './components/Habilidades.tsx'
import Inicio from './components/Inicio.tsx'
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
        {/* duas faixas de duas colunas, separadas por linhas com uma cruzinha em cada ponta */}
        <div className="dupla">
          <span className="cruz" />
          <span className="cruz" />
          <Sobre />
          <Habilidades />
        </div>
        <div className="dupla">
          <span className="cruz" />
          <span className="cruz" />
          <ComoTrabalho />
          <Chamada />
        </div>
        <Contato />
      </main>
      <Rodape />
      <DadosEstruturados />
    </>
  )
}
