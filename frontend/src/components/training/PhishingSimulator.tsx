import React, { useState } from 'react';
import { Box, Typography, Paper, Button, List, ListItem, Checkbox } from '@mui/material';
import { StyledContainer } from '../StyledComponents';

interface PhishingIndicator {
  id: number;
  text: string;
  isPhishing: boolean;
}

const PhishingSimulator: React.FC = () => {
  const [selectedIndicators, setSelectedIndicators] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const sampleEmail = {
    from: "security@g00gle.com",
    subject: "Urgent: Your Account Security",
    content: "Dear User, We detected unusual activity...",
    indicators: [
      { id: 1, text: "Misspelled domain (g00gle)", isPhishing: true },
      { id: 2, text: "Urgent action required", isPhishing: true },
      { id: 3, text: "Generic greeting", isPhishing: true },
      { id: 4, text: "Contains company logo", isPhishing: false }
    ]
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <StyledContainer>
      <Typography variant="h5" gutterBottom>
        Phishing Email Analysis
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          From: {sampleEmail.from}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Subject: {sampleEmail.subject}
        </Typography>
        <Typography variant="body1">
          {sampleEmail.content}
        </Typography>
      </Paper>

      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          Select all indicators of phishing:
        </Typography>
        <List>
          {sampleEmail.indicators.map((indicator) => (
            <ListItem key={indicator.id}>
              <Checkbox 
                checked={selectedIndicators.includes(indicator.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIndicators([...selectedIndicators, indicator.id]);
                  } else {
                    setSelectedIndicators(selectedIndicators.filter(id => id !== indicator.id));
                  }
                }}
              />
              <Typography>{indicator.text}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      <Button 
        variant="contained" 
        color="primary"
        onClick={handleSubmit}
        disabled={showResults}
      >
        Submit Analysis
      </Button>
    </StyledContainer>
  );
};

export default PhishingSimulator; 