import { useMemo } from "react"
import { StandardArticle } from "../services/types"

export type SourceOption = {
  id: string
  name: string
}

export type CategoryOption = {
  id: string
  display: string
}

/**
 * A hook to derive unique source and category options from the provided articles.
 *
 * This hook processes a list of articles to extract unique sources and categories,
 * ensuring that each is listed only once. The sources are sorted alphabetically
 * by their name, and categories are sorted by their display name, which is derived
 * by capitalizing the first letter of each category.
 *
 * @param articles - An array of StandardArticle objects from which to derive options.
 * @returns An object containing `availableSources` and `availableCategories`,
 *          both sorted arrays of unique options.
 */
export const useDerivedFilterOptions = (articles: StandardArticle[]) => {
  return useMemo(() => {
    const sourceMap = new Map<string, SourceOption>()
    const categorySet = new Set<string>()

    articles.forEach((article) => {
      if (article.source) {
        const id = article.source?.id?.toLowerCase()
        if (!sourceMap.has(id)) {
          sourceMap.set(id, { id, name: article.source.name })
        }
      }
      if (article.category) {
        categorySet.add(article.category.id.toLowerCase())
      }
    })

    const availableSources = Array.from(sourceMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    const availableCategories = Array.from(categorySet)
      .map((cat) => ({
        id: cat,
        display: cat.charAt(0).toUpperCase() + cat.slice(1),
      }))
      .sort((a, b) => a.display.localeCompare(b.display))

    return { availableSources, availableCategories }
  }, [articles])
}
