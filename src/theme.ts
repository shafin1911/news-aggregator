import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#000", // Indigo
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#fff", // Light gray for background
      paper: "#ffffff", // White for cards/paper
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

export default theme
