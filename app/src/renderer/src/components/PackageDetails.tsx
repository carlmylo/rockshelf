import { AnimatedDiv, AnimatedSection, TransComponent, animate } from '@renderer/lib.exports'
import { useMyPackagesScreenState } from './MyPackagesScreen.state'
import { useEffect, useMemo } from 'react'
import { useWindowState } from '@renderer/stores/Window.state'
import { useTranslation } from 'react-i18next'
import { useUserConfigState } from '@renderer/stores/UserConfig.state'
import { useShallow } from 'zustand/shallow'
import { LoadingIcon } from '@renderer/assets/icons'
import clsx from 'clsx'
import { bandIcon, guitarIcon, bassIcon, drumsIcon, keysIcon, vocalsIcon, proGuitarIcon, proBassIcon, proDrumsIcon, proKeysIcon, harm3Icon } from '@renderer/assets/images'

export function StarsInline({ stars }: { stars: number }) {
  return (
    <div className="flex-row! items-center">
      <img className="mr-0.5 w-4" src={stars >= 1 ? (stars === 6 ? 'rbicons://rb4-stars-gold' : 'rbicons://rb4-stars') : 'rbicons://rb4-stars-out'} />
      <img className="mr-0.5 w-4" src={stars >= 2 ? (stars === 6 ? 'rbicons://rb4-stars-gold' : 'rbicons://rb4-stars') : 'rbicons://rb4-stars-out'} />
      <img className="mr-0.5 w-4" src={stars >= 3 ? (stars === 6 ? 'rbicons://rb4-stars-gold' : 'rbicons://rb4-stars') : 'rbicons://rb4-stars-out'} />
      <img className="mr-0.5 w-4" src={stars >= 4 ? (stars === 6 ? 'rbicons://rb4-stars-gold' : 'rbicons://rb4-stars') : 'rbicons://rb4-stars-out'} />
      <img className="w-4" src={stars >= 5 ? (stars === 6 ? 'rbicons://rb4-stars-gold' : 'rbicons://rb4-stars') : 'rbicons://rb4-stars-out'} />
    </div>
  )
}

