import { create } from 'zustand'

export type CursorVariant = 'default' | 'button' | 'text'

interface CursorStore {
  variant: CursorVariant
  setVariant: (variant: CursorVariant) => void
}

export const useCursorStore = create<CursorStore>((set) => ({
  variant: 'default',
  setVariant: (variant) => set({ variant }),
}))
