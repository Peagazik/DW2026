import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Cabecalho } from './components/Cabecalho'
import { DeputyDetails } from './pages/DeputyDetails'
import { Favorites } from './pages/Favorites'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Cabecalho />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deputados/:id" element={<DeputyDetails />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="mt-16 border-t border-borda bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-slate-500 sm:px-6">
            Projeto acadêmico da disciplina de Desenvolvimento de Interfaces. As informações são
            consultadas em tempo real na API de Dados Abertos da Câmara dos Deputados.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
