// src/services/types.ts

/**
 * A unified article structure for the UI.
 */
export type StandardArticle = {
  title: string
  description: string
  url: string
  publishedAt: string
  urlToImage: string
  source: { id: string; name: string }
  category: string
  author: string
}

/**
 * An interface that all news providers (adapters) must implement.
 */
export interface NewsProvider {
  fetchNews(query: string): Promise<StandardArticle[]>
}

/**
 * A type representing a news source option.
 */
export type SourceOption = {
  id: string // stored in lowercase
  name: string
  category: string // stored in lowercase; may be empty (e.g. for Guardian)
}

/**
 * A type representing a category option.
 */
export type CategoryOption = {
  id: string // stored in lowercase
  display: string // display in sentence case (or as provided by the API)
}

/**
 * Filter options for the news feed.
 * - fromDate / toDate: should be in "YYYY-MM-DD" format.
 * - category: a lowercase string representing the category.
 * - source: the id (in lowercase) of the news source.
 */
export type FilterOptions = {
  fromDate: string
  toDate: string
  category: string
  source: string
}

/**
 * User preferences for a personalized news feed.
 * - sources: an array of source IDs (in lowercase).
 * - categories: an array of category IDs (in lowercase).
 * - authors: an array of author names.
 */
export type UserPreferences = {
  sources: string[]
  categories: string[]
  authors: string[]
}
