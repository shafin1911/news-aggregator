import { SourceOption, CategoryOption } from "./types"
import { getNewsApiSources, getNewsApiCategories } from "./newsapi/options"
import { getGuardianSource, getGuardianCategories } from "./guardian/options"
import { getNytCategories, getNytSources } from "./new_york_times/options"

/**
 * A function to load aggregated options (sources and categories).
 *
 * When called, it will load the aggregated options from the
 * news services (NewsAPI, Guardian, New York Times) and return
 * an object containing the sources and categories.
 *
 * @returns an object containing the sources and categories.
 */
export const aggregateOptions = async (): Promise<{
  sources: SourceOption[]
  categories: CategoryOption[]
}> => {
  // Get sources from news services
  const newsapiSources = await getNewsApiSources()
  const guardianSource = await getGuardianSource()
  const nytSources = getNytSources()

  // Merge sources without duplicates
  const mergedSources = Array.from(
    new Map(
      [...newsapiSources, ...nytSources, guardianSource].map((src) => [
        src.id,
        src,
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  // Get categories from news services
  const newsapiCategories = await getNewsApiCategories(mergedSources)
  const guardianCategories = await getGuardianCategories()
  const nytCategories = getNytCategories()

  // Merge categories without duplicates
  const mergedCategories = Array.from(
    new Map(
      [...newsapiCategories, ...guardianCategories, ...nytCategories].map(
        (cat) => [cat.id, cat]
      )
    ).values()
  ).sort((a, b) => a.display.localeCompare(b.display))

  return { sources: mergedSources, categories: mergedCategories }
}
