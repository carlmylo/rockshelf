import { readUserConfigFile, sendDialog, useHandler } from '../core.exports'
import { RB3SaveData, type InstrumentScoreData, type ParsedRB3SaveData } from 'rbtools'

export const rpcs3GetInstrumentScores = useHandler(async (win, __, saveData: ParsedRB3SaveData): Promise<false | InstrumentScoreData> => {
  const userConfig = await readUserConfigFile()
  if (!userConfig) {
    sendDialog(win, 'corruptedUserConfig')
    return false
  }

  const { mostPlayedDifficulty, mostPlayedInstrument } = userConfig
  return RB3SaveData.getInstrumentScoreData(saveData, mostPlayedInstrument, mostPlayedDifficulty)
})
