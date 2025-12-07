'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

function GlassMesh({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Slow rotation, speeds up on hover
      const speed = hovered ? 1.5 : 0.3
      meshRef.current.rotation.x += delta * speed * 0.5
      meshRef.current.rotation.y += delta * speed
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={256}
          transmission={1}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          chromaticAberration={0.1}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          color="#FFA629"
        />
      </mesh>
    </Float>
  )
}

export function HeroScene() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <spotLight
          position={[-5, 5, -5]}
          intensity={0.5}
          angle={0.3}
          penumbra={1}
        />

        <GlassMesh hovered={hovered} />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
