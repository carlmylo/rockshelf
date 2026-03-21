import { isRPCS3Devhdd0PathValid, isRPCS3ExePathValid } from 'rbtools/lib'
import { readUserConfigFile, sendDialog, useHandler } from '../core.exports'

export const testUserConfig = useHandler(async (win, _): Promise<boolean> => {
  const userConfig = await readUserConfigFile()
  if (!userConfig) return false
  try {
    isRPCS3Devhdd0PathValid(userConfig.devhdd0Path)
    isRPCS3ExePathValid(userConfig.rpcs3ExePath)
  } catch (err) {
    sendDialog(win, 'corruptedUserConfig')
    return false
  }
  return true
})
