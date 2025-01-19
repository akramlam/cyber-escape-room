import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Mesh, Vector3 } from 'three'
import { useSpring, animated } from '@react-spring/three'

interface InteractiveProps {
  position: [number, number, number]
}

export const Interactive = ({ position }: InteractiveProps) => {
  const mesh = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  
  // Spring animation for hover effect
  const { scale } = useSpring({
    scale: hovered ? 1.2 : 1,
    config: { tension: 170, friction: 26 }
  })

  // Hover animation
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2
      mesh.current.rotation.y += 0.01
    }
  })

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <animated.mesh
      ref={mesh}
      position={new Vector3(...position)}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered ? '#ff0000' : '#00ff00'}
        metalness={0.5}
        roughness={0.5}
      />
      
      {active && (
        <Html position={[0, 1.5, 0]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            width: '200px',
            textAlign: 'center'
          }}>
            <h3>Security Challenge</h3>
            <p>Solve the puzzle to proceed</p>
          </div>
        </Html>
      )}
    </animated.mesh>
  )
}
