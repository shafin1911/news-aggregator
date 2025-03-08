// src/components/EmptyState.tsx
import React from "react"
import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"

const EmptyState: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 4,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant='h5' gutterBottom>
          Oops, no articles found!
        </Typography>
        <Typography variant='body1'>
          Try adjusting your filters or search for something else.
        </Typography>
        {/* You can embed an animation here, for example using Lottie */}
      </motion.div>
    </Box>
  )
}

export default EmptyState
