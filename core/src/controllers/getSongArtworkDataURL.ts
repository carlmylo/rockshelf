import { isRPCS3Devhdd0PathValid, type RB3CompatibleDTAFile } from 'rbtools/lib'
import { readUserConfigFile, sendMessageBox, useHandler } from '../core.exports'
import type { RPCS3SongPackagesObjectExtra } from '../lib.exports'
import { DirPath } from 'node-lib'
import { TextureFile } from 'rbtools'

export const getSongArtworkDataURL = useHandler(async (win, _, packageDetails: RPCS3SongPackagesObjectExtra, songDetails: RB3CompatibleDTAFile) => {
  const userConfig = await readUserConfigFile()
  if (!userConfig) {
    sendMessageBox(win, { method: 'getSongArtworkDataURL', type: 'error', code: 'noUserConfigFile' })
    return false
  }

  const artworkPath = new TextureFile(DirPath.of(packageDetails.path).gotoFile(`songs/${songDetails.songname}/gen/${songDetails.songname}_keep.png_ps3`))

  if (!artworkPath.path.exists) {
    sendMessageBox(win, { method: 'getSongArtworkDataURL', type: 'error', code: 'noArtworkFile', messageValues: { path: artworkPath.path.path } })
    return false
  }

  return await artworkPath.toDataURL()
})
