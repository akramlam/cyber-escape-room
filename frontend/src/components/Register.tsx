import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import {
  StyledContainer,
  StyledBox,
  StyledTypography,
  StyledButton,
  StyledCard
} from './StyledComponents';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password
      });
      
      // Redirection vers la page de connexion après l'inscription réussie
      navigate('/login');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledBox sx={{ marginTop: 8 }}>
        <StyledCard>
          <StyledTypography variant="h4" gutterBottom className="title">
            Inscription
          </StyledTypography>

          <form onSubmit={handleSubmit}>
            <StyledBox sx={{ gap: 2 }}>
              <TextField
                fullWidth
                label="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                className="primary"
              >
                S'inscrire
              </StyledButton>

              <StyledButton
                variant="text"
                fullWidth
                className="secondary"
                onClick={() => navigate('/login')}
              >
                Déjà un compte ? Se connecter
              </StyledButton>
            </StyledBox>
          </form>
        </StyledCard>
      </StyledBox>
    </StyledContainer>
  );
};

export default Register;
