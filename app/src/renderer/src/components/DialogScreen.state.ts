import type { DialogScreenPromptsTypes } from 'rockshelf-core'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface DialogScreenStateProps {
  deletePackageIndex: number
  active: DialogScreenPromptsTypes | null
  isLoadingAction: boolean
}

export interface DialogScreenStateActions {
  /**
   * Sets new values to the state.
   * - - - -
   * @param {Partial<DialogScreenStateProps> | ((oldState: DialogScreenStateProps) => Partial<DialogScreenStateProps>)} state The new state values or a function that receives the old state and returns the new state values.
   */
  setDialogScreenState(state: Partial<DialogScreenStateProps> | ((oldState: DialogScreenStateProps) => Partial<DialogScreenStateProps>)): void
  /**
   * Retrieves the values of the entire state, excluding its own functions.
   * - - - -
   * @returns {DialogScreenStateProps}
   */
  getDialogScreenState(): DialogScreenStateProps
  /**
   * Resets the state to its default values.
   */
  resetDialogScreenState(): void
}

export type DialogScreenStateHook = DialogScreenStateProps & DialogScreenStateActions

const defaultState: DialogScreenStateProps = {
  deletePackageIndex: -1,
  active: null,
  isLoadingAction: false,
}

export const useDialogScreenState = create<DialogScreenStateHook>()(
  immer((set, get) => ({
    ...defaultState,
    setDialogScreenState(state) {
      if (typeof state === 'function') return set((s) => state(s))
      return set(() => state)
    },
    getDialogScreenState() {
      const state = get()
      const map = new Map<keyof DialogScreenStateProps, unknown>()
      for (const key of Object.keys(state)) {
        if (typeof state[key] === 'function') continue
        else map.set(key as keyof DialogScreenStateProps, state[key])
      }

      return Object.fromEntries(map.entries()) as Record<keyof DialogScreenStateProps, unknown> as DialogScreenStateProps
    },
    resetDialogScreenState() {
      return set(() => defaultState)
    },
  }))
)
