import React, { useEffect } from "react"
import NewsItem from "./NewsItem"
import { Grid, Paper } from "@mui/material"
import EmptyState from "./EmptyState"
import { useFilteredArticles } from "../../hooks/useFilteredArticles"
import { useAppStore } from "../../store/app-store"
import Loader from "../loaders/Loader"

const NewsList: React.FC = () => {
  const {
    filteredArticles,
    setFilteredArticles,
    allArticles,
    filterOptions,
    preferences,
    isNewsLoading,
  } = useAppStore()

  // Use custom hook to get filtered articles.
  const newFilteredArticles = useFilteredArticles(
    allArticles,
    filterOptions,
    preferences
  )

  useEffect(() => {
    setFilteredArticles(newFilteredArticles)
  }, [newFilteredArticles, setFilteredArticles])

  if (isNewsLoading)
    return <Loader message='Loading articles. Please wait...' />

  if (!filteredArticles.length) {
    return <EmptyState />
  }

  return (
    <Paper sx={{ p: 2, mb: 4 }} elevation={2} data-testid='news-list'>
      <Grid container spacing={3}>
        {filteredArticles.map((filteredArticle, index) => (
          <Grid item xs={12} md={6} lg={4} xl={3} key={index}>
            <NewsItem article={filteredArticle} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default NewsList
