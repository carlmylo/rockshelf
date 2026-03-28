import { rpcs3GetRB3Stats as getStats, isRPCS3Devhdd0PathValid, isRPCS3ExePathValid, type RockBand3Data } from 'rbtools/lib'
import { readUserConfigFile, sendDialog, sendMessageBox, useHandler } from '../core.exports'

export const rpcs3GetRB3Stats = useHandler(async (win, __): Promise<false | RockBand3Data> => {
  const userConfig = await readUserConfigFile()
  if (!userConfig) {
    sendDialog(win, 'corruptedUserConfig')
    return false
  }

  try {
    const devhdd0Path = isRPCS3Devhdd0PathValid(userConfig.devhdd0Path)
    const rpcs3ExePath = isRPCS3ExePathValid(userConfig.rpcs3ExePath)
    return await getStats(devhdd0Path, rpcs3ExePath)
  } catch (err) {
    sendDialog(win, 'corruptedUserConfig')
    return false
  }
})
