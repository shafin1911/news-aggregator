import { useMemo } from "react"
import {
  StandardArticle,
  FilterOptions,
  UserPreferences,
} from "../services/types"
import { formatLocalDate } from "../utils/helper"

/**
 * A predicate function to filter articles based on the `fromDate` and
 * `toDate` filter options.
 *
 * It returns `true` if the article's published date is after the
 * `fromDate` and before the `toDate`, and `false` otherwise.
 *
 * @param filterOptions - The filter options containing `fromDate` and `toDate`.
 * @returns A predicate function to filter articles.
 */
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

/**
 * A predicate function to filter articles based on the `category` filter option.
 *
 * It returns `true` if the article's category matches the `category` filter
 * option, and `false` otherwise.
 *
 * @param filterOptions - The filter options containing `category`.
 * @returns A predicate function to filter articles.
 */
const createCategoryPredicate =
  (filterOptions: FilterOptions) =>
  (article: StandardArticle): boolean => {
    if (filterOptions.category) {
      return article.category?.id?.toLowerCase() === filterOptions.category
    }
    return true
  }

/**
 * A predicate function to filter articles based on the `source` filter option.
 *
 * It returns `true` if the article's source matches the `source` filter
 * option, and `false` otherwise.
 *
 * @param filterOptions - The filter options containing `source`.
 * @returns A predicate function to filter articles.
 */
const createSourcePredicate =
  (filterOptions: FilterOptions) =>
  (article: StandardArticle): boolean => {
    if (filterOptions.source) {
      return article.source && article.source.id === filterOptions.source
    }
    return true
  }

/**
 * A predicate function to filter articles based on the user's preferred news sources.
 *
 * It returns `true` if the article's source is included in the user's preferred sources,
 * and `false` otherwise.
 *
 * @param preferences - The user's preferences containing an array of preferred sources.
 * @returns A predicate function to filter articles.
 */
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

/**
 * A predicate function to filter articles based on the user's preferred categories.
 *
 * It returns `true` if the article's category is included in the user's preferred categories,
 * and `false` otherwise.
 *
 * @param preferences - The user's preferences containing an array of preferred categories.
 * @returns A predicate function to filter articles.
 */
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

/**
 * A predicate function to filter articles based on the user's preferred authors.
 *
 * It returns `true` if the article's author is included in the user's preferred authors,
 * and `false` otherwise. The comparison is case-insensitive.
 *
 * @param preferences - The user's preferences containing an array of preferred authors.
 * @returns A predicate function to filter articles.
 */
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
 * A hook to filter articles based on user preferences and filter options.
 *
 * This hook takes in an array of articles, filter options, and user preferences,
 * and returns a filtered array of articles that match the filter options and user
 * preferences. It uses an array of predicate functions to filter the articles.
 *
 * The predicate functions are as follows:
 *
 * - `createDatePredicate`: filters articles based on `fromDate` and `toDate`.
 * - `createCategoryPredicate`: filters articles based on `category`.
 * - `createSourcePredicate`: filters articles based on `source`.
 * - `createPreferredSourcesPredicate`: filters articles based on preferred sources.
 * - `createPreferredCategoriesPredicate`: filters articles based on preferred categories.
 * - `createPreferredAuthorsPredicate`: filters articles based on preferred authors.
 *
 * @param {StandardArticle[]} allArticles - The array of articles to filter.
 * @param {FilterOptions} filterOptions - The filter options.
 * @param {UserPreferences} preferences - The user's preferences.
 * @returns {StandardArticle[]} The filtered array of articles.
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
