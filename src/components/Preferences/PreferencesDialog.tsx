// src/components/PreferencesDialog.tsx
import React, { useCallback, useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  createFilterOptions,
} from "@mui/material"
import { useAggregatedOptions } from "../../hooks/useAggregatedOptions"
import { CategoryOption, SourceOption } from "../../services/types"
import { useAppStore } from "../../store/app-store"

export type UserPreferences = {
  sources: string[] // store IDs
  categories: string[] // store category ids (in lowercase)
  authors: string[] // store author names
}

type PreferencesDialogProps = {
  open: boolean
  onClose: () => void
}

const filter = createFilterOptions<string>()

const PreferencesDialog: React.FC<PreferencesDialogProps> = ({
  open,
  onClose,
}) => {
  const { preferences, setPreferences } = useAppStore()

  const [selectedSources, setSelectedSources] = useState<SourceOption[]>([])
  // Instead of storing strings, we store selected category objects.
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([])
  const [authors, setAuthors] = useState<string[]>(preferences.authors)
  // Get aggregated options.
  const { sources, categories } = useAggregatedOptions()

  const handleSavePreferences = useCallback(
    (prefs: UserPreferences) => {
      setPreferences(prefs)
      localStorage.setItem("userPreferences", JSON.stringify(prefs))
    },
    [setPreferences]
  )

  // Preselect sources and categories based on stored preferences.
  useEffect(() => {
    const preselectedSources = sources.filter((src) =>
      preferences.sources.includes(src.id)
    )
    setSelectedSources(preselectedSources)
    const preselectedCategories = categories.filter((cat) =>
      preferences.categories.includes(cat.id)
    )
    setSelectedCategories(preselectedCategories)
  }, [preferences.sources, preferences.categories, sources, categories])

  const handleSave = () => {
    handleSavePreferences({
      sources: selectedSources.map((src) => src.id),
      categories: selectedCategories.map((cat) => cat.id),
      authors: authors,
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid='preferences-dialog'
      fullWidth
    >
      <DialogTitle>Personalize Your News Feed</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          options={sources}
          value={selectedSources}
          onChange={(_, newValue) => setSelectedSources(newValue)}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Preferred Sources'
              variant='outlined'
              margin='normal'
            />
          )}
        />
        <Autocomplete
          multiple
          options={categories}
          value={selectedCategories}
          onChange={(_, newValue) => setSelectedCategories(newValue)}
          getOptionLabel={(option) => option.display}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Preferred Categories'
              variant='outlined'
              margin='normal'
            />
          )}
        />
        <Autocomplete
          multiple
          freeSolo
          options={[]} // No predefined list for authors.
          value={authors}
          onChange={(_, newValue) => setAuthors(newValue as string[])}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)
            if (params.inputValue !== "") {
              filtered.push(params.inputValue)
            }
            return filtered
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant='outlined'
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label='Preferred Authors'
              variant='outlined'
              margin='normal'
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PreferencesDialog
