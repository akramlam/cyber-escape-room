import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration 
} from '@react-three/postprocessing';
import { 
  PerspectiveCamera,
  OrbitControls,
  Environment,
  useHelper 
} from '@react-three/drei';
import * as THREE from 'three';

interface BaseSceneProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
}

const Scene: React.FC<BaseSceneProps> = ({ 
  children, 
  cameraPosition = [0, 5, 10],
  environmentPreset = 'city' 
}) => {
  return (
    <Canvas shadows gl={{ antialias: true }}>
      <PerspectiveCamera 
        makeDefault 
        position={cameraPosition} 
        fov={60}
      />
      <OrbitControls 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={20}
      />
      
      <Environment preset={environmentPreset} background blur={0.8} />
      
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {children}
      
      <EffectComposer>
        <Bloom 
          intensity={1.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.02}
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.002, 0.002)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene; 