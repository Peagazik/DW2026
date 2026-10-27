import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-semibold tracking-widest text-slate-400">ERRO 404</p>
      <h1 className="mt-3 text-2xl font-semibold text-marinho-900">Página não encontrada</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        O endereço acessado não corresponde a nenhuma página do Portal Parlamentar.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded bg-marinho-800 px-4 py-2 text-sm font-medium text-white hover:bg-marinho-900"
      >
        Voltar para a consulta
      </Link>
    </div>
  )
}
