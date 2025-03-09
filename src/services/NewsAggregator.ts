import { NewsProvider, StandardArticle } from "./types"
import { NewsApiProviderAdapter } from "./newsapi/NewsApiProviderAdapter"
import { GuardianProviderAdapter } from "./guardian/GuardianProviderAdapter"
import { NytProviderAdapter } from "./new_york_times/NytProviderAdapter"

export class NewsAggregator {
  private providers: NewsProvider[]

  /**
   * Construct a new NewsAggregator instance.
   *
   * This constructor adds the available news providers to the
   * `this.providers` array.
   */
  constructor() {
    this.providers = [
      new NewsApiProviderAdapter(),
      new GuardianProviderAdapter(),
      new NytProviderAdapter(),
    ]
  }

  /**
   * Fetch news articles from all providers using the provided query.
   * @param {string} query - The query to search for articles.
   * @returns {Promise<StandardArticle[]>} A promise resolving to an array of StandardArticle objects.
   */
  public async fetchNews(query: string): Promise<StandardArticle[]> {
    const results = await Promise.all(
      this.providers.map((provider) => provider.fetchNews(query))
    )
    return results.flat()
  }
}
