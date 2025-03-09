// src/services/guardianApi.ts
import axios from "axios"
import { GUARDIAN_MOCK } from "./guardian_mock"
import { GUARDIAN_SECTION_MOCK } from "./guardian_section_mock"
import { StandardArticle } from "../types"

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

const cachedGuardianNews: Map<string, Promise<StandardArticle[]>> = new Map()

/**
 * Fetch Guardian news using the provided query.
 * The API call includes tags for contributors and fields for headline, thumbnail, short-url, and trailText.
 */
export const fetchGuardianNews = async (
  params: { q?: string } = {}
): Promise<StandardArticle[]> => {
  const queryKey = params.q || "" // use empty string for default
  if (cachedGuardianNews.has(queryKey)) {
    return cachedGuardianNews.get(queryKey)!
  }

  const promise = axios
    .get(`${GUARDIAN_BASE_URL}/search`, {
      params: {
        q: params.q,
        format: "json",
        "show-tags": "contributor",
        "show-fields": "headline,thumbnail,short-url,trailText",
        "use-date": "published",
        "order-by": "relevance",
        "page-size": 50,
        "api-key": GUARDIAN_API_KEY,
      },
    })
    .then((response) => {
      const results: GuardianArticle[] = response.data.response.results
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
          ? { id: article.sectionName.toLowerCase(), name: article.sectionName }
          : { id: "", name: "" }
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
    })
    .catch((error) => {
      console.error("Error fetching Guardian news:", error)
      // Remove the cached promise if there's an error, so future calls can retry.
      cachedGuardianNews.delete(queryKey)
      return []
    })

  cachedGuardianNews.set(queryKey, promise)
  return promise
}

export type GuardianSection = {
  id: string
  webTitle: string
}

let cachedSectionsPromise: Promise<GuardianSection[]> | null = null

export const fetchGuardianSections = async (): Promise<GuardianSection[]> => {
  if (cachedSectionsPromise) return cachedSectionsPromise
  cachedSectionsPromise = axios
    .get(`${GUARDIAN_BASE_URL}/sections`, {
      params: { "api-key": GUARDIAN_API_KEY },
    })
    .then((response) => {
      return response.data.response.results
    })
    .catch((error) => {
      console.error("Error fetching Guardian sections:", error)
      // Reset the cache so that subsequent calls can try again.
      cachedSectionsPromise = null
      return []
    })
  return cachedSectionsPromise
}
