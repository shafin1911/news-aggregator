// src/services/guardian/options.ts
import { SourceOption, CategoryOption } from "../types"
import { NYT_CATEGORIES, NYT_SOURCES } from "./nyt_options_data"

export const getNytSources = (): SourceOption[] => {
  return NYT_SOURCES
}

export const getNytCategories = (): CategoryOption[] => {
  return NYT_CATEGORIES
}
