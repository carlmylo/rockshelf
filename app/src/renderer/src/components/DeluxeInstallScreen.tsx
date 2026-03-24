import { AnimatedDiv, AnimatedSection, TransComponent } from '@renderer/lib.exports'
import { useDeluxeInstallScreenState } from './DeluxeInstallScreen.state'
import { animate } from '@renderer/lib.exports'
import { useTranslation } from 'react-i18next'
import { DXNIGHTLYLINK } from '@renderer/app/rockshelf'
import { useWindowState } from '@renderer/stores/Window.state'
import { useMessageBoxState } from './MessageBox.state'
import { LoadingIcon } from '@renderer/assets/icons'

export function DeluxeInstallScreen() {
  const { t } = useTranslation()
  const active = useDeluxeInstallScreenState((x) => x.active)
  const setDeluxeInstallScreenState = useDeluxeInstallScreenState((x) => x.setDeluxeInstallScreenState)
  const selectedPKG = useDeluxeInstallScreenState((x) => x.selectedPKG)
  const resetDeluxeInstallScreenState = useDeluxeInstallScreenState((x) => x.resetDeluxeInstallScreenState)
  const setWindowState = useWindowState((x) => x.setWindowState)
  const setSmallMessageState = useMessageBoxState((x) => x.setMessageBoxState)
  const disableButtons = useWindowState((x) => x.disableButtons)
  return (
    <AnimatedSection condition={active} {...animate({ opacity: true })} id="DeluxeInstallScreen" className="absolute! z-3 h-full w-full bg-black/90 p-8 backdrop-blur-lg">
      <div className="mb-2 flex-row! items-center border-b border-white/25 pb-1">
        <h1 className="font-pentatonicalt! mr-auto text-[2rem] uppercase">{t('installDeluxe')}</h1>
        <button
          disabled={disableButtons}
          className="w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
          onClick={async () => {
            resetDeluxeInstallScreenState()
          }}
        >
          {t('goBack')}
        </button>
      </div>
      <p className="mb-4 text-xs">
        <TransComponent i18nKey="deluxeInstallScreenText" />
      </p>

      <h2 className="font-pentatonic mb-2 border-b border-white/25 pb-2 uppercase">{t('deluxeInstallScreenStep1')}</h2>
      <p className="mb-8 text-xs">
        <TransComponent i18nKey="deluxeInstallScreenStep1Text" components={{ spanLink: <a className="cursor-pointer underline hover:text-neutral-400 active:text-neutral-300" href={DXNIGHTLYLINK} target="_blank" rel="noreferrer" /> }} />
      </p>

      <h2 className="font-pentatonic mb-2 border-b border-white/25 pb-2 uppercase">{t('deluxeInstallScreenStep2')}</h2>
      <div className="flex-row! items-center">
        <AnimatedDiv condition={selectedPKG && selectedPKG !== 'loading'} {...animate({ opacity: true })}>
          {selectedPKG && selectedPKG !== 'loading' && (
            <>
              <h1>{selectedPKG.stat.fullname}</h1>
            </>
          )}
        </AnimatedDiv>

        <button
          disabled={disableButtons}
          className="ml-auto w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
          onClick={async () => {
            setWindowState({ disableButtons: true })
            setDeluxeInstallScreenState({ selectedPKG: 'loading' })
            try {
              const newSelectedPKG = await window.api.selectPKGFileToInstall()
              if (import.meta.env.DEV) console.log('struct SelectPKGFileReturnObject [core/src/controllers/selectPKGFileToInstall.ts]', newSelectedPKG)

              if (!newSelectedPKG) {
                setWindowState({ disableButtons: false })
                setDeluxeInstallScreenState({ selectedPKG: false })
                return
              }
              if (newSelectedPKG.pkgType !== 'dx') {
                setSmallMessageState({ message: { code: 'notDXPKG', type: 'error', method: 'selectDXPKGFileToInstall', messageValues: { path: newSelectedPKG.pkgPath } } })
                setDeluxeInstallScreenState({ selectedPKG: false })
                setWindowState({ disableButtons: false })
                return
              }

              setDeluxeInstallScreenState({ selectedPKG: newSelectedPKG })
              setWindowState({ disableButtons: false })
            } catch (err) {
              if (err instanceof Error) setWindowState({ err })
            }
          }}
        >
          {t('selectPKGFile')}
        </button>
      </div>
    </AnimatedSection>
  )
}
