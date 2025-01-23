import React from 'react';
import { Grid, Typography, Card, CardContent, Button, Box } from '@mui/material';
import { StyledContainer } from '../StyledComponents';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import PhishingIcon from '@mui/icons-material/PhishingOutlined';

const TrainingModule = ({ title, description, icon }: any) => (
  <Card sx={{ height: '100%', bgcolor: 'background.paper', border: '1px solid #333' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {description}
      </Typography>
      <Button variant="contained" color="primary" fullWidth>
        Start Training
      </Button>
    </CardContent>
  </Card>
);

const NonITDashboard: React.FC = () => {
  const modules = [
    {
      title: "Email Phishing Detection",
      description: "Learn to identify suspicious emails, fake login pages, and common phishing tactics used by attackers.",
      icon: <EmailIcon color="primary" />
    },
    {
      title: "Social Engineering Defense",
      description: "Understand how attackers use psychological manipulation and how to protect against social engineering.",
      icon: <WarningIcon color="warning" />
    },
    {
      title: "Password Security",
      description: "Best practices for creating strong passwords and maintaining secure authentication.",
      icon: <SecurityIcon color="success" />
    },
    {
      title: "Phishing Simulation",
      description: "Practice identifying phishing attempts with real-world examples and interactive scenarios.",
      icon: <PhishingIcon color="error" />
    }
  ];

  return (
    <StyledContainer>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Security Awareness Training
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Learn to protect yourself and your organization from cyber threats
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} md={6} key={index}>
            <TrainingModule {...module} />
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default NonITDashboard; 