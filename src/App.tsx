import React from "react"
import NewsList from "./components/news/NewsList"
import SearchBar from "./components/search/SearchBar"
import PreferencesDialog from "./components/preferences/PreferencesDialog"
import { Container, Box } from "@mui/material"
import AppHeader from "./components/layout/AppHeader"

const App: React.FC = () => {
  const [preferencesOpen, setPreferencesOpen] = React.useState(false)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (theme) => theme.palette.background.default,
      }}
    >
      <AppHeader setPreferencesOpen={setPreferencesOpen} />

      <Box
        sx={{
          position: "sticky",
          top: 48,
          backgroundColor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.appBar - 1,
        }}
      >
        <SearchBar />
      </Box>

      <Container sx={{ pt: 2 }}>
        <NewsList />
      </Container>

      <PreferencesDialog
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
      />
    </Box>
  )
}

export default App
