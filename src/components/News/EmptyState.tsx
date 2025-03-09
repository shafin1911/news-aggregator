// src/components/EmptyState.tsx
import React from "react"
import { Box, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

const EmptyState: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant='h5' gutterBottom>
          Oops, no articles found!
        </Typography>
        <Typography variant='body1'>
          Try adjusting your search, filters, or review your preferences as they
          may also impact the results.
        </Typography>
        <Box sx={{ mt: 2 }} width={"100%"} display='inline-block'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DotLottieReact
              src='https://lottie.host/8fec3a47-6844-4ccd-9f97-150de1078c01/6ObM8ITXrp.lottie'
              loop
              autoplay
            />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  )
}

export default EmptyState
