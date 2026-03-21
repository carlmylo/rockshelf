import { useEffect } from 'react'
import { DialogScreen, FirstTimeScreen, LogoScreen, MainScreen, SmallMessage, Topbar, WindowFrame } from './components.exports'
import { useWindowState } from './stores/Window.state'
import { useFirstTimeScreenState } from './components/FirstTimeScreen.state'
import { useTranslation } from 'react-i18next'
import { useUserConfigState } from './stores/UserConfig.state'
import { InstrumentScoreData } from 'rbtools'
import { useLogoScreenState } from './components/LogoScreen.state'
import { useSmallMessageState } from './components/SmallMessage.state'
import { useDialogScreenState } from './components/DialogScreen.state'

export function App() {
  const { i18n } = useTranslation()
  const setWindowState = useWindowState((x) => x.setWindowState)
  const setFirstTimeScreenState = useFirstTimeScreenState((x) => x.setFirstTimeScreenState)
  const setUserConfigState = useUserConfigState((x) => x.setUserConfigState)
  const setLogoScreenState = useLogoScreenState((x) => x.setLogoScreenState)
  const setSmallMessageState = useSmallMessageState((x) => x.setSmallMessageState)
  const setDialogScreenState = useDialogScreenState((x) => x.setDialogScreenState)

  useEffect(function initApp() {
    const fn = async () => {
      try {
        const hasUserConfig = await window.api.readUserConfigFile()

        if (!hasUserConfig) {
          setWindowState({ disableButtons: false })
          setFirstTimeScreenState({ active: true })
          return
        }

        const testUserConfig = await window.api.testUserConfig()
        if (!testUserConfig) {
          setWindowState({ disableButtons: false })
          return
        }

        if (import.meta.env.DEV) console.log('struct UserConfigObject ["core/src/core/userConfigData.ts"]:', hasUserConfig)
        setUserConfigState(hasUserConfig)

        const rb3Stats = await window.api.rpcs3GetRB3Stats()
        if (import.meta.env.DEV) console.log('struct RockBand3Data ["rbtools/src/lib/rpcs3/rpcs3GetRB3Stats.ts"]:', rb3Stats)

        const saveData = await window.api.rpcs3GetSaveDataStats()
        if (import.meta.env.DEV) console.log('struct ParsedRB3SaveData ["rbtools/src/lib/rpsc3/getSaveData.ts"]:', saveData)

        let instrumentScores: InstrumentScoreData | false = false
        if (saveData) instrumentScores = await window.api.rpcs3GetInstrumentScores(saveData)
        if (import.meta.env.DEV) console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', instrumentScores)

        setWindowState({
          rb3Stats,
          saveData,
          instrumentScores,
          disableButtons: false,
        })
        setLogoScreenState({ active: false })
      } catch (err) {
        if (err instanceof Error) setWindowState({ err })
      }
    }

    const touts: NodeJS.Timeout[] = []

    const t1 = setTimeout(() => setLogoScreenState({ showText: true }), 500)
    const t2 = setTimeout(() => fn().then(() => undefined), 1500)
    touts.push(t1, t2)

    return () => {
      for (const tout of touts) clearTimeout(tout)
    }
  }, [])

  useEffect(function initLocaleReqListener() {
    window.api.onLocaleRequest((_, uuid, key) => {
      const text = i18n.exists(key) ? i18n.t(key) : key
      window.api.sendLocale(uuid, text)
    })
  })

  useEffect(function initSmallMessageListener() {
    window.api.onSmallMessage((_, message) => setSmallMessageState({ message }))
  })

  useEffect(function initDialogListener() {
    window.api.onDialog((_, code) => setDialogScreenState({ active: code }))
  })
  return (
    <>
      <Topbar />
      <WindowFrame>
        <LogoScreen />
        <FirstTimeScreen />
        <MainScreen />

        <DialogScreen />
        <SmallMessage />
      </WindowFrame>
    </>
  )
}
