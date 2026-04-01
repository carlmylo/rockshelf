import { RB3SaveData, type ParsedRB3SaveData } from 'rbtools'
import { getRB3SaveDataFile, readUserConfigFile, sendDialog, useHandler } from '../core.exports'
import { isRPCS3Devhdd0PathValid } from 'rbtools/lib'

/**
 * Retrieves data from the user's Rock Band 3 save data.
 */
export const rpcs3GetSaveDataStats = useHandler(async (win, __): Promise<false | ParsedRB3SaveData> => {
  const userConfig = await readUserConfigFile()
  if (!userConfig) {
    sendDialog(win, 'corruptedUserConfig')
    return false
  }

  const devhdd0Path = isRPCS3Devhdd0PathValid(userConfig.devhdd0Path)
  const rb3SaveDataPath = getRB3SaveDataFile(devhdd0Path)
  return await RB3SaveData.parseFromFile(rb3SaveDataPath)
})
