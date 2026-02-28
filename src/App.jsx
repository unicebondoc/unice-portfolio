import { Suspense } from 'react'
import Scene from './components/scene/Scene'
import OrbLabels from './components/ui/OrbLabel'
import ProjectModal from './components/ui/ProjectModal'
import HUD from './components/ui/HUD'
import { Canvas } from '@react-three/fiber'
import { MEMORIES } from './data/memories'
import MemoryOrb from './components/scene/MemoryOrb'
import Particles from './components/scene/Particles'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import useStore from './hooks/useStore'

/**
 * App — root component.
 *
 * Composes the full-screen 3D canvas (Scene) with HTML UI overlays.
 * The OrbLabels live inside the Canvas via <Html>; everything else
 * sits in normal DOM above the canvas.
 */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#b0c8ff" />
      <pointLight position={[0, -4, -8]} intensity={0.6} color="#1a2060" />
      {MEMORIES.map((m) => (
        <pointLight
          key={m.id}
          position={[m.position[0], m.position[1], m.position[2] + 0.5]}
          intensity={0.8}
          distance={4}
          color={m.color}
        />
      ))}
    </>
  )
}

export default function App() {
  const setSceneReady = useStore((s) => s.setSceneReady)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* ── 3D Canvas ────────────────────────────────────────── */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#060914', position: 'absolute', inset: 0 }}
        onCreated={() => setSceneReady()}
      >
        <Suspense fallback={null}>
          <Lights />

          <Stars
            radius={60}
            depth={50}
            count={3000}
            factor={3}
            saturation={0.4}
            fade
            speed={0.5}
          />

          <Particles />

          {MEMORIES.map((memory) => (
            <MemoryOrb key={memory.id} memory={memory} />
          ))}

          {/* HTML labels in 3D space */}
          <OrbLabels />

          <EffectComposer>
            <Bloom
              intensity={1.4}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>

          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={14}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={Math.PI * 0.65}
            minPolarAngle={Math.PI * 0.3}
          />
        </Suspense>
      </Canvas>

      {/* ── HTML Overlays ─────────────────────────────────────── */}
      <HUD />
      <ProjectModal />
    </div>
  )
}
