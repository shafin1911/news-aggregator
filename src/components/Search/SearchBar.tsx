// src/components/SearchBar.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Box, TextField, IconButton, Paper, Badge } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import { NewsAggregator } from "../../services/NewsAggregator"
import { useAppStore } from "../../store/app-store"
import { StandardArticle } from "../../services/types"
import FilterPanel from "../filter/FilterPanel"

const SearchBar: React.FC = () => {
  const [showFilters, setShowFilters] = React.useState(false)

  const aggregator = useMemo(() => new NewsAggregator(), [])
  const {
    setAllArticles,
    setArticles,
    setFilterOptions,
    setIsNewsLoading,
    filterOptions,
  } = useAppStore()
  const queryRef = React.useRef<string>("")
  const [query, setQuery] = useState(queryRef.current)

  // Calculate active filter count: count non-empty fields in filterOptions.
  const activeFilterCount = useMemo(() => {
    return Object.values(filterOptions).filter((value) => value !== "").length
  }, [filterOptions])

  const handleSearch = useCallback(
    (query: string) => {
      console.log("test rerender")
      setIsNewsLoading(true)
      aggregator.fetchNews(query).then((mergedArticles: StandardArticle[]) => {
        setAllArticles(mergedArticles)
        setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
        setArticles(mergedArticles)
        setTimeout(() => setIsNewsLoading(false), 3000)
      })
    },
    [
      setIsNewsLoading,
      aggregator,
      setAllArticles,
      setFilterOptions,
      setArticles,
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
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Box>
      </Paper>
      {showFilters && <FilterPanel />}
    </>
  )
}

export default SearchBar
