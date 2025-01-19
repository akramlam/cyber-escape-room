import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Achievement } from '../../types';

interface RewardNotificationProps {
  achievement?: Achievement;
  open: boolean;
  onClose: () => void;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({ 
  achievement, 
  open, 
  onClose 
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {achievement ? (
          <>Achievement Unlocked: {achievement.name}!</>
        ) : (
          'New achievement unlocked!'
        )}
      </Alert>
    </Snackbar>
  );
};

export default RewardNotification; 