import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Box, Sphere, Torus, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

type ThreatType = 'PASSWORD' | 'SQL_INJECTION' | 'XSS' | 'PHISHING' | 'DDOS' | 'RANSOMWARE' | 'default';

interface Scene3DProps {
  threatType: string;
}

const Scene3D: React.FC<Scene3DProps> = ({ threatType }) => {
  const meshRef = useRef<Mesh>(null);
  const particlesRef = useRef<Mesh[]>([]);
  
  // Create floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: new Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      ),
      scale: Math.random() * 0.2 + 0.1,
      rotation: Math.random() * Math.PI
    }));
  }, []);

  // Memoize materials to prevent unnecessary recreations
  const materials = useMemo(() => ({
    PASSWORD: new MeshStandardMaterial({
      color: '#00ff00',
      wireframe: true,
      emissive: '#00ff00',
      emissiveIntensity: 0.5,
    }),
    SQL_INJECTION: new MeshStandardMaterial({
      color: '#ff0000',
      wireframe: true,
      emissive: '#ff0000',
      emissiveIntensity: 0.5,
    }),
    XSS: new MeshStandardMaterial({
      color: '#0000ff',
      wireframe: true,
      emissive: '#0000ff',
      emissiveIntensity: 0.5,
    }),
    PHISHING: new MeshStandardMaterial({
      color: '#ff00ff',
      wireframe: true,
      emissive: '#ff00ff',
      emissiveIntensity: 0.5,
    }),
    DDOS: new MeshStandardMaterial({
      color: '#ffff00',
      wireframe: true,
      emissive: '#ffff00',
      emissiveIntensity: 0.5,
    }),
    RANSOMWARE: new MeshStandardMaterial({
      color: '#00ffff',
      wireframe: true,
      emissive: '#00ffff',
      emissiveIntensity: 0.5,
    }),
    default: new MeshStandardMaterial({
      color: '#ffffff',
      wireframe: true,
      emissive: '#ffffff',
      emissiveIntensity: 0.5,
    }),
  }), []);

  // Animation springs
  const { rotation } = useSpring({
    from: { rotation: [0, 0, 0] },
    to: { rotation: [Math.PI * 2, Math.PI * 2, 0] },
    loop: true,
    config: { duration: 10000 },
  });

  // Animate particles
  useFrame((state, delta) => {
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        particle.position.y += Math.sin(state.clock.elapsedTime + i) * delta * 0.2;
        particle.rotation.x += delta * 0.2;
        particle.rotation.y += delta * 0.1;
      }
    });
  });

  // Get the appropriate geometry based on threat type
  const Geometry = useMemo(() => {
    const validType = (threatType.toUpperCase() as ThreatType) || 'default';
    switch (validType) {
      case 'PASSWORD':
        return Box;
      case 'SQL_INJECTION':
        return Sphere;
      case 'XSS':
        return Torus;
      case 'PHISHING':
        return Box;
      case 'DDOS':
        return Sphere;
      case 'RANSOMWARE':
        return Torus;
      default:
        return Box;
    }
  }, [threatType]);

  const getMaterial = (type: string) => {
    const validType = (type.toUpperCase() as ThreatType) || 'default';
    return materials[validType] || materials.default;
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Main threat object */}
      <animated.group rotation={rotation as any} position={[0, 2, 0]}>
        <Geometry
          ref={meshRef}
          args={[1, 1, 1]}
          scale={2}
        >
          <meshStandardMaterial
            {...getMaterial(threatType)}
          />
        </Geometry>
      </animated.group>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <mesh
          key={i}
          ref={(el) => (particlesRef.current[i] = el as Mesh)}
          position={particle.position}
          scale={particle.scale}
          rotation-x={particle.rotation}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={getMaterial(threatType).color}
            emissive={getMaterial(threatType).emissive}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
        />
        <Noise opacity={0.02} blendFunction={BlendFunction.ADD} />
      </EffectComposer>
    </>
  );
};

export default Scene3D;
