import { useHandler } from '../core.exports'
import { GoCentralAPI, type ScoreDataInstrumentTypes } from '../lib/rbtools'

export const getScoresFromGoCentral = useHandler(async (win, _, songID: number, instrument: ScoreDataInstrumentTypes = 'band') => {
  return await GoCentralAPI.getScores(win, songID, instrument)
})
