import axios from "axios"

// NewsAPI settings
const API_KEY = import.meta.env.VITE_NEWSAPI_KEY
const BASE_URL = "https://newsapi.org/v2"

export type FilterOptions = {
  query?: string
}

type NewsApiData = {
  title: string
  description: string
  url: string
  publishedAt: string
  urlToImage: string
  source: { id: string; name: string }
  author: string
}

// Cache for news promises, keyed by query.
// This is used to reduce API requests
const cachedNewsPromises: Map<string, Promise<NewsApiData[]>> = new Map()

/**
 * Fetch news articles from the NewsAPI.
 * @param {FilterOptions} [filters] - Optional filters to apply.
 * @returns {Promise<NewsApiData[]>} A promise resolving to an array of news articles.
 */
export const fetchNews = async (filters: FilterOptions = {}) => {
  const queryKey = filters.query || ""

  if (cachedNewsPromises.has(queryKey)) {
    return cachedNewsPromises.get(queryKey)!
  }

  const params: { q?: string; apiKey?: string } = {
    apiKey: API_KEY,
  }

  if (filters.query) {
    params.q = filters.query
  } else {
    // NewsAPI doesn't like empty queries at
    // https://newsapi.org/docs/endpoints/everything
    // so we just return an empty array
    return []
  }

  const promise = axios
    .get(`${BASE_URL}/everything`, { params })
    .then((response) => response.data.articles)
    .catch((error) => {
      console.error("Error fetching news:", error)
      // Remove from cache so future calls can try again.
      cachedNewsPromises.delete(queryKey)
      return []
    })

  // Cache the promise
  cachedNewsPromises.set(queryKey, promise)

  return promise
}

export type NewsApiSourceOption = { id: string; category: string; name: string }

// Cache for sources promises.
// This is used to reduce API requests
let cachedSourcesPromise: Promise<NewsApiSourceOption[]> | null = null

/**
 * Fetch the list of sources from the News API.
 * @returns {Promise<NewsApiSourceOption[]>} A promise resolving to an array of source objects.
 */
export const fetchSources = async () => {
  if (cachedSourcesPromise) return cachedSourcesPromise

  cachedSourcesPromise = axios
    .get(`${BASE_URL}/sources`, {
      params: { apiKey: API_KEY },
    })
    .then((response) => response.data.sources)
    .catch((error) => {
      console.error("Error fetching sources:", error)
      // Reset cache on error so future calls can retry.
      cachedSourcesPromise = null
      return []
    })
  return cachedSourcesPromise
}
