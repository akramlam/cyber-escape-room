import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Text, useGLTF, MeshWobbleMaterial, RoundedBox, Sphere } from '@react-three/drei'
import { Mesh, Group, Vector3 } from 'three'
import { Interactive } from './Interactive'
import { Terminal } from './Terminal'
import { useSpring, animated } from '@react-spring/three'

const Room = () => {
  const group = useRef<Group>(null)
  const [hoverTerminal, setHoverTerminal] = useState(false)
  
  // Floating animation for room elements
  const { floatY } = useSpring({
    floatY: hoverTerminal ? 0.2 : 0,
    config: { mass: 1, tension: 280, friction: 120 }
  })

  // Room ambient animation
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={group}>
      {/* Enhanced Floor with Grid Pattern */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[30, 30, 30, 30]} />
        <meshStandardMaterial 
          color="#101020"
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
          position={pos}
        >
          <MeshWobbleMaterial
            color="#202040"
            factor={0.2}
            speed={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
      ))}

      {/* Decorative Elements */}
      {Array.from({ length: 10 }).map((_, idx) => (
        <Sphere
          key={idx}
          args={[0.1, 16, 16]}
          position={[
            Math.sin(idx * Math.PI * 2 / 10) * 8,
            2 + Math.cos(idx * Math.PI * 2 / 10),
            Math.cos(idx * Math.PI * 2 / 10) * 8
          ]}
        >
          <meshStandardMaterial
            color={idx % 2 ? '#00ff00' : '#0000ff'}
            emissive={idx % 2 ? '#00ff00' : '#0000ff'}
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}

      {/* Interactive Elements */}
      <Interactive position={[2, 1, 0]} />
      <Terminal 
        position={[-2, 1, 2]} 
        onHover={setHoverTerminal}
      />
      
      {/* Holographic Text */}
      <Text
        position={[0, 3, -5]}
        rotation={[0, 0, 0]}
        fontSize={1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        lineHeight={1.5}
        font="/fonts/cyberpunk.ttf"
      >
        CyberEscape Room
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Text>

      {/* Data Streams */}
      {Array.from({ length: 20 }).map((_, idx) => (
        <animated.mesh
          key={idx}
          position-y={floatY}
          position-x={Math.sin(idx * Math.PI * 2 / 20) * 10}
          position-z={Math.cos(idx * Math.PI * 2 / 20) * 10}
        >
          <boxGeometry args={[0.05, 4, 0.05]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </animated.mesh>
      ))}
    </group>
  )
}

export default Room
