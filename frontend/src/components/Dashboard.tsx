import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StyledContainer, StyledTypography } from './StyledComponents';
import ScenarioList from './scenarios/ScenarioList';
import SkillProgression from './gamification/SkillProgression';
import Leaderboard from './gamification/Leaderboard';
import { UserSkill, LeaderboardEntry, Scenario } from '../types';

const Dashboard: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Données de test en attendant que le backend soit opérationnel
    const mockScenarios = [
      {
        id: 1,
        title: "Attaque par Phishing",
        description: "Apprenez à identifier et à vous protéger contre les tentatives de phishing",
        threat_type: "phishing",
        difficulty: 1,
        time_limit: 1800
      },
      {
        id: 2,
        title: "Injection SQL",
        description: "Découvrez comment les attaquants exploitent les vulnérabilités SQL et comment s'en protéger",
        threat_type: "sql_injection",
        difficulty: 2,
        time_limit: 2400
      },
      {
        id: 3,
        title: "Attaque par Force Brute",
        description: "Comprenez les risques des mots de passe faibles et les méthodes de protection",
        threat_type: "brute_force",
        difficulty: 3,
        time_limit: 3000
      }
    ];
    setScenarios(mockScenarios);
    
    // Commenté temporairement
    /*const fetchScenarios = async () => {
      try {
        const response = await axios.get<Scenario[]>('http://localhost:8000/api/scenarios/');
        setScenarios(response.data);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };
    fetchScenarios();*/
  }, []);

  const getDifficultyColor = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return '#4caf50';
      case 2:
        return '#ff9800';
      case 3:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getDifficultyLabel = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Débutant';
      case 2:
        return 'Intermédiaire';
      case 3:
        return 'Avancé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <StyledTypography variant="h4" gutterBottom>
        Scénarios Disponibles
      </StyledTypography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ScenarioList scenarios={scenarios} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SkillProgression skills={userSkills} />
          <Leaderboard entries={leaderboard} />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Dashboard;