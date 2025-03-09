// src/components/Loader.tsx
import React from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

const Loader: React.FC<{ message?: string }> = ({
  message = "Loading please wait...",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <CircularProgress size={60} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 2 }}>
          <DotLottieReact
            src='https://lottie.host/0a4fd1ca-98de-4026-9a6c-6a625d2becab/6ROKN6FEc5.lottie'
            loop
            autoplay
          />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <Typography variant='body1' sx={{ mt: 2 }}>
          {message}
        </Typography>
      </motion.div>
    </Box>
  )
}

export default Loader
