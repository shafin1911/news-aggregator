import axios from "axios"
import { StandardArticle } from "../types"

// Guardian API settings.
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY
const GUARDIAN_BASE_URL = "https://content.guardianapis.com"

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

// Cache for Guardian news promises, keyed by query.
// This is used to reduce API requests
const cachedGuardianNews: Map<string, Promise<StandardArticle[]>> = new Map()

/**
 * Fetch news articles from the Guardian API using the provided query.
 * The API call includes parameters for headline, trailText, short-url, and thumbnail.
 * The promise resolves to an array of StandardArticle objects.
 * @param {Object} params - Optional parameters to pass to the API, currently only "q" is supported.
 * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
 */
export const fetchGuardianNews = async (
  params: { q?: string } = {}
): Promise<StandardArticle[]> => {
  const queryKey = params.q || ""
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

// Cache for Guardian sections promises.
// This is used to reduce API requests
let cachedSectionsPromise: Promise<GuardianSection[]> | null = null

/**
 * Fetches the list of sections from the Guardian API.
 *
 * @returns A promise resolving to an array of GuardianSection objects.
 *          Each object has an id and webTitle property.
 *          The webTitle is the human-readable name of the section.
 *          The id is the lowercase version of webTitle.
 */
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
