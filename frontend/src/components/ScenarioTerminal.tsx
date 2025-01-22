import React from 'react';
import { useParams } from 'react-router-dom';
import Terminal from './Terminal';
import { Box, Typography } from '@mui/material';

const ScenarioTerminal: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box component="div" style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        Terminal Challenge
      </Typography>
      <Terminal scenarioId={id} />
    </Box>
  );
};

export default ScenarioTerminal; 