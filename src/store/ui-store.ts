import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  themeMode: "light" | "dark"
  setThemeMode: (themeMode: "light" | "dark") => void
}

/**
 * A Zustand store for managing UI state.
 * It uses the `zustand/persist` middleware to persist the 'themeMode' field.
 */
export const useUIStore = create<
  UIState,
  [["zustand/persist", Partial<Pick<UIState, "themeMode">>]]
>(
  persist(
    (set) => ({
      themeMode: "light",
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: "news-aggregator-store", // key in localStorage
      partialize: (state) => ({ themeMode: state.themeMode }), // persist only preferences
    }
  )
)
