import type { RB3CompatibleDTAFile } from 'rbtools/lib'
import { leadingArticleToTrailing } from 'rbtools/utils'

export interface DTACatalogByTitleHeaders {
  name: string
  code: string
  songsIndexes: number[]
}

export interface DTACatalogByTitleObject {
  type: 'title'
  headers: DTACatalogByTitleHeaders[]
}

export type DTACatalogTypes = 'title' | 'artist'

export const catalogDTAByTitle = (songs: RB3CompatibleDTAFile[]): DTACatalogByTitleObject => {
  const sortedSongs = songs
    .map((val, valI) => ({ ...val, index: valI }))
    .sort((a, b) => {
      if (leadingArticleToTrailing(a.name).toLocaleLowerCase() > leadingArticleToTrailing(b.name).toLocaleLowerCase()) return 1
      else if (leadingArticleToTrailing(a.name).toLocaleLowerCase() < leadingArticleToTrailing(b.name).toLocaleLowerCase()) return -1
      else return 0
    })

  const charZCode = 0x7a
  const headers = [
    {
      name: '123',
      code: 'titleSymbols',
      songsIndexes: [],
    } as DTACatalogByTitleHeaders,
    ...(() => {
      const charArray = [] as DTACatalogByTitleHeaders[]

      for (let i = 0x61; i <= charZCode; i++) {
        const letter = Buffer.from([i]).toString()
        charArray.push({
          name: letter.toUpperCase(),
          code: `title${letter.toUpperCase()}`,
          songsIndexes: [],
        })
      }

      return charArray
    })(),
  ] as DTACatalogByTitleHeaders[]

  for (const song of sortedSongs) {
    const nameWOLeadingArticle = leadingArticleToTrailing(song.name)
    const nameFirstChar = nameWOLeadingArticle[0].toLowerCase()
    const nameFirstCharCode = Buffer.from(nameFirstChar)[0]
    if (nameFirstCharCode >= 0x61 && nameFirstCharCode <= charZCode) {
      const charIndex = nameFirstCharCode - 0x60
      headers[charIndex].songsIndexes.push(song.index)
    } else headers[0].songsIndexes.push(song.index)
  }

  return {
    type: 'title',
    headers,
  }
}
