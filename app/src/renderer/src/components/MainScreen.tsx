import { AnimatedSection } from '@renderer/lib.exports'
import { useMainScreenState } from './MainScreen.state'
import { useWindowState } from '@renderer/stores/Window.state'
import clsx from 'clsx'

export function MainScreen() {
  const active = useMainScreenState((x) => x.active)
  const rb3Stats = useWindowState((x) => x.rb3Stats)
  return (
    <AnimatedSection id="MainScreen" condition={active} className="h-full max-h-full w-full max-w-full overflow-y-hidden p-8">
      {typeof rb3Stats === 'object' && (
        <div className="h-full max-h-full w-full max-w-full overflow-y-auto">
          <p>{JSON.stringify(rb3Stats, null, 4)}</p>
          <img src={`rbicons://${rb3Stats.updateType !== 'dx' ? 'rb3' : 'dx'}`} className={clsx(!rb3Stats.hasGameInstalled && 'grayscale')} width={192} />
        </div>
      )}
    </AnimatedSection>
  )
}
