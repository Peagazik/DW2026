import { ArrowRight, Star, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Favorito } from '../types'

interface Props {
  deputado: Favorito
  favorito: boolean
  onFavoritar: () => void
}

export function DeputadoCard({ deputado, favorito, onFavoritar }: Props) {
  const [fotoComErro, setFotoComErro] = useState(false)

  return (
    <article className="flex h-full gap-4 rounded border border-borda bg-white p-3 transition-colors hover:border-marinho-200">
      {deputado.urlFoto && !fotoComErro ? (
        <img
          src={deputado.urlFoto}
          alt={`Foto oficial de ${deputado.nome}`}
          loading="lazy"
          onError={() => setFotoComErro(true)}
          className="h-26 w-20 shrink-0 rounded-sm bg-marinho-50 object-cover object-top"
        />
      ) : (
        <div className="flex h-26 w-20 shrink-0 items-center justify-center rounded-sm bg-marinho-50 text-marinho-400">
          <User size={26} strokeWidth={1.5} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[15px] leading-snug font-semibold text-marinho-900">
          {deputado.nome}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {deputado.siglaPartido ?? 'Sem partido'}
          <span className="mx-1.5 text-slate-300">·</span>
          {deputado.siglaUf}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Link
            to={`/deputados/${deputado.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-marinho-700 hover:text-marinho-900"
          >
            Ver perfil
            <ArrowRight size={14} />
          </Link>

          <button
            type="button"
            onClick={onFavoritar}
            aria-pressed={favorito}
            aria-label={favorito ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            className={`rounded border p-1.5 transition-colors ${
              favorito
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-borda text-slate-500 hover:border-marinho-200 hover:text-marinho-700'
            }`}
          >
            <Star size={16} fill={favorito ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  )
}
