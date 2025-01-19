import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera, 
  Stars,
  useTexture,
  Sparkles,
  PointMaterial
} from '@react-three/drei'
import { Suspense, useState } from 'react'
import Room from './Room'
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2, Vector3 } from 'three'

const Scene = () => {
  const [cameraPosition] = useState(() => new Vector3(5, 3, 8))

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000011' }}>
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={cameraPosition}
            fov={75}
          />
          <OrbitControls 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minDistance={3}
            maxDistance={15}
            enableDamping
            dampingFactor={0.05}
          />
          
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight
            position={new Vector3(5, 8, 5)}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-near={0.1}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          {/* Accent Lights */}
          <pointLight position={new Vector3(-5, 2, -5)} intensity={0.5} color="#00ff00" />
          <pointLight position={new Vector3(5, 2, 5)} intensity={0.5} color="#0000ff" />
          
          {/* Environment and Atmosphere */}
          <Environment preset="night" />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade
          />
          <Sparkles 
            count={100}
            scale={10}
            size={1}
            speed={0.2}
            color="#00ff00"
          />
          
          {/* Main Room Component */}
          <Room />
          
          {/* Enhanced Post Processing */}
          <EffectComposer>
            <Bloom 
              intensity={1.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              blendFunction={BlendFunction.SCREEN}
            />
            <ChromaticAberration 
              offset={new Vector2(0.003, 0.003)}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0.5}
            />
            <DepthOfField 
              focusDistance={0}
              focalLength={0.02}
              bokehScale={2}
              height={480}
            />
            <Noise 
              opacity={0.02}
              blendFunction={BlendFunction.OVERLAY}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene;
