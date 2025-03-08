// src/services/newsapi/NewsApiProviderAdapter.ts
import { NewsProvider, StandardArticle } from "../types"
import { fetchNews, fetchSources } from "./NewsApiProvider"

export class NewsApiProviderAdapter implements NewsProvider {
  private sourceMapping: Record<string, string> = {}

  constructor() {
    this.initializeMapping()
  }

  // Initialize the mapping from source ID to category.
  private async initializeMapping(): Promise<void> {
    try {
      const sources = await fetchSources()
      sources.forEach((source: { id: string; category: string }) => {
        // Store both the source id and category in lowercase.
        this.sourceMapping[source.id.toLowerCase()] = source.category
          ? source.category.toLowerCase()
          : ""
      })
    } catch (error) {
      console.error("Error loading source mapping:", error)
    }
  }

  async fetchNews(query: string): Promise<StandardArticle[]> {
    // Ensure the mapping is loaded.
    if (Object.keys(this.sourceMapping).length === 0) {
      await this.initializeMapping()
    }
    // Fetch articles using your existing fetchNews function.
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
          source: article.source, // assumed to have { id, name }
          category: this.sourceMapping[sourceId] || "", // get category from mapping
          author: article.author || "",
        }
      }
    )
    return mappedArticles
  }
}
