// src/main.tsx (or index.tsx)
import React from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider, CssBaseline } from "@mui/material"
import App from "./App"
import theme from "./theme"

createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
  // </React.StrictMode>
)
