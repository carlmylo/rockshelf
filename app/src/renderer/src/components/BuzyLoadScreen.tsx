import { AnimatedButton, AnimatedDiv, AnimatedSection, TransComponent } from '@renderer/lib.exports'
import { animate } from '@renderer/lib.exports'
import { useBuzyLoadScreenState } from './BuzyLoadScreen.state'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckedCircleIcon, ErrorIcon, LoadingIcon } from '@renderer/assets/icons'
import { useWindowState } from '@renderer/stores/Window.state'
import { useDeluxeInstallScreenState } from './DeluxeInstallScreen.state'
import { useShallow } from 'zustand/shallow'

export function BuzyLoadScreen() {
  const { t } = useTranslation()
  const { active, hasError, isCompleted, resetBuzyLoadScreenState, setBuzyLoadScreenState, step } = useBuzyLoadScreenState(useShallow((x) => ({ active: x.active, step: x.step, isCompleted: x.isCompleted, hasError: x.hasError, setBuzyLoadScreenState: x.setBuzyLoadScreenState, resetBuzyLoadScreenState: x.resetBuzyLoadScreenState })))
  const setWindowState = useWindowState((x) => x.setWindowState)
  const resetDeluxeInstallScreenState = useDeluxeInstallScreenState((x) => x.resetDeluxeInstallScreenState)

  const condition = useMemo(() => active !== null, [active])

  return (
    <AnimatedSection id="BuzyLoadScreen" condition={condition} {...animate({ opacity: true })} className="absolute! z-10 h-full max-h-full w-full max-w-full bg-black/90 p-8 backdrop-blur-lg">
      {active && (
        <>
          <div className="mb-6 flex-row! items-center border-b border-white/25 pb-1">
            <h1 className="font-pentatonicalt! mr-auto text-[2rem] uppercase">{t(active.title)}</h1>
          </div>
          {active.steps !== null &&
            active.steps.map((activeSteps, activeStepsIndex) => {
              return (
                <div key={`active.steps${activeStepsIndex}`} className="mb-4 flex-row! items-center">
                  {activeStepsIndex === step && !isCompleted && !hasError && <LoadingIcon className="h-4 w-4 animate-spin" />}
                  {activeStepsIndex === step && hasError && <ErrorIcon className="h-4 w-4 text-red-500" />}
                  {(activeStepsIndex < step || isCompleted) && <CheckedCircleIcon className="h-4 w-4 text-green-500" />}
                  {activeStepsIndex > step && <div className="h-4 w-4" />}
                  <h2 className="ml-2 text-base">
                    {t(activeSteps)}
                    {activeStepsIndex === step && !isCompleted ? '...' : ''}
                  </h2>
                </div>
              )
            })}
          <AnimatedDiv condition={hasError !== null} {...animate({ opacity: true, scaleY: true, height: true })}>
            {hasError !== null && (
              <>
                <p className="text-xs text-neutral-500 italic">
                  <TransComponent i18nKey={hasError.errorName} values={hasError.messageValues} />
                </p>
                <div className="h-4 w-full"></div>
              </>
            )}
          </AnimatedDiv>
          <AnimatedButton
            condition={isCompleted || hasError !== null}
            {...animate({ opacity: true })}
            className="w-fit self-start rounded-xs border border-neutral-700 bg-neutral-900 px-1 py-0.5 text-xs! uppercase duration-100 hover:bg-neutral-700 active:bg-neutral-600 disabled:text-neutral-700 disabled:hover:bg-neutral-900"
            onClick={async () => {
              if (hasError !== null) {
                resetBuzyLoadScreenState()
                return
              }
              if (Array.isArray(active.onCompleted)) {
                for (const fn of active.onCompleted) {
                  switch (fn) {
                    case 'refreshRB3Stats':
                    default: {
                      const rb3Stats = await window.api.rpcs3GetRB3Stats()
                      console.log('struct RockBand3Data ["rbtools/src/lib/rpcs3/rpcs3GetRB3Stats.ts"]:', rb3Stats)
                      setWindowState({ rb3Stats })
                      break
                    }
                    case 'resetDeluxeInstallScreenState': {
                      resetDeluxeInstallScreenState()
                      break
                    }
                  }
                }
              }
              resetBuzyLoadScreenState()
            }}
          >
            {t('close')}
          </AnimatedButton>
        </>
      )}
    </AnimatedSection>
  )
}
