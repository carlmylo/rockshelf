import type { SelectPKGFileReturnObject } from '../../controllers.exports'
import { temporaryDirectory } from 'tempy'
import { DirPath, type DirPathLikeTypes } from 'node-lib'
import { getRB3USRDIR, sendBuzyLoad } from '../../core.exports'
import type { BrowserWindow } from 'electron'
import { BinaryAPI } from '../../lib.exports'

export const installPatchTypePKGForRB3 = async (win: BrowserWindow, devhdd0Path: DirPathLikeTypes, selectedPKG: SelectPKGFileReturnObject): Promise<boolean> => {
  sendBuzyLoad(win, { code: 'init', title: selectedPKG.pkgType === 'dx' ? 'installingRB3DX' : 'installingTU5', steps: selectedPKG.pkgType === 'dx' ? ['extractingDeluxePKG', 'installingRB3DX'] : ['extractingTU5PKG', 'installingTU5'], onCompleted: ['refreshRB3Stats', 'resetDeluxeInstallScreenState'] })
  const rb3GameFolder = getRB3USRDIR(devhdd0Path).gotoDir('../')
  let tempFolderPath: DirPath

  try {
    tempFolderPath = await BinaryAPI.ps3pPKGRipper(selectedPKG.pkgPath, temporaryDirectory())
  } catch (err) {
    sendBuzyLoad(win, { code: 'throwError' })
    return false
  }

  sendBuzyLoad(win, { code: 'incrementStep' })
  for (const entry of await tempFolderPath.readDir(true)) {
    const relPath = entry.path.slice(tempFolderPath.path.length + 1)
    if (entry instanceof DirPath) {
      const newDirPath = rb3GameFolder.gotoDir(relPath)
      if (!newDirPath.exists) await newDirPath.mkDir(true)
      continue
    }

    const newFilePath = rb3GameFolder.gotoFile(relPath)
    await entry.copy(newFilePath, true)
    await entry.delete()
  }

  await tempFolderPath.deleteDir()
  sendBuzyLoad(win, { code: 'callSuccess' })
  return true
}
