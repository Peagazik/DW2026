import { AlertTriangle, ArrowLeft, Check, ExternalLink, Mail, Phone, Share2, Star, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { alternarFavorito, ehFavorito, lerFavoritos } from '../favoritos'
import { buscarComissoes, buscarDeputado, buscarProposicoes } from '../services/camaraApi'
import type { Comissao, DeputadoDetalhado, Proposicao } from '../types'

const CONECTIVOS = ['de', 'da', 'do', 'das', 'dos', 'e']

// A API devolve o nome civil em caixa alta.
function formatarNome(nome: string) {
  return nome
    .toLowerCase()
    .split(' ')
    .map((palavra) =>
      CONECTIVOS.includes(palavra) ? palavra : palavra.charAt(0).toUpperCase() + palavra.slice(1),
    )
    .join(' ')
}

function formatarData(data: string | null) {
  if (!data) return null
  const [ano, mes, dia] = data.split('T')[0].split('-')
  return `${dia}/${mes}/${ano}`
}

function nomeDaRede(url: string) {
  const endereco = url.toLowerCase()
  if (endereco.includes('twitter.com') || endereco.includes('x.com')) return 'Twitter / X'
  if (endereco.includes('facebook.com')) return 'Facebook'
  if (endereco.includes('instagram.com')) return 'Instagram'
  if (endereco.includes('youtube.com')) return 'YouTube'
  if (endereco.includes('linkedin.com')) return 'LinkedIn'
  return 'Site'
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string | null }) {
  return (
    <div className="border-b border-borda py-2.5 last:border-b-0">
      <dt className="text-xs font-medium text-slate-500">{rotulo}</dt>
      <dd className={`mt-0.5 text-sm ${valor ? 'text-marinho-900' : 'text-slate-400 italic'}`}>
        {valor || 'Não informado'}
      </dd>
    </div>
  )
}

