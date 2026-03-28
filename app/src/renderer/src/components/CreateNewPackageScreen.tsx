import { animate, AnimatedSection } from '@renderer/lib.exports'
import { useCreateNewPackageScreenState } from './CreateNewPackageScreen.state'

export function CreateNewPackageScreen() {
  const active = useCreateNewPackageScreenState((x) => x.active)
  return <AnimatedSection id="CreateNewPackageScreen" condition={active} {...animate({ opacity: true })}></AnimatedSection>
}
