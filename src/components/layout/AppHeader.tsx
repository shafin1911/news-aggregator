import React, { useMemo } from "react"
import { AppBar, Toolbar, Typography, Button, Badge } from "@mui/material"
import { useAppStore } from "../../store/app-store"

type AppHeaderProps = {
  setPreferencesOpen: (open: boolean) => void
}

const AppHeader: React.FC<AppHeaderProps> = ({ setPreferencesOpen }) => {
  const { preferences } = useAppStore()
  const activePreferencesCount = useMemo(() => {
    return Object.values(preferences).filter((value) => value.length > 0).length
  }, [preferences])

  return (
    <AppBar position='sticky' color='primary' enableColorOnDark>
      <Toolbar variant='dense'>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          News Aggregator
        </Typography>
        <Badge
          color='secondary'
          badgeContent={activePreferencesCount}
          variant='dot'
        >
          <Button color='inherit' onClick={() => setPreferencesOpen(true)}>
            Preferences
          </Button>
        </Badge>
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader
