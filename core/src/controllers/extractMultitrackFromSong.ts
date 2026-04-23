import { pathLikeToFilePath } from 'node-lib'
import { sendMessageBox, useHandler } from '../core.exports'
import { MOGGFile } from '../lib/rbtools'
import type { RB3CompatibleDTAFile } from '../lib/rbtools/lib.exports'
import { dialog } from 'electron'

export const extractMultitrackFromSong = useHandler(async (win, __, packagePath: string, song: RB3CompatibleDTAFile) => {
  const packPath = pathLikeToFilePath(packagePath)
  const mogg = new MOGGFile(packPath.gotoFile(`songs/${song.songname}/${song.songname}.mogg`))

  if (!mogg.path.exists) {
    sendMessageBox(win, { type: 'error', method: 'extractMultitrackFromSong', code: 'moggFileNotFound' })
    return false
  }

  try {
    await mogg.checkFileIntegrity()
  } catch (err) {
    sendMessageBox(win, { type: 'error', method: 'extractMultitrackFromSong', code: 'invalidMOGGFile' })
    return false
  }

  const selection = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (selection.canceled) {
    sendMessageBox(win, {
      type: 'info',
      method: 'extractMultitrackFromSong',
      code: 'actionCancelledByUser',
    })
    return false
  }

  await mogg.extractTracks(song, selection.filePaths[0])
  return true
})
