import { AnimatedSection, animate } from '@renderer/lib.exports'
import { useMyPackagesScreenState } from './MyPackagesScreen.state'
import { useEffect, useMemo } from 'react'
import { useWindowState } from '@renderer/stores/Window.state'
import { useTranslation } from 'react-i18next'
import { useUserConfigState } from '@renderer/stores/UserConfig.state'
import { useShallow } from 'zustand/shallow'

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
  const { selPKG, catalog, setMyPackagesScreenState } = useMyPackagesScreenState(useShallow((x) => ({ selPKG: x.selPKG, catalog: x.catalog, setMyPackagesScreenState: x.setMyPackagesScreenState })))
  const { disableButtons, saveData, packages } = useWindowState(useShallow((x) => ({ disableButtons: x.disableButtons, saveData: x.saveData, packages: x.packages })))
  const mostPlayedInstrument = useUserConfigState((x) => x.mostPlayedInstrument)
  const active = useMemo(() => (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages ? packages.packages[selPKG] : null), [selPKG, packages])

  useEffect(
    function fetchCatalogObject() {
      const start = async () => {
        if (typeof packages === 'object' && selPKG > -1 && selPKG in packages.packages && catalog === false) {
          setMyPackagesScreenState({ catalog: 'loading' })
          const newCatalog = await window.api.getDTACatalog(selPKG)
          if (newCatalog.type === 'title' && import.meta.env.DEV) console.log('struct DTACatalogByTitleObject [core/src/lib/dta/getDTACatalog.ts]', newCatalog)
          setMyPackagesScreenState({ catalog: newCatalog })
        }
      }

      start()
    },
    [packages, selPKG, catalog]
  )

  return (
    <AnimatedSection id="PackageDetails" condition={active !== null && typeof catalog === 'object'} {...animate({ opacity: true })} className="absolute! z-5 h-full max-h-full w-full max-w-full bg-black/90 p-8 backdrop-blur-lg">
      {active !== null && typeof catalog === 'object' && (
        <>
          <div className="mb-2 flex-row! items-center border-b border-white/25 pb-2">
            <img src={active.thumbnailSrc} className="mr-2 h-18 min-h-18 w-18 min-w-18" />

            <div className="mr-auto h-full">
              <h1 className="font-pentatonicalt! text-[2rem]">{active.packageData.packageName}</h1>
              <p>{t(active.songs.length === 1 ? 'songCount' : 'songCountPlural', { count: active.songs.length })}</p>
            </div>
            <button
              disabled={disableButtons}
              className="w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
              onClick={async () => {
                setMyPackagesScreenState({ selPKG: -1, catalog: false })
              }}
            >
              {t('goBack')}
            </button>
          </div>

          <div className="h-full w-full overflow-y-auto">
            {catalog.type === 'title' &&
              catalog.headers.map(
                (header, headerI) =>
                  header.songsIndexes.length > 0 && (
                    <div className="mb-1 w-full flex-row! duration-150 last:mb-0" key={`titleHeader${headerI}`}>
                      <div className="w-full">
                        <div className="sticky! top-0 z-100 mb-1 w-full flex-row! items-center rounded-b-sm bg-neutral-900 px-2 py-1">
                          <h1 className="mr-auto text-xl">{header.name}</h1>
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
                  )
              )}
          </div>
        </>
      )}
    </AnimatedSection>
  )
}
