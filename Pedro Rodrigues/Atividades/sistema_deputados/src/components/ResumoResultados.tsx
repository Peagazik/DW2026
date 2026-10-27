import type { Deputado } from '../types'

interface Props {
  deputados: Deputado[]
  temMais: boolean
}

function agrupar(deputados: Deputado[], obterChave: (deputado: Deputado) => string) {
  const contagem: Record<string, number> = {}
  for (const deputado of deputados) {
    const chave = obterChave(deputado)
    contagem[chave] = (contagem[chave] ?? 0) + 1
  }
  return Object.entries(contagem).sort((a, b) => b[1] - a[1])
}

function Distribuicao({ titulo, dados }: { titulo: string; dados: [string, number][] }) {
  const maior = dados[0][1]
  const visiveis = dados.slice(0, 8)

  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{titulo}</h3>
      <ul className="mt-3 space-y-2">
        {visiveis.map(([nome, quantidade]) => (
          <li key={nome} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 truncate text-marinho-900">{nome}</span>
            <span className="h-1.5 flex-1 rounded-full bg-marinho-50">
              <span
                className="block h-full rounded-full bg-marinho-500"
                style={{ width: `${(quantidade / maior) * 100}%` }}
              />
            </span>
            <span className="w-6 shrink-0 text-right text-slate-500">{quantidade}</span>
          </li>
        ))}
      </ul>
      {dados.length > 8 && (
        <p className="mt-2 text-xs text-slate-400">e mais {dados.length - 8} registros</p>
      )}
    </div>
  )
}

export function ResumoResultados({ deputados, temMais }: Props) {
  if (deputados.length === 0) return null

  return (
    <aside className="rounded border border-borda bg-white p-5">
      <h2 className="text-sm font-semibold text-marinho-900">Resumo dos resultados</h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {temMais
          ? `Calculado apenas sobre os ${deputados.length} deputados já carregados — há mais resultados nesta consulta.`
          : `Calculado sobre os ${deputados.length} deputados desta consulta.`}
      </p>

      <div className="mt-5 space-y-6">
        <Distribuicao
          titulo="Por partido"
          dados={agrupar(deputados, (d) => d.siglaPartido ?? 'Sem partido')}
        />
        <Distribuicao titulo="Por UF" dados={agrupar(deputados, (d) => d.siglaUf)} />
      </div>
    </aside>
  )
}
