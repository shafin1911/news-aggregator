// src/components/Filter/FilterPanel.tsx
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
import { useAppStore } from "../../store/app-store"
import { FilterOptions } from "../../services/types"
import { useDerivedFilterOptions } from "../../hooks/useDerivedFilterOptions"

const FilterPanel: React.FC = () => {
  // Get filter options and articles from the store.
  const { filterOptions, setFilterOptions, allArticles } = useAppStore()
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filterOptions)

  const { availableSources, availableCategories } =
    useDerivedFilterOptions(allArticles)

  // Update local state when store filterOptions change.
  useEffect(() => {
    setLocalFilters(filterOptions)
  }, [filterOptions])

  const handleApplyFilters = useCallback(() => {
    setFilterOptions(localFilters)
  }, [localFilters, setFilterOptions])

  const handleClearFilters = useCallback(() => {
    const cleared: FilterOptions = {
      fromDate: "",
      toDate: "",
      category: "",
      source: "",
    }
    setLocalFilters(cleared)
    setFilterOptions(cleared)
  }, [setFilterOptions])

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
              {availableCategories.map((cat) => (
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
              {availableSources.map((src) => (
                <MenuItem key={src.id} value={src.id}>
                  {src.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant='outlined' onClick={handleClearFilters}>
            Clear
          </Button>
          <Button variant='contained' onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default FilterPanel
