import { create } from 'zustand'

export type Section =
  | 'home'
  | 'profile'
  | 'capabilities'
  | 'method'
  | 'personnel'
  | 'work'
  | 'insights'

interface NavigateStore {
  section: Section | null
  isNavigating: boolean
  setSection: (section: Section) => void
  clearSection: () => void
}

export const useNavigateStore = create<NavigateStore>((set) => ({
  section: null,
  isNavigating: false,
  setSection: (section) => set({ section, isNavigating: true }),
  clearSection: () => set({ section: null, isNavigating: false }),
}))
