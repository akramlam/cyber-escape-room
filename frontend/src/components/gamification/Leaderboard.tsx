import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { LeaderboardEntry } from '../../types';
import { StyledBox } from '../StyledComponents';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <StyledBox>
      <Typography variant="h6" gutterBottom>
        Leaderboard
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.username}</TableCell>
              <TableCell align="right">{entry.score}</TableCell>
              <TableCell align="right">{entry.completionTime}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledBox>
  );
};

export default Leaderboard; 