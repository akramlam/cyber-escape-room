import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  StyledContainer,
  StyledBox,
  StyledTypography,
  StyledButton
} from './StyledComponents';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Pour le moment, on simule le login
      if (username && password) {
        await login(username, password);
        navigate('/');
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledBox
        component={Paper}
        sx={{
          padding: 3,
          backgroundColor: '#111',
          border: '1px solid #333',
          marginTop: 8
        }}
      >
        <StyledTypography variant="h4" gutterBottom>
          Connexion
        </StyledTypography>

        <form onSubmit={handleSubmit}>
          <StyledBox sx={{ gap: 2 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222',
                  '& fieldset': {
                    borderColor: '#333'
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ff00'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#00ff00'
                }
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#222',
                  '& fieldset': {
                    borderColor: '#333'
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ff00'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#00ff00'
                }
              }}
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
              sx={{
                marginTop: 2,
                backgroundColor: '#00ff00',
                color: '#000',
                '&:hover': {
                  backgroundColor: '#00cc00'
                }
              }}
            >
              Se connecter
            </StyledButton>

            <StyledButton
              variant="text"
              fullWidth
              onClick={() => navigate('/register')}
              sx={{ marginTop: 1 }}
            >
              Créer un compte
            </StyledButton>
          </StyledBox>
        </form>
      </StyledBox>
    </StyledContainer>
  );
};

export default Login;
