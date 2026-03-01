import { Suspense, useEffect } from 'react'
import OrbLabels from './components/ui/OrbLabel'
import ProjectModal from './components/ui/ProjectModal'
import HUD from './components/ui/HUD'
import ChatBot from './components/ui/ChatBot'
import { Canvas, useThree } from '@react-three/fiber'
import { MEMORIES } from './data/memories'
import MemoryOrb from './components/scene/MemoryOrb'
import Particles from './components/scene/Particles'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import useStore from './hooks/useStore'

// ── Responsive camera FOV ────────────────────────────────────────
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.fov = size.width < 768 ? 72 : 52
    camera.updateProjectionMatrix()
  }, [camera, size.width])
  return null
}

// ── Fires setSceneReady after Suspense resolves ──────────────────
function SceneReadyNotifier() {
  const setSceneReady = useStore((s) => s.setSceneReady)
  useEffect(() => {
    const t = setTimeout(() => setSceneReady(), 80)
    return () => clearTimeout(t)
  }, [setSceneReady])
  return null
}

// ── Bioluminescent lighting ──────────────────────────────────────
function Lights() {
  return (
    <>
      {/* Very dim ambient — let the orbs do the lighting */}
      <ambientLight intensity={0.12} color="#0d1a2a" />

      {/* Warm amber bloom from above — like sunlight through water */}
      <pointLight position={[0, 14, 3]} intensity={0.25} color="#3a1e00" distance={30} />

      {/* Cool deep bioluminescent glow from below */}
      <pointLight position={[0, -10, -4]} intensity={0.40} color="#002a44" distance={28} />

      {/* Subtle teal rim from far back */}
      <pointLight position={[0, 2, -12]} intensity={0.30} color="#003322" distance={25} />

      {/* Per-orb colored point lights — stronger for core */}
      {MEMORIES.map((m) => (
        <pointLight
          key={m.id}
          position={[m.position[0], m.position[1], m.position[2] + 0.8]}
          intensity={m.tier === 'core' ? 1.4 : 0.5}
          distance={m.tier === 'core' ? 5.5 : 3.0}
          color={m.color}
        />
      ))}
    </>
  )
}

// ── Loading overlay ───────────────────────────────────────────────
function LoadingScreen({ visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#020811',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 1.2s ease',
      }}
    >
      <div className="loading-orb" />
      <p
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 10,
          color: 'rgba(232, 234, 240, 0.30)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Surfacing Memories
      </p>
    </div>
  )
}

export default function App() {
  const sceneReady = useStore((s) => s.sceneReady)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* ── 3D Canvas ─────────────────────────────────────────── */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 52 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#020811', position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <SceneReadyNotifier />
          <CameraRig />
          <Lights />

          {/* Bioluminescent particles — replaces cold Stars */}
          <Particles />

          {MEMORIES.map((memory, i) => (
            <MemoryOrb key={memory.id} memory={memory} index={i} />
          ))}

          <OrbLabels />

          <EffectComposer>
            <Bloom
              intensity={1.8}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
          </EffectComposer>

          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            enableDamping
            dampingFactor={0.06}
            maxPolarAngle={Math.PI * 0.68}
            minPolarAngle={Math.PI * 0.28}
          />
        </Suspense>
      </Canvas>

      {/* ── HTML overlays ─────────────────────────────────────── */}
      <HUD />
      <ProjectModal />
      <ChatBot />

      {/* ── Loading screen ────────────────────────────────────── */}
      <LoadingScreen visible={!sceneReady} />
    </div>
  )
}
