import React, { useEffect } from "react"
import NewsItem from "./NewsItem"
import { Grid, Paper } from "@mui/material"
import EmptyState from "./EmptyState"
import { useFilteredArticles } from "../../hooks/useFilteredArticles"
import { useAppStore } from "../../store/app-store"
import Loader from "../loaders/Loader"

const NewsList: React.FC = () => {
  const {
    articles,
    setArticles,
    allArticles,
    filterOptions,
    preferences,
    isNewsLoading,
  } = useAppStore()

  // Use custom hook to get filtered articles.
  const filteredArticles = useFilteredArticles(
    allArticles,
    filterOptions,
    preferences
  )

  useEffect(() => {
    setArticles(filteredArticles)
  }, [filteredArticles, setArticles])

  if (isNewsLoading)
    return <Loader message='Loading articles. Please wait...' />

  if (!articles.length) {
    return <EmptyState />
  }

  return (
    <Paper sx={{ p: 2, mb: 4 }} elevation={2}>
      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <NewsItem article={article} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default NewsList
