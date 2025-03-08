import axios from "axios"
import { SOURCES_MOCK } from "./sources_mock"
import { NEWS_MOCK } from "./news_mock"

const API_KEY = "test" // Replace with your actual API key

const BASE_URL = "https://newsapi.org/v2"

type FilterOptions = {
  query?: string
  category?: string
  source?: string
  fromDate?: string
  toDate?: string
}

export const fetchNews = async (filters: FilterOptions = {}) => {
  // const response = await axios.get(
  //   `https://content.guardianapis.com/search?q=trump&format=json&show-tags=contributor&show-fields=headline,thumbnail,short-url,trailText&use-date=published&order-by=relevance&api-key=test&page-size=50`,
  //   {}
  // )
  // return response.data.response.results
  return NEWS_MOCK.articles
  try {
    // Default to top-headlines endpoint
    let endpoint = "/everything"
    const params: any = {
      apiKey: API_KEY,
    }

    // If date filters are provided, switch to the /everything endpoint
    // if (filters.fromDate || filters.toDate) {
    // endpoint = "/everything"
    if (filters.query) {
      params.q = filters.query
    }
    if (filters.fromDate) {
      params.from = filters.fromDate
    }
    if (filters.toDate) {
      params.to = filters.toDate
    }
    if (filters.source) {
      params.sources = filters.source
    }
    // Note: The /everything endpoint doesn't support category filtering.
    // } else {
    if (filters.query) {
      params.q = filters.query
    }
    if (filters.category) {
      params.category = filters.category
    }
    if (filters.source) {
      params.sources = filters.source
    }
    // }

    const response = await axios.get(`${BASE_URL}${endpoint}`, { params })
    return response.data.articles
  } catch (error) {
    console.error("Error fetching news:", error)
    return []
  }
}

// New function to fetch sources dynamically
export const fetchSources = async () => {
  return SOURCES_MOCK.sources
  try {
    const response = await axios.get(`${BASE_URL}/sources`, {
      params: { apiKey: API_KEY },
    })
    return response.data.sources
  } catch (error) {
    console.error("Error fetching sources:", error)
    return []
  }
}
