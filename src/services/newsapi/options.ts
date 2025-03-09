import { fetchSources } from "./NewsApiProvider"
import { SourceOption, CategoryOption } from "../types"

/**
 * Fetches and maps the list of news sources from the News API.
 *
 * This function retrieves the sources using the `fetchSources` function
 * and maps them into an array of `SourceOption` objects. Each source's ID
 * and category are converted to lowercase to ensure consistent formatting.
 *
 * @returns {Promise<SourceOption[]>} A promise resolving to an array of
 * `SourceOption` objects, each representing a news source with id, name,
 * and category.
 */
export const getNewsApiSources = async (): Promise<SourceOption[]> => {
  const sources = await fetchSources()
  const mappedSources: SourceOption[] = sources.map(
    (s: { id: string; name: string; category: string }) => ({
      id: s.id.toLowerCase(),
      name: s.name,
      category: s.category ? s.category.toLowerCase() : "",
    })
  )
  return mappedSources
}

/**
 * Extracts and formats categories from a list of news sources.
 *
 * This function processes the provided array of `SourceOption` objects,
 * collecting unique categories and formatting them into `CategoryOption` objects.
 * Each category's ID is set to the category string, and the display name is
 * capitalized for presentation purposes.
 *
 * @param {SourceOption[]} sources - An array of `SourceOption` objects from
 * which to extract categories.
 * @returns {Promise<CategoryOption[]>} A promise resolving to an array of
 * `CategoryOption` objects, each with a unique category ID and display name.
 */
export const getNewsApiCategories = async (
  sources: SourceOption[]
): Promise<CategoryOption[]> => {
  const newsapiSet = new Set<string>()

  sources.forEach((src) => {
    if (src.category) newsapiSet.add(src.category)
  })

  const newsapiCategories: CategoryOption[] = Array.from(newsapiSet).map(
    (cat) => ({
      id: cat,
      display: cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase(),
    })
  )

  return newsapiCategories
}
