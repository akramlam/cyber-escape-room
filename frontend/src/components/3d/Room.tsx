import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, RoundedBox, Sphere } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';

interface RoomProps {
  threatType?: string;
  difficulty?: string;
}

const Room: React.FC<RoomProps> = ({ threatType = 'default', difficulty = 'beginner' }) => {
  const group = useRef<Group>(null);
  const [hoverTerminal, setHoverTerminal] = useState(false);
  
  // Room colors based on threat type
  const getRoomColors = () => {
    switch (threatType?.toUpperCase()) {
      case 'PASSWORD':
        return { primary: '#001f00', secondary: '#00ff00', accent: '#004400' };
      case 'SQL_INJECTION':
        return { primary: '#1f0000', secondary: '#ff0000', accent: '#440000' };
      case 'XSS':
        return { primary: '#00001f', secondary: '#0000ff', accent: '#000044' };
      case 'PHISHING':
        return { primary: '#1f001f', secondary: '#ff00ff', accent: '#440044' };
      case 'DDOS':
        return { primary: '#1f1f00', secondary: '#ffff00', accent: '#444400' };
      case 'RANSOMWARE':
        return { primary: '#001f1f', secondary: '#00ffff', accent: '#004444' };
      default:
        return { primary: '#101020', secondary: '#ffffff', accent: '#202040' };
    }
  };

  const colors = getRoomColors();

  // Room ambient animation
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      {/* Enhanced Floor with Grid Pattern */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial 
          color={colors.primary}
          wireframe
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Cyber-themed Walls */}
      {[[-15, 0, 0], [15, 0, 0], [0, 0, -15], [0, 0, 15]].map((pos, idx) => (
        <RoundedBox
          key={idx}
          args={[idx < 2 ? 0.5 : 30, 8, idx < 2 ? 30 : 0.5]}
          radius={0.1}
          smoothness={4}
          position={new Vector3(...pos)}
        >
          <meshStandardMaterial
            color={colors.accent}
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
      ))}

      {/* Decorative Elements */}
      {[...Array(10)].map((_, i) => (
        <Sphere
          key={i}
          args={[0.1, 8, 8]}
          position={[
            Math.sin(i * Math.PI * 0.2) * 8,
            Math.cos(i * Math.PI * 0.2) * 2 + 2,
            Math.cos(i * Math.PI * 0.2) * 8
          ]}
        >
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={0.5}
            wireframe
          />
        </Sphere>
      ))}

      {/* Difficulty Indicator */}
      <Text
        position={[0, 3.5, -14.5]}
        fontSize={1}
        color={colors.secondary}
        anchorX="center"
        anchorY="middle"
      >
        {difficulty.toUpperCase()}
      </Text>
    </group>
  );
};

export default Room;
