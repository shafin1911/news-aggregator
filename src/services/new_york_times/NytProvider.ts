import axios from "axios"
import { NYT_MOCK } from "./nyt_mock"
import { StandardArticle } from "../types"

// Guardian API settings.
const NYT_API_KEY = "test" // Replace with your key if needed.
const NYT_BASE_URL = "https://api.nytimes.com/svc/search/v2"
//articlesearch.json

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

/**
 * Fetch NYT news using the provided query.
 * The API call includes headline, lead_paragraph, web_url, pub_date, multimedia, section_name, source, and byline.
 */
export const fetchNYTNews = async (
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
    const response = { ...NYT_MOCK }
    // The NYT response wraps the results in response.docs.
    const results: NytArticle[] = response.response.docs

    // Map each The article into a standard format.
    const mappedArticles: StandardArticle[] = results.map((article) => {
      const title = article.headline.main || ""
      const description = article.lead_paragraph || ""
      const url = article.web_url || ""
      const fields = article.multimedia[0]
      const urlToImage = fields.url
        ? `https://static01.nyt.com/${fields.url}`
        : ""
      const publishedAt = article.pub_date || ""
      const contributors = article.byline.person
        .map((p) => `${p.firstname} ${p.lastname}`)
        .join(", ")
      const author = contributors || article.byline.original
      const source = { id: article.source?.toLowerCase(), name: article.source }
      // Use sectionName (converted to lowercase) as category.
      const category = article.section_name
        ? article.section_name.toLowerCase()
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
