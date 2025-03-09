import React, { useMemo } from "react"
import { AppBar, Toolbar, Typography, Button, Badge } from "@mui/material"
import { useAppStore } from "../../store/app-store"
import { useUIStore } from "../../store/ui-store"
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { motion } from "framer-motion"

type AppHeaderProps = {
  setPreferencesOpen: (open: boolean) => void
}

/**
 * AppHeader is a React component that displays the application title and
 * contains buttons to toggle the theme and open the preferences dialog.
 *
 * @param {AppHeaderProps} props
 * @param {() => void} props.setPreferencesOpen callback to open the preferences dialog
 * @returns {JSX.Element} The AppHeader component.
 */
const AppHeader: React.FC<AppHeaderProps> = ({ setPreferencesOpen }) => {
  const { preferences } = useAppStore()
  const activePreferencesCount = useMemo(() => {
    return Object.values(preferences).filter((value) => value.length > 0).length
  }, [preferences])

  const { themeMode, setThemeMode } = useUIStore()

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light")
  }

  return (
    <AppBar position='sticky' color='primary' enableColorOnDark>
      <Toolbar variant='dense'>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          News Aggregator
        </Typography>

        <Button
          color='inherit'
          onClick={() => setPreferencesOpen(true)}
          sx={{ minWidth: "24px", p: 2 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Badge
              color='secondary'
              badgeContent={activePreferencesCount}
              variant='dot'
            >
              <SettingsApplicationsIcon
                onClick={() => setPreferencesOpen(true)}
              />
            </Badge>
          </motion.div>
        </Button>
        <Button
          color='inherit'
          onClick={toggleTheme}
          sx={{ minWidth: "24px", p: 2 }}
        >
          {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader
