export interface Deputado {
  id: number
  nome: string
  siglaPartido: string | null
  siglaUf: string
  urlFoto: string
  email: string | null
}

export interface Gabinete {
  predio: string | null
  sala: string | null
  andar: string | null
  telefone: string | null
  email: string | null
}

export interface DeputadoDetalhado {
  id: number
  nomeCivil: string | null
  escolaridade: string | null
  dataNascimento: string | null
  ufNascimento: string | null
  municipioNascimento: string | null
  urlWebsite: string | null
  redeSocial: string[] | null
  ultimoStatus: {
    nome: string
    siglaPartido: string | null
    siglaUf: string
    urlFoto: string
    idLegislatura: number
    nomeEleitoral: string | null
    situacao: string | null
    condicaoEleitoral: string | null
    gabinete: Gabinete | null
  }
}

export interface Comissao {
  idOrgao: number
  siglaOrgao: string
  nomeOrgao: string
  titulo: string | null
  dataInicio: string | null
  dataFim: string | null
}

export interface Proposicao {
  id: number
  siglaTipo: string
  numero: number
  ano: number
  ementa: string
  dataApresentacao: string
}

export interface Partido {
  id: number
  sigla: string
  nome: string
}

export interface Uf {
  sigla: string
  nome: string
}

export interface Favorito {
  id: number
  nome: string
  siglaPartido: string | null
  siglaUf: string
  urlFoto: string
}