export function PackageDetails() {
  const { t } = useTranslation()
  const { selPKG, catalog, setMyPackagesScreenState, catalogSortBy, packageDetailsTab } = useMyPackagesScreenState(useShallow((x) => ({ selPKG: x.selPKG, catalog: x.catalog, setMyPackagesScreenState: x.setMyPackagesScreenState, catalogSortBy: x.catalogSortBy, packageDetailsTab: x.packageDetailsTab })))
  const { disableButtons, saveData, packages, instrumentScores, setWindowState } = useWindowState(useShallow((x) => ({ disableButtons: x.disableButtons, saveData: x.saveData, packages: x.packages, instrumentScores: x.instrumentScores, setWindowState: x.setWindowState })))
  const { mostPlayedInstrument, setUserConfigState } = useUserConfigState(useShallow((x) => ({ mostPlayedInstrument: x.mostPlayedInstrument, setUserConfigState: x.setUserConfigState })))
  const active = useMemo(() => (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages ? packages.packages[selPKG] : null), [selPKG, packages])

  useEffect(
    function fetchCatalogObject() {
      const start = async () => {
        if (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages && catalog === false) {
          setMyPackagesScreenState({ catalog: 'loading' })
          setWindowState({ disableButtons: true })
          try {
            const newCatalog = await window.api.getDTACatalog(selPKG, catalogSortBy, { instrument: mostPlayedInstrument })
            if (!newCatalog) return
            if (import.meta.env.DEV) {
              if (newCatalog.type !== 'difficulty' && newCatalog.type !== 'artist') console.log('struct DTACatalogGenericObject [core/src/lib/dta/getDTACatalog.ts]', newCatalog)
              else if (newCatalog.type === 'artist') console.log('struct DTACatalogByArtistObject [core/src/lib/dta/getDTACatalog.ts]', newCatalog)
              else console.log('struct DTACatalogByDifficultyObject [core/src/lib/dta/getDTACatalog.ts]', newCatalog)
            }
            setMyPackagesScreenState({ catalog: newCatalog })
            setWindowState({ disableButtons: false })
          } catch (err) {
            if (err instanceof Error) setWindowState({ err })
          }
        }
      }

      start()
    },
    [packages, selPKG, catalog, catalogSortBy, mostPlayedInstrument]
  )

  return (
    <AnimatedSection id="PackageDetails" condition={active !== null && catalog !== false} {...animate({ opacity: true })} className="absolute! z-5 h-full max-h-full w-full max-w-full bg-black/90 p-8 backdrop-blur-lg">
      {active !== null && catalog !== false && (
        <>
          <div className="flex-row! items-center border-b border-white/15 pb-2">
            <div>
              <img src={active.thumbnailSrc} className="mr-2 h-18 min-h-18 w-18 min-w-18" />
              {typeof instrumentScores === 'object' && <img title={t(instrumentScores.instrument)} src={`instrumenticons://${instrumentScores.instrument.toLowerCase()}`} className="absolute! -right-[0.3rem] -bottom-[0.3rem] mr-2 h-6 w-6 opacity-95" />}
            </div>

            <div className="mr-auto h-full">
              <h1 className="font-pentatonicalt! text-[2rem]">{active.packageData.packageName}</h1>
              <p>{t(active.songs.length === 1 ? 'songCount' : 'songCountPlural', { count: active.songs.length })}</p>
            </div>
            <button
              disabled={disableButtons}
              className="w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
              onClick={async () => {
                setMyPackagesScreenState({ selPKG: -1, catalog: false, packageDetailsTab: 0 })
              }}
            >
              {t('goBack')}
            </button>
          </div>
          <div className="mb-2 h-6 min-h-6 w-full flex-row! items-center rounded-b-sm bg-white/15 px-4">
            <button
              disabled={disableButtons}
              className={clsx(packageDetailsTab === 0 ? 'bg-yellow-500 text-black/90 hover:bg-yellow-400 active:bg-yellow-300' : 'hover:text-neutral-300 active:text-neutral-200', 'h-full w-fit justify-center px-2 duration-200')}
              onClick={() => {
                setMyPackagesScreenState({ packageDetailsTab: 0 })
              }}
            >
              {t('songs')}
            </button>
            <button
              disabled={disableButtons}
              className={clsx(packageDetailsTab === 1 ? 'bg-yellow-500 text-black/90 hover:bg-yellow-400 active:bg-yellow-300' : 'hover:text-neutral-300 active:text-neutral-200', 'h-full w-fit justify-center px-2 duration-200')}
              onClick={() => {
                setMyPackagesScreenState({ packageDetailsTab: 1 })
              }}
            >
              {t('options')}
            </button>
          </div>
          {packageDetailsTab === 0 && (
            <>
              {active !== null && catalog === 'loading' && (
                <>
                  <div className="flex-row! items-center">
                    <LoadingIcon className="mr-1 animate-spin" />
                    <p>{t('loadingSongSorting')}</p>
                  </div>
                </>
              )}
              {typeof catalog === 'object' && (
                <>
                  <div className="h-full w-full overflow-y-auto">
                    {catalog.type !== 'artist' &&
                      catalog.headers.map((header, headerI) => (
                        <div className="mb-1 w-full flex-row! duration-150 last:mb-0" key={`titleHeader${headerI}`}>
                          <div className="w-full">
                            <div className="sticky! top-0 z-100 mb-1 w-full flex-row! items-center rounded-b-sm bg-neutral-900 px-2 py-1">
                              <h1 className="mr-auto text-lg uppercase">{catalog.type === 'yearReleased' ? header.name : t(header.code)}</h1>
                              <p className="font-pentatonic text-neutral-500 uppercase">{t(header.songsIndexes.length === 1 ? 'songCount' : 'songCountPlural', { count: header.songsIndexes.length })}</p>
                            </div>
                            {header.songsIndexes.map((songI) => {
                              const song = active.songs[songI]
                              return (
                                <div
                                  className="mb-0.5 w-full flex-row! items-center rounded-sm border-2 border-white/5 p-2 last:mb-1 hover:bg-white/5 active:bg-white/10"
                                  key={`song${songI}`}
                                  onClick={async () => {
                                    setMyPackagesScreenState({ selSong: songI })
                                  }}
                                >
                                  <h2 className="font-pentatonic mr-2">{song.name}</h2>
                                  <h2 className="mr-auto text-xs text-neutral-600 italic">{song.artist}</h2>
                                  {typeof saveData === 'object' &&
                                    (() => {
                                      const score = saveData.scores.find((val) => val.song_id === song.song_id)
                                      const instrScore = score?.[mostPlayedInstrument]
                                      if (!instrScore)
                                        return (
                                          <div className="flex-row! items-center">
                                            <h1 className="mr-2">{`0%`}</h1>
                                            <StarsInline stars={0} />
                                          </div>
                                        )
                                      else {
                                        const perc = instrScore.topScoreDifficulty === 0 ? instrScore.percentEasy : instrScore.topScoreDifficulty === 1 ? instrScore.percentMedium : instrScore.topScoreDifficulty === 2 ? instrScore.percentHard : instrScore.percentExpert
                                        const stars = instrScore.topScoreDifficulty === 0 ? instrScore.starsEasy : instrScore.topScoreDifficulty === 1 ? instrScore.starsMedium : instrScore.topScoreDifficulty === 2 ? instrScore.starsHard : instrScore.starsExpert
                                        return (
                                          <div className="flex-row! items-center">
                                            <h1 className="mr-2">{`${perc}%`}</h1>
                                            <StarsInline stars={stars} />
                                          </div>
                                        )
                                      }
                                    })()}
                                </div>
                              )
                            })}
                          </div>
                          <div className="h-full w-2" />
                        </div>
                      ))}
                    {catalog.type === 'artist' &&
                      catalog.headers.map((header, headerI) => (
                        <div className="mb-1 w-full flex-row! duration-150 last:mb-0" key={`artist_${header.code}`}>
                          <div className="w-full">
                            <div className="sticky! top-0 z-100 mb-1 w-full flex-row! items-center rounded-b-sm bg-neutral-900 px-2 py-1">
                              <h1 className="mr-auto text-lg uppercase">{header.name}</h1>
                              <p className="font-pentatonic text-neutral-500 uppercase">{t(header.songsCount === 1 ? 'songCount' : 'songCountPlural', { count: header.songsCount })}</p>
                            </div>
                            {header.albums.map((album) => {
                              return (
                                <div className="mb-1 w-full flex-row! duration-150 last:mb-0" key={`artist___album_${album.code}`}>
                                  <div className="w-full">
                                    <div className="sticky! top-7.5 z-99 mb-1 w-full flex-row! items-center bg-cyan-950 px-2 py-1">
                                      <h1 className="mr-auto text-lg uppercase">{album.name}</h1>
                                      <p className="font-pentatonic text-neutral-500 uppercase">{t(album.songsIndexes.length === 1 ? 'songCount' : 'songCountPlural', { count: album.songsIndexes.length })}</p>
                                    </div>

                                    {album.songsIndexes.map((songI) => {
                                      const song = active.songs[songI]
                                      return (
                                        <div
                                          className="mb-0.5 w-full flex-row! items-center rounded-sm border-2 border-white/5 p-2 last:mb-1 hover:bg-white/5 active:bg-white/10"
                                          key={`song${songI}`}
                                          onClick={async () => {
                                            setMyPackagesScreenState({ selSong: songI })
                                          }}
                                        >
                                          <h2 className="font-pentatonic mr-2">{song.name}</h2>
                                          <h2 className="mr-auto text-xs text-neutral-600 italic">{song.artist}</h2>
                                          {typeof saveData === 'object' &&
                                            (() => {
                                              const score = saveData.scores.find((val) => val.song_id === song.song_id)
                                              const instrScore = score?.[mostPlayedInstrument]
                                              if (!instrScore)
                                                return (
                                                  <div className="flex-row! items-center">
                                                    <h1 className="mr-2">{`0%`}</h1>
                                                    <StarsInline stars={0} />
                                                  </div>
                                                )
                                              else {
                                                const perc = instrScore.topScoreDifficulty === 0 ? instrScore.percentEasy : instrScore.topScoreDifficulty === 1 ? instrScore.percentMedium : instrScore.topScoreDifficulty === 2 ? instrScore.percentHard : instrScore.percentExpert
                                                const stars = instrScore.topScoreDifficulty === 0 ? instrScore.starsEasy : instrScore.topScoreDifficulty === 1 ? instrScore.starsMedium : instrScore.topScoreDifficulty === 2 ? instrScore.starsHard : instrScore.starsExpert
                                                return (
                                                  <div className="flex-row! items-center">
                                                    <h1 className="mr-2">{`${perc}%`}</h1>
                                                    <StarsInline stars={stars} />
                                                  </div>
                                                )
                                              }
                                            })()}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                            {header.songsIndexes.map((songI) => {
                              const song = active.songs[songI]
                              return (
                                <div
                                  className="mb-0.5 w-full flex-row! items-center rounded-sm border-2 border-white/5 p-2 last:mb-1 hover:bg-white/5 active:bg-white/10"
                                  key={`song${songI}`}
                                  onClick={async () => {
                                    setMyPackagesScreenState({ selSong: songI })
                                  }}
                                >
                                  <h2 className="font-pentatonic mr-2">{song.name}</h2>
                                  <h2 className="mr-auto text-xs text-neutral-600 italic">{song.artist}</h2>
                                  {typeof saveData === 'object' &&
                                    (() => {
                                      const score = saveData.scores.find((val) => val.song_id === song.song_id)
                                      const instrScore = score?.[mostPlayedInstrument]
                                      if (!instrScore)
                                        return (
                                          <div className="flex-row! items-center">
                                            <h1 className="mr-2">{`0%`}</h1>
                                            <StarsInline stars={0} />
                                          </div>
                                        )
                                      else {
                                        const perc = instrScore.topScoreDifficulty === 0 ? instrScore.percentEasy : instrScore.topScoreDifficulty === 1 ? instrScore.percentMedium : instrScore.topScoreDifficulty === 2 ? instrScore.percentHard : instrScore.percentExpert
                                        const stars = instrScore.topScoreDifficulty === 0 ? instrScore.starsEasy : instrScore.topScoreDifficulty === 1 ? instrScore.starsMedium : instrScore.topScoreDifficulty === 2 ? instrScore.starsHard : instrScore.starsExpert
                                        return (
                                          <div className="flex-row! items-center">
                                            <h1 className="mr-2">{`${perc}%`}</h1>
                                            <StarsInline stars={stars} />
                                          </div>
                                        )
                                      }
                                    })()}
                                </div>
                              )
                            })}
                          </div>
                          <div className="h-full w-2" />
                        </div>
                      ))}
                  </div>
                </>
              )}
            </>
          )}
          {packageDetailsTab === 1 && (
            <>
              <div className="h-full w-full overflow-y-auto">
                <div className="group mb-2 rounded-xs p-3 duration-200 last:mb-0 hover:bg-white/5">
                  <h1 className="mb-1 uppercase">{t('sortBy')}</h1>
                  <p className="mb-4 text-xs italic">{t('sortByDesc')}</p>
                  <div className="flex-row! items-center">
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'title' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'title', catalog: false })
                      }}
                    >
                      {t('sortByTitle')}
                    </button>
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'artist' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'artist', catalog: false })
                      }}
                    >
                      {t('sortByArtist')}
                    </button>
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'genre' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'genre', catalog: false })
                      }}
                    >
                      {t('sortByGenre')}
                    </button>
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'decade' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'decade', catalog: false })
                      }}
                    >
                      {t('sortByDecade')}
                    </button>
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'yearReleased' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'yearReleased', catalog: false })
                      }}
                    >
                      {t('sortByYearReleased')}
                    </button>
                    <button
                      disabled={disableButtons}
                      className={clsx('font-pentatonic mr-2 flex-row! items-center rounded-xs border border-neutral-800 px-2 py-1 text-xs! uppercase duration-200 last:mr-0', catalogSortBy === 'difficulty' ? 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-200' : 'bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700')}
                      onClick={async () => {
                        setWindowState({ disableButtons: true })
                        setMyPackagesScreenState({ catalogSortBy: 'difficulty', catalog: false })
                      }}
                    >
                      {t('sortByDifficulty')}
                    </button>
                  </div>
                  <AnimatedDiv condition={catalogSortBy === 'difficulty'} {...animate({ opacity: true, height: true, scaleY: true, duration: 0.3 })} className="origin-top">
                    <div className="h-2 w-full" />
                    <div className="flex-row! items-center">
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
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
                          setWindowState({ disableButtons: false })
                          setMyPackagesScreenState({ catalog: false })
                        }}
                      >
                        <img src={harm3Icon} width={24} />
                      </button>
                    </div>
                  </AnimatedDiv>
                </div>

                {/* <AnimatedDiv condition={catalogSortBy === 'difficulty'} className="group mb-2 origin-top rounded-xs p-3 duration-200 last:mb-0 hover:bg-white/5">
                  <div>
                    <h1 className="mb-1 uppercase">{t('changeInstrumentScores')}</h1>
                    <p className="mb-4 text-xs italic">
                      <TransComponent i18nKey="changeInstrumentScoresDesc" />
                    </p>
                  </div>
                </AnimatedDiv> */}
              </div>
            </>
          )}
        </>
      )}
    </AnimatedSection>
  )
}
