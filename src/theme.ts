import { createTheme } from "@mui/material/styles"

/**
 * Creates a theme based on the given mode.
 *
 * @param {("light" | "dark")} mode - either "light" or "dark"
 * @returns {ThemeOptions} - the theme options
 */
const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode: typeof mode === "string" ? mode : "light",
      primary: {
        main: mode === "light" ? "#000" : "#fff",
      },
      secondary: {
        main: "#f50057",
      },
      text: {
        primary: mode === "light" ? "#000" : "#fff",
        secondary: mode === "light" ? "#000" : "#fff",
      },
      background: {
        default: mode === "light" ? "#fff" : "#121212",
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h3: {
        fontWeight: 700,
        letterSpacing: "0.5px",
      },
    },
    shape: {
      borderRadius: 12,
    },
  })

export default getTheme
