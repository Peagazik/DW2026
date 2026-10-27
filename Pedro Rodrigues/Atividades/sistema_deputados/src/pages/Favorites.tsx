import { Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DeputadoCard } from '../components/DeputadoCard'
import { alternarFavorito, lerFavoritos } from '../favoritos'

export function Favorites() {
  const [favoritos, setFavoritos] = useState(lerFavoritos())

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-marinho-900">Favoritos</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Os parlamentares marcados ficam salvos neste navegador e continuam disponíveis nas
          próximas visitas.
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="rounded border border-borda bg-white px-6 py-12 text-center">
          <Star size={28} strokeWidth={1.5} className="mx-auto text-marinho-400" />
          <h2 className="mt-3 text-base font-semibold text-marinho-900">Nenhum favorito salvo</h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
            Use o ícone de estrela nos cards da consulta ou na página de perfil para montar sua
            lista.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded bg-marinho-800 px-4 py-2 text-sm font-medium text-white hover:bg-marinho-900"
          >
            Ir para a consulta
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-600">
            {favoritos.length} {favoritos.length === 1 ? 'deputado salvo' : 'deputados salvos'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((deputado) => (
              <DeputadoCard
                key={deputado.id}
                deputado={deputado}
                favorito
                onFavoritar={() => setFavoritos(alternarFavorito(favoritos, deputado))}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
