import { Suspense, useEffect, useRef } from 'react'
import OrbLabels from './components/ui/OrbLabel'
import ProjectModal from './components/ui/ProjectModal'
import HUD from './components/ui/HUD'
import ChatBot from './components/ui/ChatBot'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
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

// ── Animated caustic lights — simulate light through water ───────
function CausticLights() {
  const l1 = useRef()
  const l2 = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15
    if (l1.current) {
      l1.current.position.set(
        Math.sin(t)         * 7,
        Math.cos(t * 0.65)  * 5 + 4,
        Math.sin(t * 0.42)  * 4,
      )
    }
    if (l2.current) {
      l2.current.position.set(
        Math.cos(t * 0.80 + 2) * 6,
        Math.sin(t * 0.52)     * 4 - 3,
        Math.cos(t * 0.35)     * 5,
      )
    }
  })
  return (
    <>
      <pointLight ref={l1} color="#00AACC" intensity={0.10} distance={22} />
      <pointLight ref={l2} color="#003344" intensity={0.16} distance={24} />
    </>
  )
}

// ── Scene lighting ────────────────────────────────────────────────
function Lights() {
  return (
    <>
      {/* Very dim ambient — orbs light themselves */}
      <ambientLight intensity={0.10} color="#0a1520" />

      {/* Warm amber wash from above — filtered sunlight */}
      <pointLight position={[0, 14, 3]} intensity={0.18} color="#3a1e00" distance={30} />

      {/* Cool deep bioluminescent glow from below */}
      <pointLight position={[0, -10, -4]} intensity={0.28} color="#002a44" distance={28} />

      {/* Subtle teal rim from far back */}
      <pointLight position={[0, 2, -12]} intensity={0.22} color="#003322" distance={25} />

      {/* Animated caustic light shimmer */}
      <CausticLights />

      {/* Per-orb colored point lights — toned down 40% */}
      {MEMORIES.map((m) => (
        <pointLight
          key={m.id}
          position={[m.position[0], m.position[1], m.position[2] + 0.8]}
          intensity={m.tier === 'core' ? 0.8 : 0.22}
          distance={m.tier === 'core' ? 5.0 : 2.8}
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
              intensity={1.0}
              luminanceThreshold={0.10}
              luminanceSmoothing={0.90}
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
