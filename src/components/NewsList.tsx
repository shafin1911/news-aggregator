import React from "react"
import NewsItem from "./NewsItem"
import { Grid, Paper } from "@mui/material"

type NewsListProps = {
  articles: any[]
}

const NewsList: React.FC<NewsListProps> = ({ articles }) => {
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
