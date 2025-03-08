import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  StandardArticle,
  FilterOptions,
  UserPreferences,
} from "../services/types"

interface AppState {
  allArticles: StandardArticle[]
  articles: StandardArticle[]
  filterOptions: FilterOptions
  preferences: UserPreferences
  setAllArticles: (articles: StandardArticle[]) => void
  setArticles: (articles: StandardArticle[]) => void
  setFilterOptions: (filters: FilterOptions) => void
  setPreferences: (prefs: UserPreferences) => void
}

export const useAppStore = create<
  AppState,
  [["zustand/persist", Partial<Pick<AppState, "preferences">>]]
>(
  persist(
    (set) => ({
      allArticles: [],
      articles: [],
      filterOptions: { fromDate: "", toDate: "", category: "", source: "" },
      preferences: { sources: [], categories: [], authors: [] },
      setAllArticles: (articles) => set({ allArticles: articles }),
      setArticles: (articles) => set({ articles }),
      setFilterOptions: (filters) => set({ filterOptions: filters }),
      setPreferences: (prefs) => set({ preferences: prefs }),
    }),
    {
      name: "news-aggregator-store", // key in localStorage
      partialize: (state) => ({ preferences: state.preferences }), // persist only preferences
    }
  )
)
