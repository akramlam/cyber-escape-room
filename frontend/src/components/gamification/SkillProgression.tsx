import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserSkill } from '../../types';
import { StyledBox } from '../StyledComponents';

const StyledSkillBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface SkillProgressionProps {
  skills: UserSkill[];
}

const SkillProgression: React.FC<SkillProgressionProps> = ({ skills }) => {
  return (
    <StyledBox>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>
      {skills.map((skill) => (
        <StyledSkillBox key={skill.id}>
          <Typography variant="body2">
            {skill.name} - Level {skill.level}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(skill.experience / 100) * 100} 
            sx={{ mt: 1 }}
          />
        </StyledSkillBox>
      ))}
    </StyledBox>
  );
};

export default SkillProgression; 