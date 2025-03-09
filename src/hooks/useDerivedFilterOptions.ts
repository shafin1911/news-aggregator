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

export const useDerivedFilterOptions = (articles: StandardArticle[]) => {
  return useMemo(() => {
    const sourceMap = new Map<string, SourceOption>()
    const categorySet = new Set<string>()

    articles.forEach((article) => {
      if (article.source) {
        const id = article.source.id.toLowerCase()
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
