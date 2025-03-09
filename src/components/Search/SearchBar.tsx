import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react"
import { Box, TextField, IconButton, Paper, Badge } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import FilterListOffIcon from "@mui/icons-material/FilterListOff"
import { NewsAggregator } from "../../services/NewsAggregator"
import { useAppStore } from "../../store/app-store"
import { StandardArticle } from "../../services/types"
import Loader from "../loaders/Loader"

// Lazily load the FilterPanel component as it's not needed by default
const FilterPanel = React.lazy(() => import("../filter/FilterPanel"))

/**
 * SearchBar component for rendering a search bar with filter capabilities.
 *
 * - Utilizes the NewsAggregator service to fetch news articles based on the search query.
 * - Manages and updates the application store with fetched articles and filter options.
 * - Provides a text input for entering search queries and a button to toggle filter visibility.
 * - Displays the number of active filters applied.
 * - Debounces the search query to reduce unnecessary API calls.
 * - Displays a filter panel when the filter button is activated.
 *
 * @returns {JSX.Element} A React component rendering the search bar and optional filter panel.
 */

const SearchBar: React.FC = () => {
  const aggregator = useMemo(() => new NewsAggregator(), [])

  const {
    setAllArticles,
    setFilteredArticles,
    setFilterOptions,
    setIsNewsLoading,
    filterOptions,
  } = useAppStore()

  const queryRef = React.useRef<string>("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [query, setQuery] = useState(queryRef.current)

  // Calculate active filter count: count non-empty fields in filterOptions.
  const activeFilterCount = useMemo(() => {
    return Object.values(filterOptions).filter((value) => value !== "").length
  }, [filterOptions])

  const handleSearch = useCallback(
    (query: string) => {
      setIsNewsLoading(true)
      aggregator.fetchNews(query).then((mergedArticles: StandardArticle[]) => {
        setAllArticles(mergedArticles)
        setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
        setFilteredArticles(mergedArticles)
        setTimeout(() => setIsNewsLoading(false), 3000)
      })
    },
    [
      setIsNewsLoading,
      aggregator,
      setAllArticles,
      setFilterOptions,
      setFilteredArticles,
    ]
  )

  useEffect(() => {
    handleSearch("")
  }, [handleSearch])

  // Debounce the search query to call onSearch 500ms after the user stops typing.
  useEffect(() => {
    if (query === queryRef.current) return

    const handler = setTimeout(() => {
      queryRef.current = query
      handleSearch(query)
    }, 500)

    return () => clearTimeout(handler)
  }, [query, handleSearch])

  return (
    <>
      <Paper sx={{ p: 2 }} data-testid='search-bar'>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            label='Search any news...'
            variant='outlined'
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Badge badgeContent={activeFilterCount} color='secondary'>
            <IconButton onClick={() => setShowFilters((prev) => !prev)}>
              {!showFilters ? <FilterListIcon /> : <FilterListOffIcon />}
            </IconButton>
          </Badge>
        </Box>
      </Paper>

      {showFilters && (
        <Suspense fallback={<Loader message='Loading filters...' />}>
          <FilterPanel />
        </Suspense>
      )}
    </>
  )
}

export default SearchBar
