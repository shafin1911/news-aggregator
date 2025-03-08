import axios from "axios"
import { SOURCES_MOCK } from "./sources_mock"
import { NEWS_MOCK } from "./news_mock"

const API_KEY = "test" // Replace with your actual API key
const BASE_URL = "https://newsapi.org/v2"
const endpoint = "/everything"

type FilterOptions = {
  query?: string
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
    const params: { q?: string; apiKey?: string } = {
      apiKey: API_KEY,
    }

    if (filters.query) {
      params.q = filters.query
    }

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
