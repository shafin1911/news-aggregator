// src/hooks/useAggregatedOptions.ts
import { useState, useEffect } from "react"
import { fetchSources } from "../services/newsApi"
import { fetchGuardianSections, GuardianSection } from "../services/guardianApi"

export type SourceOption = {
  id: string // stored in lowercase
  name: string
  category: string // stored in lowercase (NewsAPI only; Guardian will be empty)
}

export type CategoryOption = {
  id: string // stored in lowercase (using Guardian's sectionName or NewsAPI category)
  display: string // display in sentence case
}

const toSentenceCase = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const useAggregatedOptions = () => {
  const [sources, setSources] = useState<SourceOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])

  // Load NewsAPI sources and ensure Guardian is always added.
  useEffect(() => {
    const loadSources = async () => {
      const newsapiSources = await fetchSources()
      const mappedSources: SourceOption[] = newsapiSources.map((s: any) => ({
        id: s.id.toLowerCase(),
        name: s.name,
        category: s.category ? s.category.toLowerCase() : "",
      }))
      // Ensure Guardian is included.
      if (!mappedSources.some((src) => src.id === "guardian")) {
        mappedSources.push({
          id: "guardian",
          name: "The Guardian",
          category: "",
        })
      }
      // Sort sources alphabetically by name.
      const sortedSources = mappedSources.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
      setSources(sortedSources)
    }
    loadSources()
  }, [])

  // Load Guardian sections and merge with NewsAPI categories.
  useEffect(() => {
    const loadCategories = async () => {
      // Extract NewsAPI categories from sources.
      const newsapiSet = new Set<string>()
      sources.forEach((src) => {
        if (src.category) {
          newsapiSet.add(src.category)
        }
      })
      const newsapiCategories: CategoryOption[] = Array.from(newsapiSet).map(
        (cat) => ({
          id: cat, // already lowercase
          display: toSentenceCase(cat),
        })
      )

      try {
        const guardianSections: GuardianSection[] =
          await fetchGuardianSections()
        // Use sectionName for Guardian categories.
        const guardianCategories: CategoryOption[] = guardianSections.map(
          (section) => ({
            id: section.webTitle.toLowerCase(), // use sectionName in lowercase
            display: section.webTitle,
          })
        )

        // Merge both arrays without duplicates.
        const mergedMap = new Map<string, CategoryOption>()
        newsapiCategories.forEach((cat) => {
          mergedMap.set(cat.id, cat)
        })
        guardianCategories.forEach((cat) => {
          if (!mergedMap.has(cat.id)) {
            mergedMap.set(cat.id, cat)
          }
        })
        const mergedArray = Array.from(mergedMap.values()).sort((a, b) =>
          a.display.localeCompare(b.display)
        )
        setCategories(mergedArray)
      } catch (error) {
        console.error("Error loading Guardian sections:", error)
        setCategories(
          newsapiCategories.sort((a, b) => a.display.localeCompare(b.display))
        )
      }
    }
    if (sources.length > 0) {
      loadCategories()
    }
  }, [sources])

  return { sources, categories }
}
