import { Suspense } from 'react'
import Scene from '../components/3d/Scene'
import { Box, CircularProgress } from '@mui/material'

const GameView = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Suspense fallback={
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <CircularProgress />
        </Box>
      }>
        <Scene />
      </Suspense>
    </Box>
  )
}

export default GameView
