import { Suspense } from 'react'
import Scene from '../components/3d/Scene'
import { Box, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledContainer = styled(Box)({
  width: '100%',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden'
})

const LoaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh'
})

const GameView = () => {
  return (
    <StyledContainer>
      <Suspense fallback={
        <LoaderContainer>
          <CircularProgress />
        </LoaderContainer>
      }>
        <Scene />
      </Suspense>
    </StyledContainer>
  )
}

export default GameView
