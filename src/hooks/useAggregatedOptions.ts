import { useState, useEffect } from "react"
import { SourceOption, CategoryOption } from "../services/types"
import { aggregateOptions } from "../services/OptionsAggregator"

/**
 * A hook to load aggregated options (sources and categories).
 *
 * When the component mounts, it will load the aggregated options from the
 * OptionsAggregator service. The options are then stored in state and returned
 * via the hook.
 *
 * @returns an object containing the sources and categories.
 */
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
