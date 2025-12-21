import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleWave(props: any) {
  const ref = useRef<THREE.Points>(null!)

  const count = 2000
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = time / 15
      ref.current.rotation.y = time / 20

      const mouseX = state.mouse.x * 0.5
      const mouseY = state.mouse.y * 0.5

      ref.current.rotation.x += (mouseY - ref.current.rotation.x) * 0.05
      ref.current.rotation.y += (mouseX - ref.current.rotation.y) * 0.05
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#2563EB"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  )
}

export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleWave />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-80" />
    </div>
  )
}
