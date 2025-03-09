import React from "react"
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Link,
  IconButton,
  Avatar,
} from "@mui/material"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { StandardArticle } from "../../services/types"

type NewsItemProps = {
  article: StandardArticle
}

/**
 * Component for displaying a single news article as a card.
 *
 * This component utilizes Material-UI's Card components to display the article's
 * source, title, author, description, and an optional image. The card also includes
 * a link to the full article.
 *
 * Props:
 * - article: An object of type StandardArticle containing the article details.
 *
 * The card features a hover effect that elevates the card and provides a subtle transformation.
 * Displays the source's initial as an avatar and handles missing data gracefully.
 */

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
  const titleInitial = article.source?.name?.[0] || "N"

  return (
    <Card
      variant='outlined'
      sx={{
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardHeader
        avatar={<Avatar>{titleInitial}</Avatar>}
        title={
          <div>
            <Typography variant='subtitle1' fontWeight='600'>
              {article.source?.name || "Unknown Source"}
            </Typography>
          </div>
        }
        subheader={
          <span>
            <Typography variant='overline' fontWeight='600'>
              {article.category.name || ""}
            </Typography>
            <span> | </span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </span>
        }
        slot='header'
      />

      {article.urlToImage && (
        <CardMedia
          component='img'
          height='180'
          image={article.urlToImage}
          alt={article.title}
        />
      )}

      <CardContent>
        <Typography variant='h6' gutterBottom>
          {article.title}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          {article.author}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {article.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Link
          href={article.url}
          target='_blank'
          rel='noopener noreferrer'
          underline='hover'
          color='primary'
          fontWeight='600'
          sx={{ display: "flex", alignItems: "center" }}
        >
          Read More
          <IconButton
            size='small'
            component='span'
            sx={{ ml: 0.5 }}
            color='primary'
          >
            <OpenInNewIcon fontSize='inherit' />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  )
}

export default NewsItem
