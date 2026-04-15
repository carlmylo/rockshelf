import { shell, type BrowserWindow, type IpcMainInvokeEvent } from 'electron'
import type { Promisable } from 'type-fest'
import { deletePackage, deletePackageThumbnails, deleteUserConfigAndRestart, editPackageData, getDTAFilteringFromPackage, getSongArtworkDataURL, installHighMemoryPatch, installPKGFile, playRockBand3, refreshPackagesData, rpcs3GetInstrumentScores, rpcs3GetPackagesData, rpcs3GetRB3Stats, rpcs3GetSaveDataStats, selectDevhdd0Dir, selectImageForPackage, selectPKGFileToInstall, selectRPCS3Exe, testUserConfig } from './controllers.exports'
import { openUserDataFolder, readUserConfigFile, saveUserConfigFile, windowClose, windowMaximize, windowMinimize, type UserConfigObject } from './core.exports'
import { addHandler } from './core/handler'

export type HandlerFnType = (window: BrowserWindow, event: IpcMainInvokeEvent, ...args: any[]) => Promisable<any>
export type InitHandlersArray = [string, HandlerFnType][]

export const initMainProcessHandlers = (): void => {
  const handlers: InitHandlersArray = [
    ['deletePackage', deletePackage],
    ['deletePackageThumbnails', deletePackageThumbnails],
    ['deleteUserConfigAndRestart', deleteUserConfigAndRestart],
    ['editPackageData', editPackageData],
    ['getDTAFilteringFromPackage', getDTAFilteringFromPackage],
    ['getSongArtworkDataURL', getSongArtworkDataURL],
    ['installHighMemoryPatch', installHighMemoryPatch],
    ['installPKGFile', installPKGFile],
    ['openFolderInExplorer', async (_, __, folderPath: string): Promise<string> => await shell.openPath(folderPath)],
    ['openUserDataFolder', openUserDataFolder],
    ['readUserConfigFile', readUserConfigFile],
    ['refreshPackagesData', refreshPackagesData],
    ['rpcs3GetInstrumentScores', rpcs3GetInstrumentScores],
    ['rpcs3GetPackagesData', rpcs3GetPackagesData],
    ['rpcs3GetRB3Stats', rpcs3GetRB3Stats],
    ['rpcs3GetSaveDataStats', rpcs3GetSaveDataStats],
    ['saveUserConfigFile', async (_, __, newConfig?: Partial<UserConfigObject>): Promise<string> => await saveUserConfigFile(newConfig)],
    ['selectDevhdd0Dir', selectDevhdd0Dir],
    ['selectImageForPackage', selectImageForPackage],
    ['selectPKGFileToInstall', selectPKGFileToInstall],
    ['selectRPCS3Exe', selectRPCS3Exe],
    ['testError', (_, __, message?: string): Error => new Error(message || '')],
    ['testUserConfig', testUserConfig],
    ['windowClose', windowClose],
    ['windowMaximize', windowMaximize],
    ['windowMinimize', windowMinimize],
    ['playRockBand3', playRockBand3],
  ]
  for (const [channel, listeners] of handlers) addHandler(channel, listeners)
}
