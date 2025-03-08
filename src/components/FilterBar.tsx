import React, { useState, useEffect } from "react"
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { fetchSources } from "../services/newsApi"

export type FilterOptions = {
  query: string
  category: string
  source: string
  fromDate: string
  toDate: string
}

type FilterBarProps = {
  onSearch: (filters: FilterOptions) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [source, setSource] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [sourcesList, setSourcesList] = useState<
    { id: string; name: string }[]
  >([])

  const handleSearch = () => {
    onSearch({ query, category, source, fromDate, toDate })
  }

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  // Fetch sources on component mount
  useEffect(() => {
    const loadSources = async () => {
      const sources = await fetchSources()
      // Map to objects containing id and name
      setSourcesList(sources.map((s: any) => ({ id: s.id, name: s.name })))
    }
    loadSources()
  }, [])

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label='Search news...'
          variant='outlined'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 2,
          }}
        >
          <FormControl variant='outlined' fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label='Category'
              onChange={(e) => setCategory(e.target.value as string)}
            >
              <MenuItem value=''>All Categories</MenuItem>
              <MenuItem value='business'>Business</MenuItem>
              <MenuItem value='entertainment'>Entertainment</MenuItem>
              <MenuItem value='health'>Health</MenuItem>
              <MenuItem value='science'>Science</MenuItem>
              <MenuItem value='sports'>Sports</MenuItem>
              <MenuItem value='technology'>Technology</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant='outlined' fullWidth>
            <InputLabel>Source</InputLabel>
            <Select
              value={source}
              label='Source'
              onChange={(e) => setSource(e.target.value as string)}
            >
              <MenuItem value=''>All Sources</MenuItem>
              {sourcesList.map((src) => (
                <MenuItem key={src.id} value={src.id}>
                  {src.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 2,
          }}
        >
          <TextField
            label='From Date'
            type='date'
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            fullWidth
          />
          <TextField
            label='To Date'
            type='date'
            InputLabelProps={{ shrink: true }}
            variant='outlined'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            fullWidth
          />
        </Box>

        <Button
          variant='contained'
          color='secondary'
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{
            width: isSmallScreen ? "100%" : "auto",
          }}
        >
          Search
        </Button>
      </Box>
    </Paper>
  )
}

export default FilterBar
