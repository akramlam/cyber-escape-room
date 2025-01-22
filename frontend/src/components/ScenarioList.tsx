import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface Scenario {
  id: number;
  title: string;
  description: string;
  threat_type: string;
  time_limit: number;
}

interface ApiError {
  message: string;
  code: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ScenarioList: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching scenarios...');

        const response = await axios.get(`${API_URL}/api/scenarios/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Scenarios received:', response.data);
        setScenarios(response.data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate('/login');
          } else {
            setError(error.response?.data?.error || 'Failed to load scenarios');
          }
        } else {
          setError('Failed to load scenarios. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && token) {
      fetchScenarios();
    } else {
      navigate('/login');
    }
  }, [token, isAuthenticated, navigate]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!scenarios.length) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No scenarios available at the moment.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Scenarios
      </Typography>
      <Grid container spacing={3}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} sm={6} md={4} key={scenario.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {scenario.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Type: {scenario.threat_type}
                </Typography>
                <Typography variant="body2" component="p">
                  {scenario.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Time Limit: {Math.floor(scenario.time_limit / 60)} minutes
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    console.log('Navigating to scenario:', scenario.id);
                    navigate(`/scenarios/${scenario.id}`);
                  }}
                >
                  Start Challenge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ScenarioList;
