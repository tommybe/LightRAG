import { create } from 'zustand'
import { createSelectors } from '@/lib/utils'
import { checkHealth } from '@/api/lightrag'

interface BackendState {
  health: boolean
  message: string | null
  messageTitle: string | null

  check: () => Promise<boolean>
  clear: () => void
  setErrorMessage: (message: string, messageTitle: string) => void
}

const useBackendStateStoreBase = create<BackendState>()((set) => ({
  health: true,
  message: null,
  messageTitle: null,

  check: async () => {
    const health = await checkHealth()
    if (health.status === 'healthy') {
      set({ health: true, message: null, messageTitle: null })
      return true
    }
    set({ health: false, message: health.message, messageTitle: 'Backend Health Check Error!' })
    return false
  },

  clear: () => {
    set({ health: true, message: null, messageTitle: null })
  },

  setErrorMessage: (message: string, messageTitle: string) => {
    set({ health: false, message, messageTitle })
  }
}))

const useBackendState = createSelectors(useBackendStateStoreBase)

export { useBackendState }
