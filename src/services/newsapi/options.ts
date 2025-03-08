// src/services/newsapi/options.ts
import { fetchSources } from "./NewsApiProvider"
import { SourceOption, CategoryOption } from "../types" // Define these types in your shared types file

export const getNewsApiSources = async (): Promise<SourceOption[]> => {
  const sources = await fetchSources()
  const mappedSources: SourceOption[] = sources.map(
    (s: { id: string; name: string; category: string }) => ({
      id: s.id.toLowerCase(),
      name: s.name,
      category: s.category ? s.category.toLowerCase() : "",
    })
  )
  return mappedSources
}

export const getNewsApiCategories = async (
  sources: SourceOption[]
): Promise<CategoryOption[]> => {
  const newsapiSet = new Set<string>()
  sources.forEach((src) => {
    if (src.category) newsapiSet.add(src.category)
  })
  const newsapiCategories: CategoryOption[] = Array.from(newsapiSet).map(
    (cat) => ({
      id: cat, // keep as is (already lowercase)
      display: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
    })
  )
  return newsapiCategories
}
