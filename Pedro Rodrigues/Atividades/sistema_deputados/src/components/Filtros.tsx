import { Search, X } from 'lucide-react'
import type { Partido, Uf } from '../types'

interface Props {
  busca: string
  partido: string
  uf: string
  partidos: Partido[]
  ufs: Uf[]
  onBusca: (valor: string) => void
  onPartido: (valor: string) => void
  onUf: (valor: string) => void
  onLimpar: () => void
}

const classesCampo =
  'w-full rounded border border-borda bg-white px-3 py-2 text-sm text-marinho-900 placeholder:text-slate-400 focus:border-marinho-600 focus:outline-none'

const classesRotulo = 'mb-1.5 block text-xs font-medium text-slate-600'

export function Filtros({
  busca,
  partido,
  uf,
  partidos,
  ufs,
  onBusca,
  onPartido,
  onUf,
  onLimpar,
}: Props) {
  const temFiltros = Boolean(busca || partido || uf)

  return (
    <section aria-label="Filtros de consulta">
      <div className="grid gap-4 rounded border border-borda bg-white p-4 sm:p-5 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <div>
          <label htmlFor="busca" className={classesRotulo}>
            Buscar por nome
          </label>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
            />
            <input
              id="busca"
              type="search"
              value={busca}
              onChange={(evento) => onBusca(evento.target.value)}
              placeholder="Nome parlamentar ou civil"
              className={`${classesCampo} pl-9`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="partido" className={classesRotulo}>
            Partido
          </label>
          <select
            id="partido"
            value={partido}
            onChange={(evento) => onPartido(evento.target.value)}
            className={classesCampo}
          >
            <option value="">Todos os partidos</option>
            {partidos.map((item) => (
              <option key={item.id} value={item.sigla}>
                {item.sigla}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="uf" className={classesRotulo}>
            UF
          </label>
          <select
            id="uf"
            value={uf}
            onChange={(evento) => onUf(evento.target.value)}
            className={classesCampo}
          >
            <option value="">Todas as UFs</option>
            {ufs.map((item) => (
              <option key={item.sigla} value={item.sigla}>
                {item.sigla}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onLimpar}
          disabled={!temFiltros}
          className="rounded border border-borda px-4 py-2 text-sm font-medium text-slate-600 enabled:hover:border-marinho-200 enabled:hover:text-marinho-800 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          Limpar filtros
        </button>
      </div>

      {temFiltros && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {busca && <FiltroAtivo rotulo="Nome" valor={busca} onRemover={() => onBusca('')} />}
          {partido && (
            <FiltroAtivo rotulo="Partido" valor={partido} onRemover={() => onPartido('')} />
          )}
          {uf && <FiltroAtivo rotulo="UF" valor={uf} onRemover={() => onUf('')} />}
        </ul>
      )}
    </section>
  )
}

function FiltroAtivo({
  rotulo,
  valor,
  onRemover,
}: {
  rotulo: string
  valor: string
  onRemover: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onRemover}
        className="inline-flex items-center gap-1.5 rounded border border-borda bg-white py-1 pr-1.5 pl-2.5 text-xs text-slate-600 hover:border-marinho-200 hover:text-marinho-800"
      >
        <span>
          {rotulo}: <strong className="font-semibold">{valor}</strong>
        </span>
        <X size={13} />
        <span className="sr-only">Remover filtro</span>
      </button>
    </li>
  )
}
