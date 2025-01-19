import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { BaseScene } from '../3d';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
}

const DDOSScene: React.FC = () => {
  const particlesRef = useRef<Particle[]>([]);
  const serverRef = useRef<THREE.Mesh>(null);
  const particleCount = 200;

  // Initialize particles
  useMemo(() => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        Math.random() * 10,
        (Math.random() - 0.5) * 20
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        -0.1 - Math.random() * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      life: Math.random()
    }));
  }, []);

  useFrame((state, delta) => {
    if (!serverRef.current) return;

    particlesRef.current.forEach((particle) => {
      // Update particle position
      particle.position.add(particle.velocity);
      particle.life -= delta * 0.5;

      // Reset particle if it's dead or too low
      if (particle.life <= 0 || particle.position.y <= 0) {
        particle.position.set(
          (Math.random() - 0.5) * 20,
          10,
          (Math.random() - 0.5) * 20
        );
        particle.life = 1;
      }

      // Add attraction to server
      const directionToServer = serverRef.current!.position
        .clone()
        .sub(particle.position)
        .normalize();
      particle.velocity.add(directionToServer.multiplyScalar(0.01));
    });
  });

  return (
    <BaseScene cameraPosition={[0, 10, 20]} environmentPreset="night">
      {/* Server Model */}
      <mesh 
        ref={serverRef} 
        position={[0, 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 4, 2]} />
        <meshStandardMaterial 
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Network Particles */}
      <Instances limit={particleCount}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
        {particlesRef.current.map((particle, i) => (
          <Instance 
            key={i} 
            position={particle.position} 
            scale={particle.life}
          />
        ))}
      </Instances>

      {/* Ground */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#111"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </BaseScene>
  );
};

export default DDOSScene; 