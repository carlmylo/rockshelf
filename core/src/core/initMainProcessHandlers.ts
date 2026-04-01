import type { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import type { Promisable } from 'type-fest'
import { deleteUserConfigAndRestart, getDTACatalog, installHighMemoryPatch, installPKGFile, refreshPackagesData, rpcs3GetInstrumentScores, rpcs3GetPackagesData, rpcs3GetRB3Stats, rpcs3GetSaveDataStats, selectDevhdd0Dir, selectPKGFileToInstall, selectRPCS3Exe, testUserConfig } from '../controllers.exports'
import { openUserDataFolder, readUserConfigFile, saveUserConfigFile, windowClose, windowMaximize, windowMinimize, type UserConfigObject } from '../core.exports'
import { addHandler } from './handler'

export type HandlerFnType = (window: BrowserWindow, event: IpcMainInvokeEvent, ...args: any[]) => Promisable<any>
export type InitHandlersArray = [string, HandlerFnType][]

export const initMainProcessHandlers = (): void => {
  const handlers: InitHandlersArray = [
    ['deleteUserConfigAndRestart', deleteUserConfigAndRestart],
    ['installHighMemoryPatch', installHighMemoryPatch],
    ['installPKGFile', installPKGFile],
    ['openUserDataFolder', openUserDataFolder],
    ['readUserConfigFile', readUserConfigFile],
    ['rpcs3GetInstrumentScores', rpcs3GetInstrumentScores],
    ['rpcs3GetPackagesData', rpcs3GetPackagesData],
    ['rpcs3GetRB3Stats', rpcs3GetRB3Stats],
    ['rpcs3GetSaveDataStats', rpcs3GetSaveDataStats],
    ['saveUserConfigFile', (_, __, newConfig: Partial<UserConfigObject>) => saveUserConfigFile(newConfig)],
    ['selectDevhdd0Dir', selectDevhdd0Dir],
    ['selectPKGFileToInstall', selectPKGFileToInstall],
    ['selectRPCS3Exe', selectRPCS3Exe],
    ['testError', (_, __, message?: string) => new Error(message || '')],
    ['testUserConfig', testUserConfig],
    ['windowClose', windowClose],
    ['windowMaximize', windowMaximize],
    ['windowMinimize', windowMinimize],
    ['refreshPackagesData', refreshPackagesData],
    ['getDTACatalog', getDTACatalog],
  ]
  for (const [channel, listeners] of handlers) addHandler(channel, listeners)
}
