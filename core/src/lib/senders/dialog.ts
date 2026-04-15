import type { BrowserWindow } from 'electron'

export type DialogScreenPromptsTypes = 'corruptedUserConfig' | 'corruptedPackagesCache' | 'parsingErrorsOnPackagesDTA' | 'confirmDeletePackage' | 'corruptedGameInstallation'

export const sendDialog = (win: BrowserWindow, code: DialogScreenPromptsTypes): true => {
  win.webContents.send('sendDialog', code)
  return true
}
