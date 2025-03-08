// src/services/GuardianProviderAdapter.ts
import { NewsProvider, StandardArticle } from "./../types"
import { fetchGuardianNews } from "./GuardianProvider"

export class GuardianProviderAdapter implements NewsProvider {
  async fetchNews(query: string): Promise<StandardArticle[]> {
    // Call your existing fetchGuardianNews function with the query.
    return fetchGuardianNews({ q: query })
  }
}
