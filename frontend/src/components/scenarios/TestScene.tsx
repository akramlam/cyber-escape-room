import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import DDOSScene from './DDOSScene';
import PhishingScene from './PhishingScene';
import { StyledBox, StyledContainer } from '../StyledComponents';
import { styled } from '@mui/material/styles';

const StyledButtonContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const StyledSceneBox = styled(Box)(({ theme }) => ({
  height: '80vh',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const TestScene: React.FC = () => {
  const [activeScene, setActiveScene] = useState<'ddos' | 'phishing'>('ddos');

  return (
    <StyledContainer>
      <StyledBox>
        <StyledButtonContainer>
          <Button 
            onClick={() => setActiveScene('ddos')}
            variant={activeScene === 'ddos' ? 'contained' : 'outlined'}
            sx={{ mr: 2 }}
          >
            DDOS Attack Scene
          </Button>
          <Button 
            onClick={() => setActiveScene('phishing')}
            variant={activeScene === 'phishing' ? 'contained' : 'outlined'}
          >
            Phishing Scene
          </Button>
        </StyledButtonContainer>

        <StyledSceneBox>
          {activeScene === 'ddos' ? <DDOSScene /> : <PhishingScene />}
        </StyledSceneBox>
      </StyledBox>
    </StyledContainer>
  );
};

export default TestScene; 