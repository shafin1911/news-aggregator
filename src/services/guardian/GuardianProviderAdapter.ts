import { NewsProvider, StandardArticle } from "./../types"
import { fetchGuardianNews } from "./GuardianProvider"

export class GuardianProviderAdapter implements NewsProvider {
  /**
   * Fetch news articles from the Guardian API using the provided query.
   * @param {string} query - The query to search for articles.
   * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
   */
  async fetchNews(query: string): Promise<StandardArticle[]> {
    return fetchGuardianNews({ q: query })
  }
}
