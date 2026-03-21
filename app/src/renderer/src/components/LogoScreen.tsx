import { animate, AnimatedDiv, AnimatedSection } from '@renderer/lib.exports'
import { useLogoScreenState } from './LogoScreen.state'
import { useTranslation } from 'react-i18next'
import { APP_VERSION } from '@renderer/app/rockshelf'
import { LoadingIcon } from '@renderer/assets/icons'

export function LogoScreen() {
  const { t } = useTranslation()
  const active = useLogoScreenState((x) => x.active)
  const showText = useLogoScreenState((x) => x.showText)
  return (
    <AnimatedSection id="LogoScreen" condition={active} {...animate({ opacityInit: true })} className="absolute! z-2 h-full w-full items-center justify-center bg-neutral-800">
      <h1 className="text-[3rem] uppercase">{t('appTitle')}</h1>
      <AnimatedDiv condition={showText} {...animate({ opacity: true, height: true, scaleY: true })}>
        <div className="h-3"></div>
        <div className="flex-row! items-center">
          <LoadingIcon className="mr-2 animate-spin" />
          <p>{t('loadingRockshelf')}</p>
        </div>
      </AnimatedDiv>
      <p className="absolute! bottom-5">{t('appVersion', { version: APP_VERSION })}</p>
    </AnimatedSection>
  )
}
