import axios from "axios"
import { SOURCES_MOCK } from "./sources_mock"
import { NEWS_MOCK } from "./news_mock"

const API_KEY = "test" // Replace with your actual API key
const BASE_URL = "https://newsapi.org/v2"
const endpoint = "/everything"

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

const cachedNewsPromises: Map<string, Promise<NewsApiData[]>> = new Map()

export const fetchNews = async (filters: FilterOptions = {}) => {
  const queryKey = filters.query || ""
  if (cachedNewsPromises.has(queryKey)) {
    return cachedNewsPromises.get(queryKey)!
  }

  // For example purposes, you could uncomment the next line to use mocks:
  // if (!filters.query) return NEWS_MOCK.articles;

  const params: { q?: string; apiKey?: string } = {
    apiKey: API_KEY,
  }

  if (filters.query) {
    params.q = filters.query
  } else {
    return []
  }

  const promise = axios
    .get(`${BASE_URL}${endpoint}`, { params })
    .then((response) => response.data.articles)
    .catch((error) => {
      console.error("Error fetching news:", error)
      // Remove from cache so future calls can try again.
      cachedNewsPromises.delete(queryKey)
      return []
    })

  cachedNewsPromises.set(queryKey, promise)
  return promise
}

export type NewsApiSourceOption = { id: string; category: string }

// Instead of caching the raw sources, cache the promise.
let cachedSourcesPromise: Promise<NewsApiSourceOption[]> | null = null

export const fetchSources = async () => {
  if (cachedSourcesPromise) return cachedSourcesPromise
  // return SOURCES_MOCK.sources
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
