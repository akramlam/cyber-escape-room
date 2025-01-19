import React from 'react';
import { Grid, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledCard, StyledButton } from '../StyledComponents';
import { Scenario } from '../../types';

interface ScenarioListProps {
  scenarios: Scenario[];
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {scenarios.map((scenario) => (
        <Grid item xs={12} sm={6} key={scenario.id}>
          <StyledCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {scenario.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scenario.description}
              </Typography>
            </CardContent>
            <StyledButton onClick={() => navigate(`/scenario/${scenario.id}`)}>
              Start
            </StyledButton>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ScenarioList; 