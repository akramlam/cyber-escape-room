import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Card, Button } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledSceneContainer = styled(Box)(({ theme }) => ({
  height: '400px',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}));

export const StyledChallengePanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledAnswerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const StyledSubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));

export const StyledHintButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.warning.main,
  color: theme.palette.warning.main,
  '&:hover': {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
}));
