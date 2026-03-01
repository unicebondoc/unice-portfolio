import { Suspense, useEffect } from 'react'
import OrbLabels from './components/ui/OrbLabel'
import ProjectModal from './components/ui/ProjectModal'
import HUD from './components/ui/HUD'
import ChatBot from './components/ui/ChatBot'
import { Canvas, useThree } from '@react-three/fiber'
import { MEMORIES } from './data/memories'
import MemoryOrb from './components/scene/MemoryOrb'
import Particles from './components/scene/Particles'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import useStore from './hooks/useStore'

// ── Responsive camera FOV ────────────────────────────────────────
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.fov = size.width < 768 ? 72 : 50
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

// ── Per-orb tinted point lights ──────────────────────────────────
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

// ── Loading overlay ───────────────────────────────────────────────
function LoadingScreen({ visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#060914',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 1.1s ease',
      }}
    >
      <div className="loading-orb" />
      <p
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 10,
          color: 'rgba(232, 234, 240, 0.35)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        Loading Memories
      </p>
    </div>
  )
}

export default function App() {
  const sceneReady    = useStore((s) => s.sceneReady)
  const setSceneReady = useStore((s) => s.setSceneReady)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* ── 3D Canvas ─────────────────────────────────────────── */}
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#060914', position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <SceneReadyNotifier />
          <CameraRig />
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

          {MEMORIES.map((memory, i) => (
            <MemoryOrb key={memory.id} memory={memory} index={i} />
          ))}

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

      {/* ── HTML overlays ─────────────────────────────────────── */}
      <HUD />
      <ProjectModal />
      <ChatBot />

      {/* ── Loading screen ────────────────────────────────────── */}
      <LoadingScreen visible={!sceneReady} />
    </div>
  )
}
