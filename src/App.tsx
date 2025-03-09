import React, { Suspense, useMemo } from "react"
import NewsList from "./components/news/NewsList"
import SearchBar from "./components/search/SearchBar"
import { Container, Box, ThemeProvider, CssBaseline } from "@mui/material"
import AppHeader from "./components/layout/AppHeader"
import Loader from "./components/loaders/Loader"
import { useUIStore } from "./store/ui-store"
import getTheme from "./theme"

const PreferencesDialog = React.lazy(
  () => import("./components/preferences/PreferencesDialog")
)

const App: React.FC = () => {
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  // Set up theme switching.
  const mode = useUIStore((state) => state.themeMode)
  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: (theme) => theme.palette.background.default,
        }}
      >
        <AppHeader setPreferencesOpen={setPreferencesOpen} />

        <Container maxWidth='xl' sx={{ my: 4 }}>
          <Box
            sx={{
              position: "sticky",
              top: 48,
              backgroundColor: (theme) => theme.palette.background.paper,
              zIndex: (theme) => theme.zIndex.appBar - 1,
              mb: 4,
            }}
          >
            <SearchBar />
          </Box>

          <NewsList />
        </Container>

        {preferencesOpen && (
          <Suspense fallback={<Loader message='Loading preferences...' />}>
            <PreferencesDialog
              open={preferencesOpen}
              onClose={() => setPreferencesOpen(false)}
            />
          </Suspense>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
