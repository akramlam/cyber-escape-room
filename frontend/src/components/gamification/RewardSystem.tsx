import React, { useState } from 'react';
import { Achievement } from '../../types';
import RewardNotification from './RewardNotification';

const RewardSystem: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | undefined>();

  const handleAchievement = async (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setOpen(true);
  };

  return (
    <RewardNotification 
      achievement={currentAchievement}
      open={open}
      onClose={() => setOpen(false)}
    />
  );
};

export default RewardSystem; 