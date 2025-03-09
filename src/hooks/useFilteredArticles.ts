// src/hooks/useFilteredArticles.ts
import { useMemo } from "react"
import {
  StandardArticle,
  FilterOptions,
  UserPreferences,
} from "../services/types"

// Helper: Format a Date in local time as "YYYY-MM-DD"
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

// Define a set of predicate functions for each filter criterion.
const createDatePredicate =
  (filterOptions: FilterOptions) =>
  (article: StandardArticle): boolean => {
    if (filterOptions.fromDate) {
      const artDay = formatLocalDate(new Date(article.publishedAt))
      if (artDay < filterOptions.fromDate) return false
    }
    if (filterOptions.toDate) {
      const artDay = formatLocalDate(new Date(article.publishedAt))
      if (artDay > filterOptions.toDate) return false
    }
    return true
  }

const createCategoryPredicate =
  (filterOptions: FilterOptions) =>
  (article: StandardArticle): boolean => {
    if (filterOptions.category) {
      return article.category?.id?.toLowerCase() === filterOptions.category
    }
    return true
  }

const createSourcePredicate =
  (filterOptions: FilterOptions) =>
  (article: StandardArticle): boolean => {
    if (filterOptions.source) {
      return article.source && article.source.id === filterOptions.source
    }
    return true
  }

const createPreferredSourcesPredicate =
  (preferences: UserPreferences) =>
  (article: StandardArticle): boolean => {
    if (preferences.sources.length > 0) {
      return article.source
        ? preferences.sources.includes(article.source.id)
        : false
    }
    return true
  }

const createPreferredCategoriesPredicate =
  (preferences: UserPreferences) =>
  (article: StandardArticle): boolean => {
    if (preferences.categories.length > 0) {
      return (
        article.category?.id?.toLowerCase() !== "" &&
        preferences.categories.includes(
          (article.category?.id || "").toLowerCase()
        )
      )
    }
    return true
  }

const createPreferredAuthorsPredicate =
  (preferences: UserPreferences) =>
  (article: StandardArticle): boolean => {
    if (preferences.authors.length > 0) {
      if (!article.author) return false
      const artAuthor = article.author.toLowerCase()
      return preferences.authors.some((pref) =>
        artAuthor.includes(pref.toLowerCase())
      )
    }
    return true
  }

/**
 * Custom hook to filter articles based on filter options and user preferences.
 */
export const useFilteredArticles = (
  allArticles: StandardArticle[],
  filterOptions: FilterOptions,
  preferences: UserPreferences
): StandardArticle[] => {
  return useMemo(() => {
    // Create an array of predicate functions.
    const predicates = [
      createDatePredicate(filterOptions),
      createCategoryPredicate(filterOptions),
      createSourcePredicate(filterOptions),
      createPreferredSourcesPredicate(preferences),
      createPreferredCategoriesPredicate(preferences),
      createPreferredAuthorsPredicate(preferences),
    ]

    return allArticles.filter((article) =>
      predicates.every((predicate) => predicate(article))
    )
  }, [allArticles, filterOptions, preferences])
}
