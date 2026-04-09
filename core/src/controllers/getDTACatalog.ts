import { type DTACatalogTypes, type DTACatalogOptions, type DTACatalogGenericObject, type DTACatalogByArtistObject, type DTACatalogByDifficultyObject, catalogDTAByTitle, catalogDTAByArtist, catalogDTAByGenre, catalogDTAByDecade, catalogDTAByYearReleased, catalogDTAByInstrumentDifficulty } from 'rbtools/lib'
import { getPackagesCacheFile, sendDialog, useHandler } from '../core.exports'
import { type RPCS3SongPackagesDataExtra } from '../lib.exports'

export const getDTACatalog = useHandler(async (win, _, packageIndex: number, type: DTACatalogTypes = 'title', options?: DTACatalogOptions): Promise<false | DTACatalogGenericObject | DTACatalogByArtistObject | DTACatalogByDifficultyObject> => {
  const cache = getPackagesCacheFile()
  const cacheContents = await cache.readJSON<RPCS3SongPackagesDataExtra>()

  if (!(packageIndex in cacheContents.packages)) {
    sendDialog(win, 'corruptedPackagesCache')
    return false
  }

  const songs = cacheContents.packages[packageIndex].songs
  switch (type) {
    case 'title':
    default:
      return catalogDTAByTitle(songs, options)
    case 'artist':
      return catalogDTAByArtist(songs, options)
    case 'genre':
      return catalogDTAByGenre(songs, options)
    case 'decade':
      return catalogDTAByDecade(songs, options)
    case 'yearReleased':
      return catalogDTAByYearReleased(songs, options)
    case 'difficulty':
      return catalogDTAByInstrumentDifficulty(songs, options)
  }
})
