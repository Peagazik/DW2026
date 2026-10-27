import type { Comissao, Deputado, DeputadoDetalhado, Partido, Proposicao, Uf } from '../types'

const URL_BASE = 'https://dadosabertos.camara.leg.br/api/v2'

export const ITENS_POR_PAGINA = 24

async function buscarNaApi(
  caminho: string,
  parametros: Record<string, string> = {},
  signal?: AbortSignal,
) {
  const url = new URL(URL_BASE + caminho)
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor) url.searchParams.set(chave, valor)
  }

  const resposta = await fetch(url, { signal })
  if (!resposta.ok) {
    throw new Error(`A API da Câmara respondeu com o erro ${resposta.status}.`)
  }

  return resposta.json()
}

export interface Filtros {
  nome: string
  partido: string
  uf: string
}

export async function buscarDeputados(filtros: Filtros, pagina: number, signal?: AbortSignal) {
  const resposta = await buscarNaApi(
    '/deputados',
    {
      nome: filtros.nome,
      siglaPartido: filtros.partido,
      siglaUf: filtros.uf,
      ordem: 'ASC',
      ordenarPor: 'nome',
      pagina: String(pagina),
      itens: String(ITENS_POR_PAGINA),
    },
    signal,
  )

  const lista: Deputado[] = resposta.dados
  // A API não informa o total de registros: a existência do link "next" indica que há mais páginas.
  const temMais = resposta.links.some((link: { rel: string }) => link.rel === 'next')

  return { lista, temMais }
}

export async function buscarDeputado(id: string, signal?: AbortSignal) {
  const resposta = await buscarNaApi(`/deputados/${id}`, {}, signal)
  return resposta.dados as DeputadoDetalhado
}

export async function buscarComissoes(id: string, signal?: AbortSignal) {
  const resposta = await buscarNaApi(`/deputados/${id}/orgaos`, { itens: '50' }, signal)
  return resposta.dados as Comissao[]
}

export async function buscarProposicoes(id: string, signal?: AbortSignal) {
  const resposta = await buscarNaApi(
    '/proposicoes',
    { idDeputadoAutor: id, ordem: 'DESC', ordenarPor: 'id', itens: '10' },
    signal,
  )
  return resposta.dados as Proposicao[]
}

export async function buscarPartidos(signal?: AbortSignal) {
  const resposta = await buscarNaApi(
    '/partidos',
    { ordem: 'ASC', ordenarPor: 'sigla', itens: '100' },
    signal,
  )
  return resposta.dados as Partido[]
}

export async function buscarUfs(signal?: AbortSignal) {
  const resposta = await buscarNaApi('/referencias/uf', {}, signal)
  const ufs = resposta.dados as Uf[]
  return ufs.sort((a, b) => a.sigla.localeCompare(b.sigla))
}
