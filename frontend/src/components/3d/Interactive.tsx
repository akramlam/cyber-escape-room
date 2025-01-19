import React from 'react';
import { Box } from '@react-three/drei';

interface InteractiveProps {
  position: [number, number, number];
  onHover?: () => void;
  onBlur?: () => void;
  children?: React.ReactNode;
}

export const Interactive: React.FC<InteractiveProps> = ({ position, onHover, onBlur, children }) => {
  return (
    <group position={position}>
      <Box args={[1, 1, 1]} onPointerEnter={onHover} onPointerLeave={onBlur}>
        {children}
      </Box>
    </group>
  );
};
