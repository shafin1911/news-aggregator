// src/services/guardianApi.ts
import axios from "axios"
import { GUARDIAN_MOCK } from "./guardian_mock"
import { GUARDIAN_SECTION_MOCK } from "./guardian_section_mock"

// Guardian API settings.
const GUARDIAN_API_KEY = "test" // Replace with your key if needed.
const GUARDIAN_BASE_URL = "https://content.guardianapis.com"

// Define the shape of a Guardian article as returned by the API.
export type GuardianArticle = {
  id: string
  webPublicationDate: string
  webTitle: string
  webUrl: string
  apiUrl: string
  fields: {
    headline?: string
    trailText?: string
    "short-url"?: string
    thumbnail?: string
  }
  sectionName: string
  tags: Array<{
    id: string
    type: string
    webTitle: string
    webUrl: string
  }>
}

// Define your standard article structure expected by the UI.
export type StandardArticle = {
  title: string
  description: string
  url: string
  publishedAt: string
  urlToImage: string
  source: {
    id: string
    name: string
  }
  // We'll include a 'category' field which the UI uses for filtering.
  category: string
  // For authors, we'll store a comma-separated string.
  author: string
}

/**
 * Fetch Guardian news using the provided query.
 * The API call includes tags for contributors and fields for headline, thumbnail, short-url, and trailText.
 */
export const fetchGuardianNews = async (
  params: { q?: string } = {}
): Promise<StandardArticle[]> => {
  try {
    // const response = await axios.get(`${GUARDIAN_BASE_URL}/search`, {
    //   params: {
    //     q: params.q,
    //     format: "json",
    //     "show-tags": "contributor",
    //     "show-fields": "headline,thumbnail,short-url,trailText",
    //     "use-date": "published",
    //     "order-by": "relevance",
    //     "page-size": 50,
    //     "api-key": GUARDIAN_API_KEY,
    //   },
    // })
    const response = { data: GUARDIAN_MOCK }
    // The Guardian response wraps the results in response.results.
    const results: GuardianArticle[] = response.data.response.results

    // Map each Guardian article into a standard format.
    // In guardianApi.ts, inside fetchGuardianNews mapping:
    const mappedArticles: StandardArticle[] = results.map((article) => {
      const fields = article.fields || {}
      const title = fields.headline || article.webTitle
      const description = fields.trailText || ""
      const url = fields["short-url"] || article.webUrl
      const urlToImage = fields.thumbnail || ""
      const publishedAt = article.webPublicationDate
      const contributors = article.tags
        .filter((tag) => tag.type === "contributor")
        .map((tag) => tag.webTitle)
      const author = contributors.join(", ")
      const source = { id: "guardian", name: "The Guardian" }
      // Use sectionName (converted to lowercase) as category.
      const category = article.sectionName
        ? article.sectionName.toLowerCase()
        : ""
      return {
        title,
        description,
        url,
        publishedAt,
        urlToImage,
        source,
        category,
        author,
      }
    })
    return mappedArticles
  } catch (error) {
    console.error("Error fetching Guardian news:", error)
    return []
  }
}

export type GuardianSection = {
  id: string
  webTitle: string
}

export const fetchGuardianSections = async (): Promise<GuardianSection[]> => {
  return GUARDIAN_SECTION_MOCK.response.results
  try {
    const response = await axios.get(`${GUARDIAN_BASE_URL}/sections`, {
      params: { "api-key": GUARDIAN_API_KEY },
    })
    return response.data.response.results
  } catch (error) {
    console.error("Error fetching Guardian sections:", error)
    return []
  }
}
