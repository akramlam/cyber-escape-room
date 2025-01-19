import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  StyledTypography,
  StyledButton,
  StyledBox
} from './StyledComponents';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
      <Toolbar>
        <StyledTypography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          CyberEscape Room
        </StyledTypography>
        <StyledBox sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <StyledButton onClick={() => navigate('/profile')}>
                Profile
              </StyledButton>
              <StyledButton onClick={handleLogout}>
                Logout
              </StyledButton>
            </>
          ) : (
            <StyledButton onClick={() => navigate('/login')}>
              Login
            </StyledButton>
          )}
        </StyledBox>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;