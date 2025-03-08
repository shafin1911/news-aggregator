// src/components/SearchBar.tsx
import React, { useState, useEffect } from "react"
import { Box, TextField, IconButton, Paper } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"

type SearchBarProps = {
  onSearch: (query: string) => void
  onToggleFilters: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onToggleFilters }) => {
  const queryRef = React.useRef<string>("")
  const [query, setQuery] = useState(queryRef.current)

  // Debounce the search query to call onSearch 500ms after the user stops typing.
  useEffect(() => {
    if (query === queryRef.current) return

    const handler = setTimeout(() => {
      queryRef.current = query
      onSearch(query)
    }, 500)

    return () => clearTimeout(handler)
  }, [query, onSearch])

  return (
    <Paper sx={{ p: 2 }} data-testid='search-bar'>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          label='Search news...'
          variant='outlined'
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IconButton onClick={onToggleFilters}>
          <FilterListIcon />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default SearchBar
