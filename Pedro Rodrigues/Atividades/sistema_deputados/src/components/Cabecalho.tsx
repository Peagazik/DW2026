import { NavLink } from 'react-router-dom'

function classesLink({ isActive }: { isActive: boolean }) {
  const base = 'inline-block border-b-2 py-4 text-sm font-medium transition-colors'
  return isActive
    ? `${base} border-marinho-800 text-marinho-900`
    : `${base} border-transparent text-slate-500 hover:text-marinho-800`
}

export function Cabecalho() {
  return (
    <header className="bg-white">
      <div className="bg-marinho-900 text-marinho-100">
        <div className="mx-auto max-w-6xl px-4 py-1.5 text-[11px] sm:px-6">
          Dados abertos da Câmara dos Deputados · 57ª Legislatura
        </div>
      </div>

      <div className="border-b border-borda">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-3 py-3.5">
            <img src="/brasao.svg" alt="" className="h-8 w-8" />
            <span className="leading-tight">
              <span className="block text-base font-semibold text-marinho-900">
                Portal Parlamentar
              </span>
              <span className="block text-xs text-slate-500">Consulta de deputados federais</span>
            </span>
          </NavLink>

          <nav aria-label="Navegação principal" className="flex gap-6">
            <NavLink to="/" className={classesLink} end>
              Consulta
            </NavLink>
            <NavLink to="/favoritos" className={classesLink}>
              Favoritos
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
