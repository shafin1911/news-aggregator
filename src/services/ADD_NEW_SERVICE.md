# How to Add a New API Service

This project is designed with a **provider-adapter** pattern to make it easy to integrate new news APIs without modifying the UI. Each API implements a uniform interface and returns standardized article data (`StandardArticle`). Follow the steps below to add a new service:

---

## 1. Create an Adapter

1. **Implement the `NewsProvider` interface**:  
   In `src/services/types.ts`, you'll see:

   ```ts
   export interface NewsProvider {
     fetchNews(query: string): Promise<StandardArticle[]>
   }
   ```

Create a new file for your adapter (e.g., MyNewProviderAdapter.ts) that implements fetchNews. For example:

```ts
// src/services/my_new_api/MyNewProviderAdapter.ts
import { NewsProvider, StandardArticle } from "../types"

export class MyNewProviderAdapter implements NewsProvider {
  async fetchNews(query: string): Promise<StandardArticle[]> {
    // 1) Call your new API with axios or fetch
    // 2) Map the response to StandardArticle
    // 3) Return the mapped articles
    return []
  }
}
```

2. **Map the API Response**:
   Make sure you convert the raw data from your new API to the StandardArticle shape:

```ts
{
  title: string
  description: string
  url: string
  publishedAt: string
  urlToImage: string
  source: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
  author: string
}
```

**• title** → The main article headline or title.
**• description** → A short summary or snippet of the article.
**• url** → The link to the article’s page on the external site.
**• publishedAt** → The publication date/time of the article.
**• urlToImage** → The article’s main image URL (if provided).
**• source** → An object with a unique ID and a human-readable name.
**• category** → An object with an ID and name for the category.
**• author** → The article’s author, or an empty string if unknown.

3. **Handle Caching (Optional)**:
   If your API requests are expensive or rate-limited, you might want to cache results. You can store promises in a Map or use a library like lru-cache. See how fetchGuardianNews or fetchNYTNews uses a caching Map.

## 2. Register the Adapter in the Aggregator

1. **Add the adapter to NewsAggregator.ts**:
   Open src/services/NewsAggregator.ts. Inside the constructor, add a new instance of your adapter:

```ts
import { MyNewProviderAdapter } from "./my_new_api/MyNewProviderAdapter"

export class NewsAggregator {
  private providers: NewsProvider[]

  constructor() {
    this.providers = [
      // existing providers
      new MyNewProviderAdapter(), // ← Add your adapter
    ]
  }

  public async fetchNews(query: string): Promise<StandardArticle[]> {
    const results = await Promise.all(
      this.providers.map((provider) => provider.fetchNews(query))
    )
    return results.flat()
  }
}
```

2. **Verify the Data Flow**:
   • When fetchNews(query) is called from the UI or from inside the code, it will now also call your new provider.
   • Your provider will fetch data from the new API, map it to StandardArticle, and return it.

## 3. Integrate Source and Category Options (Optional)

This step is optional if your new API offers a category or source list you want to show in the Filter or Preferences. If you have an API for that:

1. **Create a module for options (e.g., my_new_api/options.ts)**:

```ts
import { SourceOption, CategoryOption } from "../types"

export const getMyNewApiSources = async (): Promise<SourceOption[]> => {
  // Query your API for sources and map them into SourceOption:
  // { id: string; name: string; category: string }
  return []
}

export const getMyNewApiCategories = async (): Promise<CategoryOption[]> => {
  // Query your API for categories and map them into CategoryOption:
  // { id: string; display: string }
  return []
}
```

2. **Add them to OptionsAggregator.ts**:

```ts
import { getMyNewApiSources, getMyNewApiCategories } from "./my_new_api/options"

export const aggregateOptions = async () => {
  // existing aggregator logic ...
  const myNewSources = await getMyNewApiSources()
  const myNewCategories = await getMyNewApiCategories()

  // Merge them with other sources & categories
}
```

3. **Enjoy Automatic Filtering**:
   The UI’s FilterPanel and PreferencesDialog uses aggregated sources/categories from the aggregator. By merging your new API’s sources and categories, the UI can show them automatically.

## 4. Test & Validate

1. **Test Locally**:
   • Run the dev server (npm run dev or yarn dev).
   • Check if your new API’s articles appear in the feed when searching.
   • Confirm that categories/sources from your new API show up in filters or preferences (if integrated).
2. **Test in Docker**:
   • Run docker build -t news-aggregator .
   • Run docker run -it -p 5173:5173 news-aggregator
   • Access http://localhost:5173 and confirm everything works as expected.
3. **Production Build**:
   • Run npm run build && npm run preview (or the Docker steps again).
   • Validate the new API is included in the final build.

## 5. Summary

Adding a new API to this News Aggregator primarily involves:

1. Creating an adapter class implementing NewsProvider.
2. Registering it in the NewsAggregator constructor.
3. (Optionally) hooking into the OptionsAggregator if you want the new API’s sources/categories to appear in user filters.

This architecture keeps the UI decoupled from individual API details, making the system scalable and maintainable.
