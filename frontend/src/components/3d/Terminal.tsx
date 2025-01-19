import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import { useSpring, animated } from '@react-spring/three'

interface TerminalProps {
  position: [number, number, number]
  onHover: (hover: boolean) => void
}

export const Terminal = ({ position, onHover }: TerminalProps) => {
  const mesh = useRef<Mesh>(null)
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)
  
  // Spring animations
  const { scale, glow } = useSpring({
    scale: hovered ? 1.1 : 1,
    glow: hovered ? 1 : 0.5,
    config: { mass: 1, tension: 280, friction: 60 }
  })

  // Floating animation
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.001
      mesh.current.rotation.y += 0.01
    }
  })

  const handlePointerOver = () => {
    setHovered(true)
    onHover(true)
  }

  const handlePointerOut = () => {
    setHovered(false)
    onHover(false)
  }

  return (
    <animated.group
      position={new Vector3(...position)}
      scale={scale}
    >
      <animated.mesh
        ref={mesh}
        onClick={() => setActive(!active)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        {/* Terminal Base */}
        <boxGeometry args={[1.5, 1, 0.8]} />
        <animated.meshStandardMaterial
          color="#202030"
          metalness={0.8}
          roughness={0.2}
          emissive="#00ff00"
          emissiveIntensity={glow}
        />

        {/* Screen */}
        <mesh position={[0, 0, 0.41]}>
          <planeGeometry args={[1.4, 0.9]} />
          <animated.meshStandardMaterial
            color="#000000"
            emissive="#001100"
            emissiveIntensity={glow}
          />
        </mesh>

        {/* Terminal Text */}
        <Text
          position={[0, 0, 0.42]}
          fontSize={0.05}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.3}
        >
          {active ? '> ACCESS GRANTED_' : '> READY_'}
        </Text>
      </animated.mesh>

      {active && (
        <Html position={[0, 1.2, 0]} center transform>
          <div style={{
            background: 'rgba(0, 20, 0, 0.9)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #00ff00',
            color: '#00ff00',
            width: '300px',
            fontFamily: 'monospace',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
          }}>
            <div style={{ marginBottom: '10px' }}>
              {'> TERMINAL ACTIVE'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              {'> SECURITY LEVEL: HIGH'}
            </div>
            <div>
              {'> ENTER COMMAND: _'}
            </div>
          </div>
        </Html>
      )}
    </animated.group>
  )
}
