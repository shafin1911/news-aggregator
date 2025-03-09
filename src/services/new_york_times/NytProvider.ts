import axios from "axios"
import { StandardArticle } from "../types"

// New York Times API settings.
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY
const NYT_BASE_URL = "https://api.nytimes.com/svc/search/v2"

// Define the shape of a NYT article as returned by the API.
export type NytArticle = {
  headline: {
    main: string // title
  }
  lead_paragraph: string // description
  web_url: string // url
  pub_date: string // publishedAt
  multimedia: Array<{
    url: string // urlToImage
  }>
  section_name: string // category
  source: string // source
  byline: {
    original: string // author
    person: Array<{
      firstname: string
      lastname: string
    }>
  }
}

// Cache for NYT news promises, keyed by query.
// This is used to reduce API requests
const cachedNYTNewsPromises: Map<string, Promise<StandardArticle[]>> = new Map()

/**
 * Fetch news articles from the New York Times API using the provided query.
 * The API call includes parameters for headline, lead_paragraph, web_url, pub_date, and multimedia.
 * The promise resolves to an array of StandardArticle objects.
 * @param {Object} params - Optional parameters to pass to the API, currently only "q" is supported.
 * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
 */
export const fetchNYTNews = async (
  params: { q?: string } = {}
): Promise<StandardArticle[]> => {
  const queryKey = params.q || ""

  if (cachedNYTNewsPromises.has(queryKey)) {
    return cachedNYTNewsPromises.get(queryKey)!
  }

  const promise = axios
    .get(`${NYT_BASE_URL}/articlesearch.json`, {
      params: {
        q: params.q,
        "api-key": NYT_API_KEY,
      },
    })
    .then((response) => {
      const results: NytArticle[] = response.data.response.docs
      const mappedArticles: StandardArticle[] = results.map((article) => {
        const title = article.headline.main || ""
        const description = article.lead_paragraph || ""
        const url = article.web_url || ""
        const fields = article.multimedia?.[0]
        const urlToImage = fields?.url
          ? `https://static01.nyt.com/${fields.url}`
          : ""
        const publishedAt = article.pub_date || ""
        const contributors =
          article.byline?.person
            ?.map((p) => `${p.firstname} ${p.lastname}`)
            .join(", ") || ""
        const author = contributors || article.byline?.original || ""
        const source = {
          id: (article.source || "").toLowerCase(),
          name: article.source,
        }
        const category = article.section_name
          ? {
              id: article.section_name.toLowerCase(),
              name: article.section_name,
            }
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
      console.error("Error fetching NYT news:", error)
      // Remove cached promise so future calls can try again.
      cachedNYTNewsPromises.delete(queryKey)
      return []
    })

  // Store the promise in the cache
  cachedNYTNewsPromises.set(queryKey, promise)

  return promise
}
