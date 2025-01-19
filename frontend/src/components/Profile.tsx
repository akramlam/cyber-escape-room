import React, { useState, useEffect } from 'react';
import { Paper, Grid, Typography, LinearProgress } from '@mui/material';
import {
  StyledContainer,
  StyledBox,
  StyledTypography,
  StyledCard
} from './StyledComponents';

interface Achievement {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Progress {
  scenarioId: number;
  scenarioTitle: string;
  progress: number;
  completedChallenges: number;
  totalChallenges: number;
}

const Profile: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    // Données de test pour les achievements
    const mockAchievements = [
      {
        id: 1,
        title: "Novice en Cybersécurité",
        description: "Complétez votre premier scénario",
        completed: true
      },
      {
        id: 2,
        title: "Expert en Phishing",
        description: "Identifiez avec succès 10 tentatives de phishing",
        completed: false
      },
      {
        id: 3,
        title: "Défenseur SQL",
        description: "Bloquez 5 tentatives d'injection SQL",
        completed: false
      }
    ];

    // Données de test pour la progression
    const mockProgress = [
      {
        scenarioId: 1,
        scenarioTitle: "Attaque par Phishing",
        progress: 75,
        completedChallenges: 3,
        totalChallenges: 4
      },
      {
        scenarioId: 2,
        scenarioTitle: "Injection SQL",
        progress: 50,
        completedChallenges: 2,
        totalChallenges: 4
      },
      {
        scenarioId: 3,
        scenarioTitle: "Attaque par Force Brute",
        progress: 25,
        completedChallenges: 1,
        totalChallenges: 4
      }
    ];

    setAchievements(mockAchievements);
    setProgress(mockProgress);
  }, []);

  return (
    <StyledContainer maxWidth="lg">
      <StyledBox sx={{ gap: 4 }}>
        <StyledTypography variant="h4" gutterBottom>
          Profil Utilisateur
        </StyledTypography>

        <Grid container spacing={4}>
          {/* Section Progression */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <StyledTypography variant="h5" gutterBottom>
                Progression des Scénarios
              </StyledTypography>
              <StyledBox sx={{ gap: 3 }}>
                {progress.map((item) => (
                  <div key={item.scenarioId}>
                    <StyledBox sx={{ gap: 1 }}>
                      <StyledTypography variant="h6">
                        {item.scenarioTitle}
                      </StyledTypography>
                      <LinearProgress
                        variant="determinate"
                        value={item.progress}
                        sx={{
                          height: 10,
                          backgroundColor: '#333',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#00ff00'
                          }
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.completedChallenges} / {item.totalChallenges} challenges complétés
                      </Typography>
                    </StyledBox>
                  </div>
                ))}
              </StyledBox>
            </StyledCard>
          </Grid>

          {/* Section Achievements */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <StyledTypography variant="h5" gutterBottom>
                Achievements
              </StyledTypography>
              <StyledBox sx={{ gap: 2 }}>
                {achievements.map((achievement) => (
                  <Paper
                    key={achievement.id}
                    sx={{
                      padding: 2,
                      backgroundColor: '#222',
                      border: '1px solid #333',
                      opacity: achievement.completed ? 1 : 0.5
                    }}
                  >
                    <StyledTypography variant="h6" gutterBottom>
                      {achievement.title}
                    </StyledTypography>
                    <Typography variant="body2" color="text.secondary">
                      {achievement.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: achievement.completed ? '#00ff00' : '#666', marginTop: 1 }}
                    >
                      {achievement.completed ? 'Complété' : 'Non complété'}
                    </Typography>
                  </Paper>
                ))}
              </StyledBox>
            </StyledCard>
          </Grid>
        </Grid>
      </StyledBox>
    </StyledContainer>
  );
};

export default Profile;
