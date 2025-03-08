// src/hooks/useAggregatedOptions.ts
import { useState, useEffect } from "react"
import { SourceOption, CategoryOption } from "../services/types"
import { aggregateOptions } from "../services/OptionsAggregator"

export const useAggregatedOptions = () => {
  const [sources, setSources] = useState<SourceOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    const loadOptions = async () => {
      const { sources, categories } = await aggregateOptions()
      setSources(sources)
      setCategories(categories)
    }
    loadOptions()
  }, [])

  return { sources, categories }
}
