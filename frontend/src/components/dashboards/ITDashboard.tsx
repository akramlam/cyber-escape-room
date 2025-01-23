import React from 'react';
import { Grid, Typography } from '@mui/material';
import Terminal from '../Terminal';
import { StyledContainer, StyledBox } from '../StyledComponents';

const ITDashboard: React.FC = () => {
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        IT Security Operations
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledBox>
            <Typography variant="h6" gutterBottom>
              Server Status
            </Typography>
            <Typography>
              Active Alerts: 2 DDoS Attempts Detected
            </Typography>
          </StyledBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StyledBox>
            <Typography variant="h6" gutterBottom>
              Security Console
            </Typography>
            <Terminal />
          </StyledBox>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default ITDashboard; 