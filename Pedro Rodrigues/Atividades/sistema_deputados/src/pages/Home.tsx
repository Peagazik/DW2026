import { AlertTriangle, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DeputadoCard } from '../components/DeputadoCard'
import { Filtros } from '../components/Filtros'
import { ResumoResultados } from '../components/ResumoResultados'
import { alternarFavorito, ehFavorito, lerFavoritos } from '../favoritos'
import { buscarDeputados, buscarPartidos, buscarUfs } from '../services/camaraApi'
import type { Deputado, Partido, Uf } from '../types'

export function Home() {
  const [busca, setBusca] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')
  const [partido, setPartido] = useState('')
  const [uf, setUf] = useState('')

  const [deputados, setDeputados] = useState<Deputado[]>([])
  const [pagina, setPagina] = useState(1)
  const [temMais, setTemMais] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  const [partidos, setPartidos] = useState<Partido[]>([])
  const [ufs, setUfs] = useState<Uf[]>([])
  const [favoritos, setFavoritos] = useState(lerFavoritos())

  useEffect(() => {
    buscarPartidos().then(setPartidos).catch(() => setPartidos([]))
    buscarUfs().then(setUfs).catch(() => setUfs([]))
  }, [])

  // Espera o usuário parar de digitar antes de consultar a API.
  useEffect(() => {
    const tempo = setTimeout(() => {
      setBuscaAplicada(busca.trim())
      setPagina(1)
    }, 400)

    return () => clearTimeout(tempo)
  }, [busca])

  useEffect(() => {
    const controle = new AbortController()

    setCarregando(true)
    setErro('')

    buscarDeputados({ nome: buscaAplicada, partido, uf }, pagina, controle.signal)
      .then((resultado) => {
        setDeputados((atuais) =>
          pagina === 1 ? resultado.lista : [...atuais, ...resultado.lista],
        )
        setTemMais(resultado.temMais)
        setCarregando(false)
      })
      .catch(() => {
        // Consulta cancelada porque os filtros mudaram: a requisição nova assume.
        if (controle.signal.aborted) return
        setErro('Não foi possível carregar os deputados. Verifique sua conexão e tente novamente.')
        setCarregando(false)
      })

    return () => controle.abort()
  }, [buscaAplicada, partido, uf, pagina, tentativa])

  function limparFiltros() {
    setBusca('')
    setPartido('')
    setUf('')
    setPagina(1)
  }

  function favoritar(deputado: Deputado) {
    setFavoritos(alternarFavorito(favoritos, deputado))
  }

  const carregandoPrimeiraPagina = carregando && pagina === 1

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-marinho-900 sm:text-[28px]">
          Conheça seus representantes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Consulte os deputados federais em exercício na Câmara dos Deputados. Busque pelo nome,
          filtre por partido ou unidade da federação e abra o perfil para ver os dados de gabinete
          e os canais oficiais de cada parlamentar.
        </p>
      </div>

      <Filtros
        busca={busca}
        partido={partido}
        uf={uf}
        partidos={partidos}
        ufs={ufs}
        onBusca={setBusca}
        onPartido={(valor) => {
          setPartido(valor)
          setPagina(1)
        }}
        onUf={(valor) => {
          setUf(valor)
          setPagina(1)
        }}
        onLimpar={limparFiltros}
      />

      <p className="mt-5 text-sm text-slate-600" aria-live="polite">
        {carregandoPrimeiraPagina
          ? 'Consultando a API da Câmara…'
          : erro
            ? 'Não foi possível carregar os resultados.'
            : `${deputados.length} ${deputados.length === 1 ? 'deputado' : 'deputados'} ${
                temMais ? 'carregados até aqui' : 'encontrados'
              }`}
      </p>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[1fr_17rem]">
        <div>
          {erro && (
            <div className="rounded border border-borda bg-white px-6 py-12 text-center">
              <AlertTriangle size={28} strokeWidth={1.5} className="mx-auto text-marinho-400" />
              <h2 className="mt-3 text-base font-semibold text-marinho-900">Falha na consulta</h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{erro}</p>
              <button
                type="button"
                onClick={() => setTentativa(tentativa + 1)}
                className="mt-5 rounded bg-marinho-800 px-4 py-2 text-sm font-medium text-white hover:bg-marinho-900"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {carregandoPrimeiraPagina && !erro && (
            <div className="grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex h-full animate-pulse gap-4 rounded border border-borda bg-white p-3"
                >
                  <div className="h-26 w-20 shrink-0 rounded-sm bg-marinho-50" />
                  <div className="flex flex-1 flex-col gap-2 pt-1">
                    <div className="h-3.5 w-4/5 rounded bg-marinho-50" />
                    <div className="h-3 w-1/2 rounded bg-marinho-50" />
                    <div className="mt-auto h-3 w-24 rounded bg-marinho-50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!carregando && !erro && deputados.length === 0 && (
            <div className="rounded border border-borda bg-white px-6 py-12 text-center">
              <SearchX size={28} strokeWidth={1.5} className="mx-auto text-marinho-400" />
              <h2 className="mt-3 text-base font-semibold text-marinho-900">
                Nenhum deputado encontrado
              </h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">
                Não há resultados para os filtros selecionados. Tente outro nome ou remova um dos
                filtros.
              </p>
              <button
                type="button"
                onClick={limparFiltros}
                className="mt-5 rounded border border-borda px-4 py-2 text-sm font-medium text-marinho-800 hover:border-marinho-200"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {!erro && deputados.length > 0 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {deputados.map((deputado) => (
                  <DeputadoCard
                    key={deputado.id}
                    deputado={deputado}
                    favorito={ehFavorito(favoritos, deputado.id)}
                    onFavoritar={() => favoritar(deputado)}
                  />
                ))}
              </div>

              {temMais && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setPagina(pagina + 1)}
                    disabled={carregando}
                    className="rounded border border-borda bg-white px-5 py-2.5 text-sm font-medium text-marinho-800 hover:border-marinho-200 disabled:text-slate-400"
                  >
                    {carregando ? 'Carregando…' : 'Carregar mais'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {!erro && !carregandoPrimeiraPagina && (
          <ResumoResultados deputados={deputados} temMais={temMais} />
        )}
      </div>
    </>
  )
}
