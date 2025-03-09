import { NewsProvider, StandardArticle } from "./../types"
import { fetchNYTNews } from "./NytProvider"

export class NytProviderAdapter implements NewsProvider {
  /**
   * Fetch news articles from the New York Times API using the provided query.
   * @param {string} query - The query to search for articles.
   * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
   */
  async fetchNews(query: string): Promise<StandardArticle[]> {
    return fetchNYTNews({ q: query })
  }
}
