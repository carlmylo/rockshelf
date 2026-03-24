import { animate, AnimatedSection } from '@renderer/lib.exports'
import { useDialogScreenState } from './DialogScreen.state'
import { useTranslation } from 'react-i18next'
import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

function DialogButton({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx('rounded-xs border border-neutral-800 bg-neutral-900 px-1 py-0.5 text-sm! uppercase duration-100 hover:bg-neutral-800 active:bg-neutral-700 disabled:text-neutral-700 disabled:hover:bg-neutral-900', className)} {...props}>
      {children}
    </button>
  )
}

export function DialogScreen() {
  const { t } = useTranslation()
  const active = useDialogScreenState((x) => x.active)

  return (
    <AnimatedSection id="DialogScreen" condition={active !== null} {...animate({ opacity: true })} className="absolute! z-100 h-full w-full items-center justify-center bg-black/90 p-16 backdrop-blur-lg">
      {active !== null && (
        <>
          <h1 className="mb-2 text-[2rem] uppercase">{t(`${active}Title`)}</h1>
          <p className="text-center">{t(`${active}Text`)}</p>
        </>
      )}
      <div className="mt-8 flex-row! items-center">
        {(() => {
          switch (active) {
            case null:
            default:
              return null
            case 'corruptedUserConfig':
              return (
                <DialogButton
                  onClick={async () => {
                    await window.api.deleteUserConfigAndRestart()
                  }}
                >
                  {t('deleteUserConfigData')}
                </DialogButton>
              )
          }
        })()}
      </div>
    </AnimatedSection>
  )
}
