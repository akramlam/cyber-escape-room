import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Typography, TextField, Alert, Snackbar, CircularProgress } from '@mui/material';
import axios from 'axios';
import Scene3D from './Scene3D';
import Room from './3d/Room';
import { useAuth } from '../contexts/AuthContext';
import {
  StyledContainer,
  StyledBox,
  StyledTypography,
  StyledSceneContainer,
  StyledChallengePanel,
  StyledAnswerContainer,
  StyledSubmitButton,
  StyledHintButton
} from './StyledComponents';

interface Challenge {
  id: number;
  question: string;
  hints: string[];
  points: number;
}

interface Scenario {
  id: number;
  title: string;
  description: string;
  challenges: Challenge[];
  threat_type: string;
  time_limit: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ScenarioView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [progressId, setProgressId] = useState<string | null>(null);

  // Initialize scenario
  useEffect(() => {
    const initScenario = async () => {
      if (!id || !token) {
        console.log('Missing id or token:', { id, token });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching scenario data for id:', id);

        const response = await axios.get(`${API_URL}/api/scenarios/${id}/`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Scenario data received:', response.data);
        const scenarioData = response.data;
        setScenario(scenarioData);

        // Start scenario
        console.log('Starting scenario...');
        const startResponse = await axios.post(
          `${API_URL}/api/scenarios/${id}/start/`,
          {},
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        console.log('Start response:', startResponse.data);

        if (startResponse.data.progress) {
          setProgressId(startResponse.data.progress.id);
        }

        if (!currentChallenge && scenarioData.challenges && scenarioData.challenges.length > 0) {
          console.log('Setting initial challenge:', scenarioData.challenges[0]);
          setCurrentChallenge(scenarioData.challenges[0]);
        }

      } catch (error) {
        console.error('Error initializing scenario:', error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate('/login');
          } else {
            setError(error.response?.data?.detail || 'Failed to load scenario');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      console.log('Initializing scenario...');
      initScenario();
    } else {
      console.log('Not authenticated, redirecting to login...');
      navigate('/login');
    }
  }, [id, token, isAuthenticated]);

  // Handle answer submission
  const handleSubmit = async () => {
    if (!scenario || !currentChallenge || !progressId || submitLoading) {
      console.log('Cannot submit:', { scenario, currentChallenge, progressId, submitLoading });
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);

      console.log('Submitting answer:', { 
        progressId, 
        challengeId: currentChallenge.id, 
        answer: answer.trim() 
      });

      const response = await axios.post(
        `${API_URL}/api/progress/${progressId}/complete_challenge/`,
        {
          challenge_id: currentChallenge.id,
          answer: answer.trim().toLowerCase()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Submit response:', response.data);

      if (response.data.success) {
        const currentIndex = scenario.challenges.findIndex(c => c.id === currentChallenge.id);
        if (currentIndex < scenario.challenges.length - 1) {
          const nextChallenge = scenario.challenges[currentIndex + 1];
          console.log('Moving to next challenge:', nextChallenge);
          setCurrentChallenge(nextChallenge);
          setAnswer('');
          setShowHint(false);
        } else {
          console.log('Scenario completed!');
          setCompleted(true);
          navigate('/completion', { state: { score: response.data.score } });
        }
      } else {
        setError(response.data.message || 'Incorrect answer. Try again.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError(error.response?.data?.error || 'Failed to submit answer');
        }
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update time left
  useEffect(() => {
    if (!completed && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            navigate('/timeout');
            return 0;
          }
          // Update cached state
          if (id && scenario && currentChallenge && progressId) {
            const stateToCache = {
              scenario,
              currentChallenge,
              timeLeft: newTime,
              progressId
            };
            localStorage.setItem(`scenario_state_${id}`, JSON.stringify(stateToCache));
          }
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, completed, id, scenario, currentChallenge, progressId]);

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error">{error}</Alert>
      </StyledContainer>
    );
  }

  if (!scenario || !currentChallenge) {
    return (
      <StyledContainer>
        <Alert severity="warning">No scenario data available</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h3" color="primary">
        {scenario.title}
      </StyledTypography>
      <StyledTypography>
        Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </StyledTypography>

      <StyledSceneContainer>
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Scene3D threatType={scenario.threat_type} />
          <Room threatType={scenario.threat_type} difficulty="beginner" />
          <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
          <Environment preset="night" />
        </Canvas>
      </StyledSceneContainer>

      <StyledChallengePanel>
        <StyledTypography color="success" variant="h5">
          Challenge: {currentChallenge.question}
        </StyledTypography>

        <StyledAnswerContainer>
          <TextField
            fullWidth
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            variant="outlined"
            disabled={completed || submitLoading}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <StyledSubmitButton
            onClick={handleSubmit}
            disabled={submitLoading || completed}
          >
            {submitLoading ? <CircularProgress size={24} /> : 'Submit'}
          </StyledSubmitButton>
          <StyledHintButton
            onClick={() => setShowHint(!showHint)}
            disabled={completed}
          >
            Hint
          </StyledHintButton>
        </StyledAnswerContainer>

        {showHint && currentChallenge.hints.length > 0 && (
          <Alert severity="info">
            Hint: {currentChallenge.hints[0]}
          </Alert>
        )}

        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </StyledChallengePanel>
    </StyledContainer>
  );
};

export default ScenarioView;
