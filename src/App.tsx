import React, { Suspense, useMemo } from "react"
import { Container, Box, ThemeProvider, CssBaseline } from "@mui/material"
import { useUIStore } from "./store/ui-store"
import getTheme from "./theme"
import NewsList from "./components/news/NewsList"
import SearchBar from "./components/search/SearchBar"
import AppHeader from "./components/layout/AppHeader"
import Loader from "./components/loaders/Loader"

// Lazy load the PreferencesDialog component.
// it's only loaded when needed.
const PreferencesDialog = React.lazy(
  () => import("./components/preferences/PreferencesDialog")
)

/**
 * The main App component.
 *
 * This component is the root of the application and sets up the global
 * theme and the layout of the application.
 *
 * It renders the AppHeader, which contains the app's title and a link to
 * the preferences dialog.
 *
 * It also renders a SearchBar, which allows the user to search for news
 * articles.
 *
 * Finally, it renders the NewsList component, which displays the list of
 * news articles.
 *
 * The component also handles the display of the preferences dialog, which
 * is displayed when the user clicks on the preferences button in the
 * AppHeader.
 *
 * @returns {JSX.Element} The App component.
 */
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
        {/* Header of the app */}
        <AppHeader setPreferencesOpen={setPreferencesOpen} />

        {/* Main body of the app */}
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

        {/* Preferences dialog */}
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
