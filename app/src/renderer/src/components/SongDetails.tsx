import { AnimatedDiv, AnimatedSection, TransComponent, animate, formatNumberWithDots } from '@renderer/lib.exports'
import { useMyPackagesScreenState } from './MyPackagesScreen.state'
import { useWindowState } from '@renderer/stores/Window.state'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DiamondIcon, LoadingIcon, PlaystationIcon, RPCS3Icon, WiiIcon, XboxIcon } from '@renderer/assets/icons'
import clsx from 'clsx'
import { useShallow } from 'zustand/shallow'
import { SONG_DETAILS_TABS } from '@renderer/app/rockshelf'
import { useUserConfigState } from '@renderer/stores/UserConfig.state'
import { StarsInline } from './PackageDetails'
import { bandIcon, guitarIcon, bassIcon, drumsIcon, keysIcon, vocalsIcon, proGuitarIcon, proBassIcon, proDrumsIcon, proKeysIcon, harm3Icon } from '@renderer/assets/images'

export function SongDetails() {
  const { t } = useTranslation()
  const { selPKG, selSong, isArtworkLoading, artworkURL, songDetailsTab, songLeaderboards, setMyPackagesScreenState } = useMyPackagesScreenState(useShallow((x) => ({ selPKG: x.selPKG, selSong: x.selSong, isArtworkLoading: x.isArtworkLoading, artworkURL: x.artworkURL, setMyPackagesScreenState: x.setMyPackagesScreenState, songDetailsTab: x.songDetailsTab, songLeaderboards: x.songLeaderboards })))
  const { mostPlayedInstrument } = useUserConfigState(useShallow((x) => ({ mostPlayedInstrument: x.mostPlayedInstrument })))
  const { disableButtons, setWindowState, packages, saveData } = useWindowState(useShallow((x) => ({ disableButtons: x.disableButtons, setWindowState: x.setWindowState, packages: x.packages, saveData: x.saveData })))
  const packageDetails = useMemo(() => (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages ? packages.packages[selPKG] : null), [packages, selPKG])
  const songDetails = useMemo(() => (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages && selSong > -1 && packageDetails !== null && selSong in packageDetails.songs ? packageDetails.songs[selSong] : null), [packages, selPKG, selSong])
  const { setUserConfigState } = useUserConfigState(useShallow((x) => ({ setUserConfigState: x.setUserConfigState })))

  const allTracksCount = useMemo(() => songDetails?.tracks_count.reduce<number>((prev, curr) => (curr ? prev + curr : prev), 0), [songDetails])

  const resetSongDetailsState = () => {
    setMyPackagesScreenState({ selSong: -1, isArtworkLoading: true, artworkURL: '', songDetailsTab: 0, songLeaderboards: false })
  }

  console.log()

  useEffect(
    function getArtworkFromSong() {
      const start = async () => {
        if (!packageDetails || !songDetails) return

        if (packageDetails.official?.code === 'rb3') {
          setMyPackagesScreenState({ isArtworkLoading: false, artworkURL: `rb3art://${songDetails.songname}` })
          return
        }

        try {
          const artworkDataURL = await window.api.getSongArtworkDataURL(packageDetails, songDetails)
          if (artworkDataURL) setMyPackagesScreenState({ artworkURL: artworkDataURL, isArtworkLoading: false })
        } catch (err) {
          if (err instanceof Error) setWindowState({ err })
        }
      }

      void start()
    },
    [packages, selPKG, selSong]
  )

  useEffect(
    function () {
      const start = async () => {
        if (songDetailsTab === SONG_DETAILS_TABS.LEADERBOARDS && songDetails !== null && typeof songDetails.song_id === 'number') {
          setMyPackagesScreenState({ songLeaderboards: 'loading' })
          const leaderboards = await window.api.getScoresFromGoCentral(songDetails.song_id, mostPlayedInstrument)
          console.log('struct GoCentralLeaderboardResultObject [core/src/lib/rbtools/core/GoCentralAPI.ts]', leaderboards)
          setMyPackagesScreenState({ songLeaderboards: leaderboards })
        }
      }
      void start()
    },
    [songDetailsTab, songDetails, mostPlayedInstrument]
  )

  return (
    <AnimatedSection id="SongDetails" {...animate({ opacity: true })} condition={songDetails !== null} className="absolute! z-7 h-full max-h-full w-full max-w-full bg-black/90 p-8 backdrop-blur-lg">
      {songDetails !== null && (
        <>
          <div className="mb-2 flex-row! items-start border-b border-white/25 pb-2">
            <div className={clsx('mr-2 h-32 min-h-32 w-32 min-w-32', isArtworkLoading && 'border border-neutral-800')}>
              <AnimatedDiv condition={isArtworkLoading} className="absolute! h-full w-full items-center justify-center bg-black/95 backdrop-blur-lg">
                <LoadingIcon className="animate-spin text-xl" style={{ animationTimingFunction: '0.1s !important' }} />
              </AnimatedDiv>
              <img src={artworkURL || 'rbicons://website'} className="h-full w-full border-2 border-neutral-700" />
            </div>

            <div className="mr-auto h-full w-full">
              <h1 className="font-pentatonicalt! mb-2 text-[2rem]">{songDetails.name}</h1>
              <div className="w-full flex-row! items-start">
                <div className="w-[75%] max-w-[75%]">
                  <h2 className="font-bold text-gray-300 uppercase">{t('artist')}</h2>
                  <p className="mb-1">{songDetails.artist}</p>
                  {songDetails.album_name ? <h2 className="font-bold text-gray-300 uppercase">{t('albumName')}</h2> : <h2 className="font-bold text-gray-300 uppercase">{t('yearReleased')}</h2>}
                  {songDetails.album_name ? (
                    <p className="mb-1">{songDetails.album_name}</p>
                  ) : (
                    <p className="mb-1">
                      {songDetails.year_released}
                      {songDetails.year_recorded ? ` (${songDetails.year_recorded})` : ''}
                    </p>
                  )}
                </div>
                <div className="w-[25%] max-w-[25%]">
                  <h2 className="font-bold text-gray-300 uppercase">{t('genre')}</h2>
                  <div className="mb-1 w-full flex-row! items-center">
                    <p className="">{t(songDetails.customsource?.genre || songDetails.genre)}</p>
                    {typeof songDetails.customsource?.genre === 'string' && <DiamondIcon className="relative top-[0.1rem] ml-1 rotate-45 cursor-help text-gray-700 duration-100 hover:text-gray-300" title={t('dxGenreOnly')} />}
                  </div>
                  {songDetails.album_name && (
                    <>
                      <h2 className="font-bold text-gray-300 uppercase">{t('yearReleased')}</h2>
                      <p className="mb-1">
                        {songDetails.year_released}
                        {songDetails.year_recorded ? ` (${songDetails.year_recorded})` : ''}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-24">
              <button
                disabled={disableButtons}
                className="w-full self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! text-nowrap uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
                onClick={async () => {
                  resetSongDetailsState()
                }}
              >
                {t('goBack')}
              </button>
            </div>
          </div>
          <div className="mb-2 h-6 min-h-6 w-full flex-row! items-center rounded-b-sm bg-white/15 px-4">
            <button
              disabled={disableButtons}
              className={clsx('flex-row! items-center', songDetailsTab === SONG_DETAILS_TABS.DETAILS ? 'bg-yellow-500 text-black/90 hover:bg-yellow-400 active:bg-yellow-300' : 'hover:text-neutral-300 active:text-neutral-200', 'h-full w-fit justify-center px-2 duration-200')}
              onClick={() => {
                setMyPackagesScreenState({ songDetailsTab: SONG_DETAILS_TABS.DETAILS })
              }}
            >
              {t('details')}
            </button>
            <button
              disabled={disableButtons}
              className={clsx('flex-row! items-center', songDetailsTab === SONG_DETAILS_TABS.LEADERBOARDS ? 'bg-yellow-500 text-black/90 hover:bg-yellow-400 active:bg-yellow-300' : 'hover:text-neutral-300 active:text-neutral-200', 'h-full w-fit justify-center px-2 duration-200')}
              onClick={() => {
                setMyPackagesScreenState({ songDetailsTab: SONG_DETAILS_TABS.LEADERBOARDS })
              }}
            >
              <img src={`instrumenticons://${mostPlayedInstrument}`} className={clsx('mr-1 h-5 w-5', songDetailsTab === SONG_DETAILS_TABS.LEADERBOARDS ? 'opacity-100' : 'opacity-75')} />
              {t('leaderboards')}
            </button>
            {packageDetails?.official?.code !== 'rb3' && (
              <>
                <button
                  disabled={disableButtons}
                  className={clsx('flex-row! items-center', songDetailsTab === SONG_DETAILS_TABS.MISC ? 'bg-yellow-500 text-black/90 hover:bg-yellow-400 active:bg-yellow-300' : 'hover:text-neutral-300 active:text-neutral-200', 'h-full w-fit justify-center px-2 duration-200')}
                  onClick={() => {
                    setMyPackagesScreenState({ songDetailsTab: SONG_DETAILS_TABS.MISC })
                  }}
                >
                  {t('misc')}
                </button>
              </>
            )}
          </div>
          {songDetailsTab === SONG_DETAILS_TABS.DETAILS && (
            <>
              <div className="h-full w-full overflow-y-auto"></div>
            </>
          )}
          {songDetailsTab === SONG_DETAILS_TABS.LEADERBOARDS && (
            <>
              <div className="h-full w-full overflow-y-auto">
                <div className="mb-2 flex-row! items-center">
                  <button
                    title={t('band')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'band' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'band' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'band' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={bandIcon} width={24} />
                  </button>
                  <button
                    title={t('guitar')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'guitar' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'guitar' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'guitar' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={guitarIcon} width={24} />
                  </button>
                  <button
                    title={t('bass')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'bass' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'bass' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'bass' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={bassIcon} width={24} />
                  </button>

                  <button
                    title={t('drums')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'drums' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'drums' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'drums' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={drumsIcon} width={24} />
                  </button>
                  <button
                    title={t('keys')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'keys' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'keys' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'keys' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={keysIcon} width={24} />
                  </button>
                  <button
                    title={t('vocals')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'vocals' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'vocals' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'vocals' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={vocalsIcon} width={24} />
                  </button>
                  <button
                    title={t('proGuitar')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'proGuitar' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'proGuitar' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'proGuitar' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={proGuitarIcon} width={24} />
                  </button>
                  <button
                    title={t('proBass')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'proBass' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'proBass' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'proBass' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={proBassIcon} width={24} />
                  </button>

                  <button
                    title={t('proDrums')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'proDrums' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'proDrums' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'proDrums' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={proDrumsIcon} width={24} />
                  </button>
                  <button
                    title={t('proKeys')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'proKeys' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'proKeys' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'proKeys' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={proKeysIcon} width={24} />
                  </button>
                  <button
                    title={t('harmonies')}
                    disabled={disableButtons}
                    className={clsx('mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 font-sans! text-xs! uppercase duration-200 last:mr-0', mostPlayedInstrument === 'harmonies' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                    onClick={async () => {
                      setWindowState({ disableButtons: true })
                      setUserConfigState({ mostPlayedInstrument: 'harmonies' })
                      await window.api.saveUserConfigFile({ mostPlayedInstrument: 'harmonies' })
                      if (typeof saveData === 'object') {
                        const newInstrScores = await window.api.rpcs3GetInstrumentScores(saveData)
                        console.log('struct InstrumentScoreData ["rbtools/src/lib/rpcs3/getInstrumentScoresData.ts"]:', newInstrScores)
                        setWindowState({ instrumentScores: newInstrScores })
                      }
                      setMyPackagesScreenState({ catalog: false })
                      setWindowState({ disableButtons: false })
                    }}
                  >
                    <img src={harm3Icon} width={24} />
                  </button>
                </div>
                {songLeaderboards === 'loading' && <p>{t('loadingSongLeaderboards')}</p>}
                {typeof songLeaderboards === 'object' && (
                  <>
                    {songLeaderboards.scores === false && <h1>{t('noScoresForSong', { instrument: t(songLeaderboards.instrument) })}</h1>}
                    {songLeaderboards.scores !== false &&
                      songLeaderboards.scores.map((score, scoreIndex) => {
                        return (
                          <div key={`score${scoreIndex}`} className={clsx('font-pentatonic mr-4 mb-1 flex-row! items-center rounded-sm border border-neutral-700 px-2 py-1 last:mb-0', scoreIndex === 0 && 'bg-linear-to-b from-yellow-500 to-yellow-600 text-neutral-950', scoreIndex === 1 && 'bg-linear-to-b from-neutral-400 to-neutral-500 text-neutral-950', scoreIndex === 2 && 'bg-linear-to-b from-[#CD7F32] to-[#a6472d] text-neutral-950')}>
                            <h1 className="mr-1 text-xs">{scoreIndex + 1}</h1>
                            <h2 className="mr-2 text-lg">{score.name}</h2>
                            {(() => {
                              switch (score.platform) {
                                case 'rpcs3':
                                default:
                                  return <RPCS3Icon className="h-3.5 w-3.5" title="RPCS3" />
                                case 'ps3':
                                  return <PlaystationIcon className="text-lg" title="PlayStation® 3" />
                                case 'wii':
                                  return <WiiIcon className="h-6 w-6" title="Nintendo® Wii" />
                                case 'xbox':
                                  return <XboxIcon className="text-sm" title="Xbox® 360" />
                              }
                            })()}
                            <h2 className="mr-2 ml-auto font-mono text-base font-bold">{formatNumberWithDots(score.score)}</h2>
                            <div className={clsx('mr-2 rounded-xs bg-neutral-800 px-1 py-0.5', scoreIndex >= 0 && scoreIndex <= 2 ? 'text-neutral-200' : '')}>
                              {(() => {
                                switch (score.difficulty) {
                                  case 4:
                                  default:
                                    return 'X'
                                  case 3:
                                    return 'H'
                                  case 2:
                                    return 'M'
                                  case 1:
                                    return 'E'
                                }
                              })()}
                            </div>
                            <h3 className="mr-2 w-10">{`${score.scorePercent}%`}</h3>
                            <StarsInline width={1.2} stars={score.stars} />
                          </div>
                        )
                      })}
                  </>
                )}
              </div>
            </>
          )}

          {/* {songDetailsTab === SONG_DETAILS_TABS.MISC && (
            <>
              <div className="h-full w-full overflow-y-auto">
                <div className="group mb-2 rounded-xs p-3 duration-200 last:mb-0 hover:bg-white/5">
                  <h1 className="mb-1 uppercase">{t('extractMultitrack')}</h1>
                  <p className="mb-4 text-xs italic">
                    <TransComponent i18nKey="extractMultitrackDesc" />
                  </p>

                  <div className="flex-row! items-center">
                    <button
                      disabled={disableButtons}
                      className="mr-2 w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 last:mr-0 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        if (packageDetails) {
                          try {
                            await window.api.extractMultitrackFromSong(packageDetails.path, songDetails)
                          } catch (err) {
                            if (err instanceof Error) setWindowState({ err })
                          }
                        }
                        setWindowState({ disableButtons: false })
                      }}
                    >
                      {t('extract')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )} */}
        </>
      )}
    </AnimatedSection>
  )
}
