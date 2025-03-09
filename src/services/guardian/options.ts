import { fetchGuardianSections } from "./GuardianProvider"
import { SourceOption, CategoryOption } from "../types"

/**
 * Fetch the single source from the Guardian API.
 * @returns A promise resolving to a SourceOption object representing the Guardian source.
 */
export const getGuardianSource = async (): Promise<SourceOption> => {
  // For guardian we only have one source
  return { id: "guardian", name: "The Guardian", category: "" }
}

/**
 * Fetch the categories from the Guardian API.
 * The categories are fetched from the Guardian's sections list.
 * Each section is mapped to a CategoryOption object where the id is the
 * lowercase version of the sectionName (webTitle) and the display is the
 * sectionName as is.
 * @returns A promise resolving to an array of CategoryOption objects.
 */
export const getGuardianCategories = async (): Promise<CategoryOption[]> => {
  const sections = await fetchGuardianSections()
  // Here we use sectionName (webTitle) as the category.
  const guardianCategories: CategoryOption[] = sections.map((section) => ({
    id: section.webTitle.toLowerCase(), // id as lowercase
    display: section.webTitle, // display as is
  }))
  return guardianCategories
}
