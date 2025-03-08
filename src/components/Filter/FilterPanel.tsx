// src/components/FilterPanel.tsx
import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import { useAggregatedOptions } from "../../hooks/useAggregatedOptions"

export type FilterOptions = {
  fromDate: string
  toDate: string
  category: string // stored in lowercase
  source: string
}

type FilterPanelProps = {
  filterOptions: FilterOptions
  onApplyFilters: (filters: FilterOptions) => void
  onClearFilters: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filterOptions,
  onApplyFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions)

  // Get aggregated options from our custom hook.
  const { sources, categories } = useAggregatedOptions()

  // Update local state when parent's filterOptions change.
  useEffect(() => {
    setLocalFilters(filterOptions)
  }, [filterOptions])

  // When category changes, clear the source if it doesn't match.
  // useEffect(() => {
  //   if (localFilters.category && localFilters.source) {
  //     const selectedSource = sources.find(
  //       (src) => src.id === localFilters.source
  //     )
  //     if (selectedSource) {
  //       const srcCat = selectedSource.category
  //       if (srcCat !== localFilters.category) {
  //         setLocalFilters((prev) => ({ ...prev, source: "" }))
  //       }
  //     }
  //   }
  // }, [localFilters.category, localFilters.source, sources])

  // Filter sources based on selected category.
  // const filteredSources = localFilters.category
  //   ? sources.filter((src) => {
  //       if (src.category) {
  //         return src.category === localFilters.category
  //       }
  //     })
  //   : sources

  // Sort filtered sources alphabetically by name.
  const sortedFilteredSources = [...sources].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const handleApply = () => {
    onApplyFilters(localFilters)
  }

  const handleClear = () => {
    const cleared: FilterOptions = {
      fromDate: "",
      toDate: "",
      category: "",
      source: "",
    }
    setLocalFilters(cleared)
    onClearFilters()
  }

  return (
    <Paper sx={{ p: 2, mt: 2, borderRadius: 0 }} data-testid='filter-panel'>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label='From Date'
            type='date'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={localFilters.fromDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, fromDate: e.target.value })
            }
          />
          <TextField
            label='To Date'
            type='date'
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={localFilters.toDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, toDate: e.target.value })
            }
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Category</InputLabel>
            <Select
              label='Category'
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  category: e.target.value as string,
                })
              }
            >
              <MenuItem value=''>All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant='outlined'>
            <InputLabel>Source</InputLabel>
            <Select
              label='Source'
              value={localFilters.source}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  source: e.target.value as string,
                })
              }
            >
              <MenuItem value=''>All Sources</MenuItem>
              {sortedFilteredSources.map((src) => (
                <MenuItem key={src.id} value={src.id}>
                  {src.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant='outlined' onClick={handleClear}>
            Clear
          </Button>
          <Button variant='contained' onClick={handleApply}>
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default FilterPanel
