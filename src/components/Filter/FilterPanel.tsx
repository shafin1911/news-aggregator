// src/components/FilterPanel.tsx
import React, { useState, useEffect, useCallback } from "react"
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
import { useAppStore } from "../../store/app-store"
import { FilterOptions } from "../../services/types"

const FilterPanel: React.FC = () => {
  const { filterOptions, setFilterOptions } = useAppStore()
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions)

  // Get aggregated options from our custom hook.
  const { sources, categories } = useAggregatedOptions()

  const handleApplyFilters = useCallback(
    (filters: FilterOptions) => {
      setFilterOptions(filters)
    },
    [setFilterOptions]
  )

  const handleClearFilters = useCallback(() => {
    setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
  }, [setFilterOptions])

  // Update local state when parent's filterOptions change.
  useEffect(() => {
    setLocalFilters(filterOptions)
  }, [filterOptions])

  // Sort filtered sources alphabetically by name.
  const sortedFilteredSources = [...sources].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  const handleApply = () => {
    handleApplyFilters(localFilters)
  }

  const handleClear = () => {
    const cleared: FilterOptions = {
      fromDate: "",
      toDate: "",
      category: "",
      source: "",
    }
    setLocalFilters(cleared)
    handleClearFilters()
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
