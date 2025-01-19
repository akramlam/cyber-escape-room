import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Typography, TextField } from '@mui/material';
import axios from 'axios';
import Scene3D from './Scene3D';
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

const ScenarioView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await axios.get<Scenario>(`http://localhost:8000/api/scenarios/${id}/`);
        setScenario(response.data);
        if (response.data.challenges.length > 0) {
          setCurrentChallenge(response.data.challenges[0]);
          setTimeLeft(response.data.time_limit);
        }
      } catch (error) {
        console.error('Error fetching scenario:', error);
      }
    };

    if (id) {
      fetchScenario();
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmitAnswer = async () => {
    if (!scenario || !currentChallenge) return;

    try {
      const response = await axios.post(`http://localhost:8000/api/progress/${scenario.id}/complete_challenge/`, {
        challenge_id: currentChallenge.id,
        answer: answer
      });

      if (response.data.success) {
        const currentIndex = scenario.challenges.findIndex(c => c.id === currentChallenge.id);
        if (currentIndex < scenario.challenges.length - 1) {
          setCurrentChallenge(scenario.challenges[currentIndex + 1]);
          setAnswer('');
          setShowHint(false);
        } else {
          // Scenario completed
          // TODO: Show completion screen
        }
      } else {
        // Show error message
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <StyledContainer maxWidth="lg" sx={{ height: 'calc(100vh - 100px)' }}>
      <StyledBox>
        <StyledBox>
          <StyledTypography variant="h4" gutterBottom>
            {scenario?.title}
          </StyledTypography>
          <StyledTypography 
            variant="body1" 
            gutterBottom 
            sx={{ color: timeLeft < 60 ? '#ff0000' : '#ffffff' }}
          >
            Temps restant: {formatTime(timeLeft)}
          </StyledTypography>
        </StyledBox>
        
        <StyledSceneContainer>
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            style={{ background: '#000' }}
          >
            <Scene3D threatType={scenario?.threat_type || 'default'} />
            <OrbitControls enablePan={false} />
            <Environment preset="city" />
          </Canvas>
        </StyledSceneContainer>

        <StyledChallengePanel>
          {currentChallenge && (
            <>
              <StyledTypography variant="h6" gutterBottom>
                Challenge: {currentChallenge.question}
              </StyledTypography>
              
              {showHint && currentChallenge.hints.length > 0 && (
                <StyledTypography variant="body2" sx={{ color: '#ff9800', mb: 2 }}>
                  Hint: {currentChallenge.hints[0]}
                </StyledTypography>
              )}

              <StyledAnswerContainer>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Entrez votre réponse..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#222',
                      borderRadius: '4px',
                      '& fieldset': {
                        borderColor: '#333'
                      },
                      '&:hover fieldset': {
                        borderColor: '#00ff00'
                      }
                    }
                  }}
                />
                <StyledSubmitButton
                  variant="contained"
                  onClick={handleSubmitAnswer}
                >
                  Valider
                </StyledSubmitButton>
                {!showHint && (
                  <StyledHintButton
                    variant="outlined"
                    onClick={() => setShowHint(true)}
                  >
                    Indice
                  </StyledHintButton>
                )}
              </StyledAnswerContainer>
            </>
          )}
        </StyledChallengePanel>
      </StyledBox>
    </StyledContainer>
  );
};

export default ScenarioView;