export function DeputyDetails() {
  const { id } = useParams()
  const navegar = useNavigate()

  const [deputado, setDeputado] = useState<DeputadoDetalhado | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [favoritos, setFavoritos] = useState(lerFavoritos())
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [fotoComErro, setFotoComErro] = useState(false)

  const [comissoes, setComissoes] = useState<Comissao[]>([])
  const [proposicoes, setProposicoes] = useState<Proposicao[]>([])
  const [carregandoAtuacao, setCarregandoAtuacao] = useState(true)

  useEffect(() => {
    const controle = new AbortController()

    setCarregando(true)
    setErro('')

    buscarDeputado(id ?? '', controle.signal)
      .then((dados) => {
        setDeputado(dados)
        setCarregando(false)
      })
      .catch(() => {
        if (controle.signal.aborted) return
        setErro('Não foi possível carregar os dados deste deputado.')
        setCarregando(false)
      })

    return () => controle.abort()
  }, [id])

  // Comissões e proposições são opcionais: uma falha aqui não impede o perfil de aparecer.
  useEffect(() => {
    const controle = new AbortController()

    setCarregandoAtuacao(true)

    Promise.all([
      buscarComissoes(id ?? '', controle.signal),
      buscarProposicoes(id ?? '', controle.signal),
    ])
      .then(([listaComissoes, listaProposicoes]) => {
        setComissoes(listaComissoes)
        setProposicoes(listaProposicoes)
        setCarregandoAtuacao(false)
      })
      .catch(() => {
        if (controle.signal.aborted) return
        setComissoes([])
        setProposicoes([])
        setCarregandoAtuacao(false)
      })

    return () => controle.abort()
  }, [id])

  async function compartilhar() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Portal Parlamentar', url })
        return
      } catch {
        // Compartilhamento cancelado: cai para a cópia do link.
      }
    }

    await navigator.clipboard.writeText(url)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const botaoVoltar = (
    <button
      type="button"
      onClick={() => navegar('/')}
      className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-marinho-700 hover:text-marinho-900"
    >
      <ArrowLeft size={15} />
      Voltar para a consulta
    </button>
  )

  if (carregando) {
    return (
      <>
        {botaoVoltar}
        <div className="animate-pulse rounded border border-borda bg-white p-5">
          <div className="flex gap-5">
            <div className="h-40 w-32 rounded bg-marinho-50" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-5 w-2/3 rounded bg-marinho-50" />
              <div className="h-3.5 w-1/3 rounded bg-marinho-50" />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (erro || !deputado) {
    return (
      <>
        {botaoVoltar}
        <div className="rounded border border-borda bg-white px-6 py-12 text-center">
          <AlertTriangle size={28} strokeWidth={1.5} className="mx-auto text-marinho-400" />
          <h1 className="mt-3 text-base font-semibold text-marinho-900">Deputado não encontrado</h1>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{erro}</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded bg-marinho-800 px-4 py-2 text-sm font-medium text-white hover:bg-marinho-900"
          >
            Ir para a consulta
          </Link>
        </div>
      </>
    )
  }

  const status = deputado.ultimoStatus
  const gabinete = status.gabinete
  const redes = deputado.redeSocial ?? []
  const favorito = ehFavorito(favoritos, deputado.id)
  const comissoesAtuais = comissoes.filter((comissao) => !comissao.dataFim)

  return (
    <>
      {botaoVoltar}

      <div className="space-y-5">
        <header className="flex flex-col gap-5 rounded border border-borda bg-white p-5 sm:flex-row">
          {status.urlFoto && !fotoComErro ? (
            <img
              src={status.urlFoto}
              alt={`Foto oficial de ${status.nome}`}
              onError={() => setFotoComErro(true)}
              className="h-44 w-34 self-start rounded bg-marinho-50 object-cover object-top"
            />
          ) : (
            <div className="flex h-44 w-34 items-center justify-center self-start rounded bg-marinho-50 text-marinho-400">
              <User size={32} strokeWidth={1.5} />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="text-xl font-semibold text-marinho-900 sm:text-2xl">{status.nome}</h1>

            <p className="mt-1.5 text-sm text-slate-600">
              {status.siglaPartido ?? 'Sem partido'}
              <span className="mx-1.5 text-slate-300">·</span>
              {status.siglaUf}
              {status.condicaoEleitoral && (
                <>
                  <span className="mx-1.5 text-slate-300">·</span>
                  {status.condicaoEleitoral}
                </>
              )}
            </p>

            {status.situacao && (
              <p className="mt-3 inline-flex w-fit rounded-sm bg-marinho-50 px-2 py-1 text-xs font-medium text-marinho-700">
                Situação: {status.situacao}
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <button
                type="button"
                onClick={() =>
                  setFavoritos(
                    alternarFavorito(favoritos, {
                      id: deputado.id,
                      nome: status.nome,
                      siglaPartido: status.siglaPartido,
                      siglaUf: status.siglaUf,
                      urlFoto: status.urlFoto,
                    }),
                  )
                }
                aria-pressed={favorito}
                className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium ${
                  favorito
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-borda text-slate-600 hover:border-marinho-200 hover:text-marinho-800'
                }`}
              >
                <Star size={16} fill={favorito ? 'currentColor' : 'none'} />
                {favorito ? 'Nos favoritos' : 'Favoritar'}
              </button>

              <button
                type="button"
                onClick={compartilhar}
                className="inline-flex items-center gap-2 rounded border border-borda px-3 py-2 text-sm font-medium text-slate-600 hover:border-marinho-200 hover:text-marinho-800"
              >
                {linkCopiado ? <Check size={16} /> : <Share2 size={16} />}
                {linkCopiado ? 'Link copiado' : 'Compartilhar'}
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded border border-borda bg-white p-5">
            <h2 className="mb-2 text-sm font-semibold text-marinho-900">Dados do parlamentar</h2>
            <dl>
              <Campo
                rotulo="Nome civil"
                valor={deputado.nomeCivil ? formatarNome(deputado.nomeCivil) : null}
              />
              <Campo rotulo="Nome eleitoral" valor={status.nomeEleitoral} />
              <Campo rotulo="Partido" valor={status.siglaPartido} />
              <Campo rotulo="UF de representação" valor={status.siglaUf} />
              <Campo rotulo="Legislatura" valor={`${status.idLegislatura}ª`} />
              <Campo rotulo="Escolaridade" valor={deputado.escolaridade} />
              <Campo rotulo="Data de nascimento" valor={formatarData(deputado.dataNascimento)} />
              <Campo
                rotulo="Naturalidade"
                valor={
                  deputado.municipioNascimento
                    ? `${deputado.municipioNascimento} / ${deputado.ufNascimento}`
                    : deputado.ufNascimento
                }
              />
            </dl>
          </section>

          <div className="space-y-5">
            <section className="rounded border border-borda bg-white p-5">
              <h2 className="mb-2 text-sm font-semibold text-marinho-900">Gabinete</h2>
              {gabinete ? (
                <>
                  <dl>
                    <Campo rotulo="Prédio" valor={gabinete.predio} />
                    <Campo rotulo="Sala" valor={gabinete.sala} />
                    <Campo rotulo="Andar" valor={gabinete.andar} />
                  </dl>

                  <div className="mt-4 space-y-2">
                    {gabinete.telefone && (
                      <p className="flex items-center gap-2 text-sm text-marinho-900">
                        <Phone size={15} className="text-slate-400" />
                        {gabinete.telefone}
                      </p>
                    )}
                    {gabinete.email ? (
                      <p className="flex items-center gap-2 text-sm">
                        <Mail size={15} className="shrink-0 text-slate-400" />
                        <a
                          href={`mailto:${gabinete.email}`}
                          className="break-all text-marinho-700 underline underline-offset-2 hover:text-marinho-900"
                        >
                          {gabinete.email}
                        </a>
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        E-mail institucional não informado.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  A API não retornou dados de gabinete para este parlamentar.
                </p>
              )}
            </section>

            <section className="rounded border border-borda bg-white p-5">
              <h2 className="mb-2 text-sm font-semibold text-marinho-900">Canais oficiais</h2>
              {redes.length === 0 && !deputado.urlWebsite ? (
                <p className="text-sm text-slate-400 italic">
                  Nenhuma rede social ou site informado pela Câmara.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {deputado.urlWebsite && (
                    <li>
                      <LinkExterno url={deputado.urlWebsite} rotulo="Site pessoal" />
                    </li>
                  )}
                  {redes.map((endereco) => (
                    <li key={endereco}>
                      <LinkExterno url={endereco} rotulo={nomeDaRede(endereco)} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded border border-borda bg-white p-5">
              <h2 className="mb-2 text-sm font-semibold text-marinho-900">Comissões</h2>
              {carregandoAtuacao ? (
                <p className="text-sm text-slate-400">Carregando…</p>
              ) : comissoesAtuais.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  Nenhuma participação em comissão em andamento.
                </p>
              ) : (
                <ul className="divide-y divide-borda">
                  {comissoesAtuais.map((comissao) => (
                    <li key={`${comissao.idOrgao}-${comissao.dataInicio}`} className="py-2.5">
                      <p className="text-sm font-medium text-marinho-900">
                        {comissao.siglaOrgao || comissao.nomeOrgao}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {comissao.titulo}
                        {comissao.dataInicio && ` · desde ${formatarData(comissao.dataInicio)}`}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>

        <section className="rounded border border-borda bg-white p-5">
          <h2 className="text-sm font-semibold text-marinho-900">Proposições apresentadas</h2>
          <p className="mt-1 text-xs text-slate-500">
            As dez proposições mais recentes de autoria do parlamentar.
          </p>

          {carregandoAtuacao ? (
            <p className="mt-4 text-sm text-slate-400">Carregando…</p>
          ) : proposicoes.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400 italic">
              Nenhuma proposição de autoria registrada na API.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-borda">
              {proposicoes.map((proposicao) => (
                <li key={proposicao.id} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={`https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${proposicao.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold text-marinho-900 group-hover:text-marinho-700">
                      {proposicao.siglaTipo} {proposicao.numero}/{proposicao.ano}
                      <ExternalLink size={13} className="text-slate-400" />
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {proposicao.ementa}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Apresentada em {formatarData(proposicao.dataApresentacao)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}

function LinkExterno({ url, rotulo }: { url: string; rotulo: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded border border-transparent px-2 py-2 text-sm hover:border-borda"
    >
      <span className="min-w-0">
        <span className="block font-medium text-marinho-900">{rotulo}</span>
        <span className="block truncate text-xs text-slate-500">{url}</span>
      </span>
      <ExternalLink size={15} className="shrink-0 text-slate-400" />
    </a>
  )
}
