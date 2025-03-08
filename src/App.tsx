// src/App.tsx
import React, { useEffect, useCallback, useMemo } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { NewsAggregator } from "./services/NewsAggregator"
import {
  StandardArticle,
  FilterOptions,
  UserPreferences,
} from "./services/types"
import NewsList from "./components/News/NewsList"
import SearchBar from "./components/Search/SearchBar"
import FilterPanel from "./components/Filter/FilterPanel"
import PreferencesDialog from "./components/Preferences/PreferencesDialog"
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material"
import { useAppStore } from "./store/app-store"
import { useFilteredArticles } from "./hooks/useFilteredArticles"

const App: React.FC = () => {
  // Instantiate aggregator once.
  const aggregator = useMemo(() => new NewsAggregator(), [])

  // Extract state and actions from the store.
  const {
    allArticles,
    articles,
    filterOptions,
    preferences,
    setAllArticles,
    setArticles,
    setFilterOptions,
    setPreferences,
  } = useAppStore()

  // Local UI state for toggling dialogs.
  const [showFilters, setShowFilters] = React.useState(false)
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  // Handle search: fetch news via aggregator and update store.
  const handleSearch = useCallback(
    (query: string) => {
      console.log("test query", query)
      aggregator.fetchNews(query).then((mergedArticles: StandardArticle[]) => {
        setAllArticles(mergedArticles)
        // Reset filters on new search.
        setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
        setArticles(mergedArticles)
      })
    },
    [aggregator, setAllArticles, setFilterOptions, setArticles]
  )

  // Fetch news on mount.
  useEffect(() => {
    // handleSearch("")
  }, [handleSearch])

  const handleApplyFilters = useCallback(
    (filters: FilterOptions) => {
      setFilterOptions(filters)
    },
    [setFilterOptions]
  )

  const handleClearFilters = useCallback(() => {
    setFilterOptions({ fromDate: "", toDate: "", category: "", source: "" })
  }, [setFilterOptions])

  const handleSavePreferences = useCallback(
    (prefs: UserPreferences) => {
      setPreferences(prefs)
    },
    [setPreferences]
  )

  // Use the custom hook to get filtered articles.
  const filteredArticles = useFilteredArticles(
    allArticles,
    filterOptions,
    preferences
  )

  // Update articles whenever filteredArticles changes.
  useEffect(() => {
    setArticles(filteredArticles)
  }, [filteredArticles, setArticles])

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
            top: 48,
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
