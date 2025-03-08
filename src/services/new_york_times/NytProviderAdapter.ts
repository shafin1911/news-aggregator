// src/services/GuardianProviderAdapter.ts
import { NewsProvider, StandardArticle } from "./../types"
import { fetchNYTNews } from "./NytProvider"

export class NytProviderAdapter implements NewsProvider {
  async fetchNews(query: string): Promise<StandardArticle[]> {
    // Call your existing fetchGuardianNews function with the query.
    return fetchNYTNews({ q: query })
  }
}
