import { create } from 'zustand'

export interface MainScreenStateProps {
  active: boolean
}

export interface MainScreenStateActions {
  /**
   * Sets new values to the state.
   * - - - -
   * @param {Partial<MainScreenStateProps> | ((oldState: MainScreenStateProps) => Partial<MainScreenStateProps>)} state The new state values or a function that receives the old state and returns the new state values.
   */
  setMainScreenState(state: Partial<MainScreenStateProps> | ((oldState: MainScreenStateProps) => Partial<MainScreenStateProps>)): void
  /**
   * Retrieves the values of the entire state, excluding its own functions.
   * - - - -
   * @returns {MainScreenStateProps}
   */
  getMainScreenState(): MainScreenStateProps
  /**
   * Resets the state to its default values.
   */
  resetMainScreenState(): void
}

export type MainScreenStateHook = MainScreenStateProps & MainScreenStateActions

const defaultState: MainScreenStateProps = {
  active: true,
}

export const useMainScreenState = create<MainScreenStateHook>()((set, get) => ({
  ...defaultState,
  setMainScreenState(state) {
    if (typeof state === 'function') return set((s) => state(s))
    return set(() => state)
  },
  getMainScreenState() {
    const state = get()
    const map = new Map<keyof MainScreenStateProps, unknown>()
    for (const key of Object.keys(state)) {
      if (typeof state[key] === 'function') continue
      else map.set(key as keyof MainScreenStateProps, state[key])
    }

    return Object.fromEntries(map.entries()) as Record<keyof MainScreenStateProps, unknown> as MainScreenStateProps
  },
  resetMainScreenState() {
    return set(() => defaultState)
  },
}))
