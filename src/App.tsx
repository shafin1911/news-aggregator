// src/App.tsx
import React, { useState, useEffect, useCallback } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { fetchNews, fetchSources } from "./services/newsApi"
import { fetchGuardianNews } from "./services/guardianApi"
import NewsList from "./components/NewsList"
import SearchBar from "./components/SearchBar"
import FilterPanel, { FilterOptions } from "./components/FilterPanel"
import PreferencesDialog, {
  UserPreferences,
} from "./components/PreferencesDialog"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material"

// Helper: Format a Date in local time as "YYYY-MM-DD"
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = ("0" + (date.getMonth() + 1)).slice(-2)
  const day = ("0" + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

const App: React.FC = () => {
  // Master list of articles from both APIs.
  const [allArticles, setAllArticles] = useState<any[]>([])
  // Articles after filtering.
  const [articles, setArticles] = useState<any[]>([])
  // Current search query.
  const [searchQuery, setSearchQuery] = useState("")
  // Controlled filter options from the FilterPanel.
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    fromDate: "",
    toDate: "",
    category: "",
    source: "",
  })
  // User preferences; persisted via localStorage.
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem("userPreferences")
    return stored
      ? JSON.parse(stored)
      : { sources: [], categories: [], authors: [] }
  })
  // Toggle visibility of FilterPanel and PreferencesDialog.
  const [showFilters, setShowFilters] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  // Mapping of source ID to category (loaded from fetchSources for NewsAPI).
  const [sourceMapping, setSourceMapping] = useState<Record<string, string>>({})

  // Load source mapping on mount (for NewsAPI sources only).
  useEffect(() => {
    const loadSourceMapping = async () => {
      const sources = await fetchSources()
      const mapping: Record<string, string> = {}
      sources.forEach((s: any) => {
        // Store the category in lowercase.
        mapping[s.id] = s.category ? s.category.toLowerCase() : ""
      })
      setSourceMapping(mapping)
    }
    loadSourceMapping()
  }, [])

  // Aggregated search: Call both APIs, map Guardian data to standard format, and merge results.
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    Promise.all([fetchNews({ query }), fetchGuardianNews({ q: query })]).then(
      ([newsApiArticles, guardianArticles]) => {
        const mergedArticles = [...newsApiArticles, ...guardianArticles]
        setAllArticles(mergedArticles)
        // Reset filters on new search.
        setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
        setArticles(mergedArticles)
      }
    )
  }, [])

  // Update filter options when the user applies filters.
  const handleApplyFilters = useCallback((filters: FilterOptions) => {
    setFilterOptions(filters)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
  }, [])

  // Save user preferences and persist them.
  const handleSavePreferences = useCallback((prefs: UserPreferences) => {
    setPreferences(prefs)
    localStorage.setItem("userPreferences", JSON.stringify(prefs))
  }, [])

  // Filtering function: Applies date filters, filter panel values, and personalization.
  const applyClientSideFilters = useCallback(() => {
    const filtered = allArticles.filter((article) => {
      // Date filtering using local date strings.
      if (filterOptions.fromDate) {
        const artDay = formatLocalDate(new Date(article.publishedAt))
        if (artDay < filterOptions.fromDate) return false
      }
      if (filterOptions.toDate) {
        const artDay = formatLocalDate(new Date(article.publishedAt))
        if (artDay > filterOptions.toDate) return false
      }
      // Category filtering:
      // In App.tsx, inside applyClientSideFilters:
      if (filterOptions.category) {
        if (article.source?.id === "guardian") {
          // For Guardian articles, article.category is already lowercase (derived from sectionName)
          if ((article.category || "").toLowerCase() !== filterOptions.category)
            return false
        } else {
          const articleCategory = sourceMapping[article.source?.id] || ""
          if (articleCategory !== filterOptions.category) return false
        }
      }

      // Source filtering.
      if (filterOptions.source) {
        if (!article.source || article.source.id !== filterOptions.source)
          return false
      }
      // PERSONALIZATION FILTERS:
      // Preferred Sources.
      if (preferences.sources.length > 0) {
        if (!article.source || !preferences.sources.includes(article.source.id))
          return false
      }
      // Preferred Categories.
      if (preferences.categories.length > 0) {
        // For Guardian articles, use article.category.
        const artCat =
          article.source?.id === "guardian"
            ? (article.category || "").toLowerCase()
            : (sourceMapping[article.source?.id] || "").toLowerCase()
        if (!preferences.categories.includes(artCat)) return false
      }
      // Preferred Authors.
      if (preferences.authors.length > 0) {
        if (!article.author) return false
        const artAuthor = article.author.toLowerCase()
        const match = preferences.authors.some((prefAuthor) =>
          artAuthor.includes(prefAuthor.toLowerCase())
        )
        if (!match) return false
      }
      return true
    })
    setArticles(filtered)
  }, [allArticles, filterOptions, preferences, sourceMapping])

  useEffect(() => {
    applyClientSideFilters()
  }, [
    allArticles,
    filterOptions,
    preferences,
    sourceMapping,
    applyClientSideFilters,
  ])

  return (
    <Router>
      <Box
        sx={{
          minHeight: "100vh",
          background: (theme) => theme.palette.background.default,
        }}
      >
        {/* Sticky Navbar */}
        <AppBar position='sticky' color='primary' enableColorOnDark>
          <Toolbar variant='dense'>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              News Aggregator
            </Typography>
            <Button color='inherit' onClick={() => setPreferencesOpen(true)}>
              Preferences
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sticky container for SearchBar and FilterPanel */}
        <Box
          sx={{
            position: "sticky",
            top: 48, // Adjust based on your AppBar height.
            backgroundColor: (theme) => theme.palette.background.paper,
            zIndex: (theme) => theme.zIndex.appBar - 1,
          }}
        >
          <SearchBar
            onSearch={handleSearch}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
          />
          {showFilters && (
            <FilterPanel
              filterOptions={filterOptions}
              onApplyFilters={handleApplyFilters}
              onClearFilters={handleClearFilters}
            />
          )}
        </Box>

        <Container sx={{ pt: 4 }}>
          <Routes>
            <Route path='/' element={<NewsList articles={articles} />} />
          </Routes>
        </Container>

        <PreferencesDialog
          open={preferencesOpen}
          onClose={() => setPreferencesOpen(false)}
          preferences={preferences}
          onSave={handleSavePreferences}
        />
      </Box>
    </Router>
  )
}

export default App
