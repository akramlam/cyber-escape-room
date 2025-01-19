import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Scene3DProps {
  threatType: string;
}

const Scene3D: React.FC<Scene3DProps> = ({ threatType }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const renderThreatGeometry = () => {
    switch (threatType) {
      case 'phishing':
        return (
          <group>
            <mesh ref={meshRef}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial 
                color="#00ff00" 
                wireframe 
                emissive="#00ff00"
                emissiveIntensity={0.5}
              />
            </mesh>
            <mesh position={[2, 0, 0]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial 
                color="#ff0000" 
                wireframe 
                emissive="#ff0000"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      case 'ransomware':
        return (
          <group>
            <mesh ref={meshRef}>
              <torusGeometry args={[1, 0.3, 16, 100]} />
              <meshStandardMaterial 
                color="#ff0000" 
                wireframe 
                emissive="#ff0000"
                emissiveIntensity={0.5}
              />
            </mesh>
          </group>
        );
      case 'ddos':
        return (
          <group>
            <mesh ref={meshRef}>
              <octahedronGeometry args={[1]} />
              <meshStandardMaterial 
                color="#0000ff" 
                wireframe 
                emissive="#0000ff"
                emissiveIntensity={0.5}
              />
            </mesh>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[
                Math.cos(i * Math.PI * 0.4) * 2,
                Math.sin(i * Math.PI * 0.4) * 2,
                0
              ]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                  color="#00ffff" 
                  wireframe 
                  emissive="#00ffff"
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        );
      default:
        return (
          <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color="#ffffff" 
              wireframe 
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {renderThreatGeometry()}
    </>
  );
};

export default Scene3D;
