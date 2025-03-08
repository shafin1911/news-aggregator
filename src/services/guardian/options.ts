// src/services/guardian/options.ts
import { fetchGuardianSections } from "./GuardianProvider"
import { SourceOption, CategoryOption } from "../types"

export const getGuardianSource = async (): Promise<SourceOption> => {
  // Guardian is always the same.
  return { id: "guardian", name: "The Guardian", category: "" }
}

export const getGuardianCategories = async (): Promise<CategoryOption[]> => {
  const sections = await fetchGuardianSections()
  // Here we use sectionName (webTitle) as the category.
  const guardianCategories: CategoryOption[] = sections.map((section) => ({
    id: section.webTitle.toLowerCase(), // id as lowercase
    display: section.webTitle, // display as is
  }))
  return guardianCategories
}
