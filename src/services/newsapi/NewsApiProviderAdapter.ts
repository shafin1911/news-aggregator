import { NewsProvider, StandardArticle } from "../types"
import { fetchNews, fetchSources, NewsApiSourceOption } from "./NewsApiProvider"

export class NewsApiProviderAdapter implements NewsProvider {
  private sourceMapping: Record<string, string> = {}

  /**
   * Construct a new NewsApiProviderAdapter instance.
   *
   * This constructor initializes the mapping of source IDs to categories.
   */
  constructor() {
    this.initializeMapping()
  }

  // Initialize the mapping from source ID to category.
  // News API doesn't have a category API, so we have to map it ourselves.
  private async initializeMapping(): Promise<void> {
    try {
      const sources = await fetchSources()
      sources.forEach((source: NewsApiSourceOption) => {
        // Store both the source id and category in lowercase.
        this.sourceMapping[source?.id?.toLowerCase()] = source.category
          ? source.category.toLowerCase()
          : ""
      })
    } catch (error) {
      console.error("Error loading source mapping:", error)
    }
  }

  /**
   * Fetch news articles from the News API using the provided query.
   * This adapter fetches articles from the News API, and maps each article to a StandardArticle.
   * It uses the source mapping to determine the category for each article.
   * @param {string} query - The query to search for articles.
   * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
   */
  async fetchNews(query: string): Promise<StandardArticle[]> {
    // Ensure the mapping is loaded.
    if (Object.keys(this.sourceMapping).length === 0) {
      await this.initializeMapping()
    }
    const rawArticles = await fetchNews({ query })

    // Map each article to a StandardArticle, using the sourceMapping for category.
    const mappedArticles: StandardArticle[] = rawArticles.map(
      (article: {
        title: string
        description: string
        url: string
        publishedAt: Date
        urlToImage: string
        source: { id: string; name: string }
        author: string
      }) => {
        const sourceId = article.source?.id?.toLowerCase() || ""

        return {
          title: article.title,
          description: article.description,
          url: article.url,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage,
          source: article.source,
          category: {
            id: this.sourceMapping[sourceId] || "",
            name: this.sourceMapping[sourceId] || "",
          },
          author: article.author || "",
        }
      }
    )
    return mappedArticles
  }
}
