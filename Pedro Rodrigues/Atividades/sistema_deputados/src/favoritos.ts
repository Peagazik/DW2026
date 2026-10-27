import type { Favorito } from './types'

const CHAVE = 'portal-parlamentar:favoritos'

export function lerFavoritos(): Favorito[] {
  try {
    const salvos = localStorage.getItem(CHAVE)
    return salvos ? JSON.parse(salvos) : []
  } catch {
    return []
  }
}

export function alternarFavorito(favoritos: Favorito[], deputado: Favorito): Favorito[] {
  const jaSalvo = favoritos.some((item) => item.id === deputado.id)
  const novos = jaSalvo
    ? favoritos.filter((item) => item.id !== deputado.id)
    : [...favoritos, deputado]

  localStorage.setItem(CHAVE, JSON.stringify(novos))
  return novos
}

export function ehFavorito(favoritos: Favorito[], id: number): boolean {
  return favoritos.some((item) => item.id === id)
}
