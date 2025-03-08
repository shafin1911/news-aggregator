import { NewsProvider, StandardArticle } from "./types"
import { NewsApiProviderAdapter } from "./newsapi/NewsApiProviderAdapter"
import { GuardianProviderAdapter } from "./guardian/GuardianProviderAdapter"
import { NytProviderAdapter } from "./new_york_times/NytProviderAdapter"

export class NewsAggregator {
  private providers: NewsProvider[]

  constructor() {
    this.providers = [
      new NewsApiProviderAdapter(),
      new GuardianProviderAdapter(),
      new NytProviderAdapter(),
    ]
  }

  public async fetchNews(query: string): Promise<StandardArticle[]> {
    const results = await Promise.all(
      this.providers.map((provider) => provider.fetchNews(query))
    )
    return results.flat()
  }
}
