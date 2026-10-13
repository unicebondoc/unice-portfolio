import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import MemoryGlassNode from './MemoryGlassNode'

const CAMERA_Z = 8
const CAMERA_FOV = 60
const BACKGROUND = '/background-optimized.jpg'
const HEART_POSITION = [0, -0.22, -0.3]

// Positions are screen proportions, converted once to world coordinates for
// each viewport. They reserve the upper-left title and the lower navigation.
const DESKTOP_POSITIONS = {
  flatsync: [22, 39],
  landlit: [50, 28],
  'what-was-drawn': [77, 38],
  steeped: [22, 67],
  'princess-of-alemio': [62, 66],
  causeconnect: [83, 72],
  journey: [50, 52],
}
const TALL_POSITIONS = {
  flatsync: [22, 35],
  landlit: [53, 28],
  'what-was-drawn': [80, 40],
  steeped: [21, 60],
  'princess-of-alemio': [60, 65],
  causeconnect: [82, 73],
  journey: [50, 52],
}
const MOBILE_POSITIONS = {
  flatsync: [25, 36],
  landlit: [75, 36],
  'what-was-drawn': [20, 53],
  steeped: [80, 53],
  'princess-of-alemio': [25, 70],
  causeconnect: [75, 70],
  journey: [50, 52],
}

function getLayout(nodes, width, height) {
  const compact = width <= 700
  const tall = height > width * 1.05
  const positions = compact ? MOBILE_POSITIONS : tall ? TALL_POSITIONS : DESKTOP_POSITIONS
  const baseDiameter = compact
    ? Math.min(116, Math.max(76, width * 0.28), Math.max(76, height * 0.126))
    : Math.min(184, Math.max(112, width * 0.125))
  const halfAngle = THREE.MathUtils.degToRad(CAMERA_FOV / 2)
  return nodes.map((node, index) => {
    const screen = positions[node.id] ?? [25 + (index % 3) * 25, 35 + Math.floor(index / 3) * 24]
    const z = node.id === 'journey' ? HEART_POSITION[2] : -0.1 - (index % 3) * 0.12
    const worldHeight = 2 * Math.tan(halfAngle) * (CAMERA_Z - z)
    const worldWidth = worldHeight * width / height
    const radius = baseDiameter * (node.id === 'journey' ? 1.15 : 1) * worldHeight / height / 2
    return {
      ...node,
      index,
      compact,
      radius,
      screen,
      position: node.id === 'journey' ? HEART_POSITION : [(screen[0] / 100 - 0.5) * worldWidth, (0.5 - screen[1] / 100) * worldHeight, z],
    }
  })
}

class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error) { this.props.onError?.(error) }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function nodeAccessibleLabel(node) {
  return `${node.title} — ${node.kind === 'journey' || node.id === 'journey' ? 'my journey and experience' : 'project case study'}`
}

function NativeFallback({ nodes, selectedId, onSelect }) {
  return (
    <div className="pf-scene-fallback" role="group" aria-label="Portfolio memories" style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: '210px 24px 110px', background: `linear-gradient(180deg, #03101f55, #03101fc9), url(${BACKGROUND}) center / cover`, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', alignContent: 'center', gap: 14 }}>
      {nodes.map((node) => <button key={node.id} type="button" className="pf-node pf-node-fallback" aria-label={nodeAccessibleLabel(node)} aria-pressed={selectedId === node.id} onClick={() => onSelect?.(node.id)} style={{ '--node-color': node.color, minHeight: 150, padding: '12px 8px', border: `1px solid ${node.color || '#7eddf2'}80`, color: '#eef6ee', background: '#041321e6', fontFamily: 'Raleway, sans-serif', cursor: 'pointer', whiteSpace: 'normal' }}><img src={node.image} alt="" width="80" height="80" style={{ display: 'block', width: 80, height: 80, margin: '0 auto 8px', objectFit: 'contain', borderRadius: node.kind === 'journey' ? '50%' : 0 }} /><strong className="pf-node-label">{node.title}</strong><small className="pf-node-kind" style={{ display: 'block', marginTop: 5, color: '#bcd0d4', fontSize: 10 }}>{node.label || (node.kind === 'journey' ? 'My journey' : 'View project')}</small></button>)}
    </div>
  )
}

function Background({ texture, reducedMotion }) {
  const { scene, size } = useThree()
  const background = useMemo(() => {
    const copy = texture.clone()
    copy.colorSpace = THREE.SRGBColorSpace
    copy.needsUpdate = true
    return copy
  }, [texture])
  const baseOffset = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const canvasAspect = size.width / size.height
    const imageAspect = texture.image.width / texture.image.height
    if (canvasAspect > imageAspect) {
      background.repeat.set(1, imageAspect / canvasAspect)
      baseOffset.current.x = 0
      baseOffset.current.y = (1 - imageAspect / canvasAspect) / 2
    } else {
      background.repeat.set(canvasAspect / imageAspect, 1)
      baseOffset.current.x = (1 - canvasAspect / imageAspect) / 2
      baseOffset.current.y = 0
    }
    background.offset.set(baseOffset.current.x, baseOffset.current.y)
    scene.background = background
    return () => { if (scene.background === background) scene.background = null }
  }, [background, scene, size.width, size.height, texture])
  useEffect(() => () => background.dispose(), [background])
  useFrame(({ pointer }) => {
    if (reducedMotion || size.width <= 700) return
    const maxX = Math.min(0.003, baseOffset.current.x)
    const maxY = Math.min(0.003, baseOffset.current.y)
    background.offset.x = baseOffset.current.x - pointer.x * maxX
    background.offset.y = baseOffset.current.y - pointer.y * maxY
  })
  return null
}

function CameraMotion({ selected, reducedMotion }) {
  const { camera, invalidate, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  useEffect(() => {
    if (selected && size.width > 700 && !reducedMotion) {
      const distance = (CAMERA_Z - selected.position[2]) / 1.2
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2)) * distance
      const visibleWidth = visibleHeight * size.width / size.height
      // The journal occupies the right half. A parallel camera pan keeps the
      // selected memory at 20% screen width and 53% height in the open forest.
      target.set(selected.position[0] + visibleWidth * 0.3, selected.position[1] + visibleHeight * 0.03, selected.position[2] + distance)
    } else target.set(0, 0, CAMERA_Z)
    if (reducedMotion) {
      // No panning/zooming when reduced motion is requested.
      camera.position.set(0, 0, CAMERA_Z)
      look.set(0, 0, 0)
      camera.lookAt(look)
      invalidate()
    }
  }, [selected, reducedMotion, camera, invalidate, size.width, target, look])
  useFrame(({ pointer }, delta) => {
    if (reducedMotion) return
    const parallax = size.width <= 700 ? 0 : 0.018
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x + pointer.x * parallax, 2.5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y + pointer.y * parallax, 2.5, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, 2.5, delta)
    look.set(camera.position.x, camera.position.y, camera.position.z - CAMERA_Z)
    camera.lookAt(look)
  })
  return null
}

function StaticTendril({ node, active, reducedMotion, root }) {
  const dot = useRef(null)
  const destination = useMemo(() => new THREE.Vector3(...node.position), [node.position])
  const point = useMemo(() => new THREE.Vector3(), [])
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...root)
    const end = destination.clone()
    const mid = start.clone().add(end).multiplyScalar(0.5)
    mid.x += (node.position[0] < 0 ? -1 : 1) * Math.min(0.45, start.distanceTo(end) * 0.13)
    mid.y -= 0.16
    return new THREE.QuadraticBezierCurve3(start, mid, end)
  }, [destination, node.position, root])
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 30, 0.007, 4, false), [curve])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame(({ clock }) => {
    if (reducedMotion || !dot.current) return
    curve.getPoint((clock.elapsedTime * 0.12 + node.index * 0.11) % 1, point)
    dot.current.position.copy(point)
  })
  return (
    <group raycast={() => null}>
      {/* Transparent mesh origins do not describe the tube's full depth. Draw
          the entire branch pass before every orb instead of relying on z sort. */}
      <mesh geometry={geometry} renderOrder={-30}><meshBasicMaterial color={active ? node.color : '#acbdc6'} transparent opacity={active ? 0.8 : 0.18} depthWrite={false} toneMapped={false} /></mesh>
      {!reducedMotion && <mesh ref={dot} renderOrder={-29}><sphereGeometry args={[active ? 0.025 : 0.018, 8, 8]} /><meshBasicMaterial color={active ? node.color : '#d7edeb'} transparent opacity={active ? 0.8 : 0.37} depthWrite={false} toneMapped={false} /></mesh>}
    </group>
  )
}

const PARTICLE_VERTEX = `
  attribute float aPhase;
  attribute vec3 aTint;
  uniform float uTime;
  uniform float uPointSize;
  varying float vPhase;
  varying vec3 vTint;
  void main() {
    vPhase = aPhase; vTint = aTint;
    vec3 p = position;
    p.x += sin(uTime * .13 + aPhase) * .18;
    p.y += sin(uTime * .19 + aPhase * 1.3) * .24;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPointSize * (8. / max(-mv.z, 1.));
  }
`
const PARTICLE_FRAGMENT = `
  uniform float uTime;
  varying float vPhase;
  varying vec3 vTint;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    float glow = 1. - smoothstep(.06, .5, d);
    float pulse = .18 + .3 * (.5 + .5 * sin(uTime * .9 + vPhase));
    gl_FragColor = vec4(vTint, glow * pulse);
  }
`

function ForestParticles({ compact }) {
  const material = useRef(null)
  const { geometry, uniforms } = useMemo(() => {
    const count = compact ? 55 : 145
    const positions = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const colors = new Float32Array(count * 3)
    const palette = [[0.7, 0.4, 1], [0.25, 0.85, 1], [1, 0.8, 0.4]]
    for (let index = 0; index < count; index += 1) {
      // Deterministic low-discrepancy scattering; nothing jumps on selection.
      positions[index * 3] = (((index * 0.618034) % 1) - 0.5) * 17
      positions[index * 3 + 1] = (((index * 0.414214) % 1) - 0.5) * 14
      positions[index * 3 + 2] = -3 + ((index * 0.732051) % 1) * 5
      phases[index] = (index * 2.399963) % (Math.PI * 2)
      colors.set(palette[index % 3], index * 3)
    }
    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    buffer.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    buffer.setAttribute('aTint', new THREE.BufferAttribute(colors, 3))
    return { geometry: buffer, uniforms: { uTime: { value: 0 }, uPointSize: { value: compact ? 3 : 4 } } }
  }, [compact])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame(({ clock }) => { if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime })
  return <points geometry={geometry} renderOrder={-40} raycast={() => null}><shaderMaterial ref={material} uniforms={uniforms} vertexShader={PARTICLE_VERTEX} fragmentShader={PARTICLE_FRAGMENT} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></points>
}


function ContextGuard({ onFailure }) {
  const gl = useThree((state) => state.gl)
  const width = useThree((state) => state.size.width)
  const setDpr = useThree((state) => state.setDpr)
  useEffect(() => { setDpr(Math.min(window.devicePixelRatio || 1, width <= 700 ? 1.25 : 1.6)) }, [width, setDpr])
  useEffect(() => {
    const lost = (event) => { event.preventDefault(); onFailure(new Error('The WebGL context was lost. Accessible project controls are available.')) }
    gl.domElement.addEventListener('webglcontextlost', lost)
    return () => gl.domElement.removeEventListener('webglcontextlost', lost)
  }, [gl, onFailure])
  return null
}

function ForestContent({ nodes, selectedId, pulseId, journalOpen, onSelect, reducedMotion, onReady, onFailure }) {
  const { size } = useThree()
  const [hoveredId, setHoveredId] = useState(null)
  const paths = useMemo(() => [BACKGROUND, ...nodes.map((node) => node.image)], [nodes])
  const textures = useLoader(THREE.TextureLoader, paths)
  const placed = useMemo(() => getLayout(nodes, size.width, size.height), [nodes, size.width, size.height])
  const selected = placed.find((node) => node.id === selectedId)
  const root = HEART_POSITION
  const ready = useRef(false)
  const readyCallback = useRef(onReady)
  readyCallback.current = onReady
  useEffect(() => {
    if (!ready.current) {
      ready.current = true
      readyCallback.current?.()
    }
  }, [textures])
  return (
    <>
      <ContextGuard onFailure={onFailure} />
      <Background texture={textures[0]} reducedMotion={reducedMotion} />
      <CameraMotion selected={selected} reducedMotion={reducedMotion} />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 1, 3]} color={selected?.color ?? '#a4efff'} intensity={0.8} distance={14} decay={2} />
      {!reducedMotion && <ForestParticles compact={size.width <= 700} />}
      {placed.map((node, index) => (
        <group key={node.id}>
          {node.id !== 'journey' && <StaticTendril node={node} root={root} active={node.id === selectedId || node.id === hoveredId || node.id === pulseId} reducedMotion={reducedMotion} />}
          <MemoryGlassNode node={node} texture={textures[index + 1]} selected={node.id === selectedId} hovered={node.id === hoveredId} highlighted={node.id === pulseId} muted={Boolean(selectedId) && node.id !== selectedId} covered={Boolean(journalOpen) && size.width <= 700} onSelect={onSelect} onHover={setHoveredId} reducedMotion={reducedMotion} />
        </group>
      ))}
    </>
  )
}

export default function PortfolioForestScene({ nodes = [], selectedId, pulseId = null, journalOpen = false, onSelect, reducedMotion = false, onReady, onError }) {
  const [failed, setFailed] = useState(false)
  const errorReported = useRef(false)
  const errorCallback = useRef(onError)
  errorCallback.current = onError
  const reportFailure = useCallback((error) => {
    if (!errorReported.current) {
      errorReported.current = true
      errorCallback.current?.(error)
    }
    setFailed(true)
  }, [])
  const fallback = <NativeFallback nodes={nodes} selectedId={selectedId} onSelect={onSelect} />
  const compact = typeof window !== 'undefined' && window.innerWidth <= 700
  const createRenderer = useCallback((defaults) => {
    try {
      return new THREE.WebGLRenderer({ ...defaults, antialias: true, alpha: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false })
    } catch (error) {
      // A real context-creation failure, unlike Canvas's DOM fallback children
      // which React mounts even when a healthy WebGL canvas is rendering.
      reportFailure(error)
      throw error
    }
  }, [reportFailure])
  return (
    <div className="pf-forest-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: `url(${BACKGROUND}) center / cover` }}>
      {failed ? fallback : <SceneBoundary onError={reportFailure} fallback={fallback}>
        <Canvas
          camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV, near: 0.1, far: 60 }}
          dpr={compact ? [1, 1.25] : [1, 1.6]}
          frameloop={reducedMotion ? 'demand' : 'always'}
          gl={createRenderer}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
          fallback="Use Work, My journey or CV to explore this portfolio if your browser does not display the forest canvas."
          style={{ position: 'absolute', inset: 0, touchAction: 'manipulation' }}
        >
          <Suspense fallback={null}><ForestContent nodes={nodes} selectedId={selectedId} pulseId={pulseId} journalOpen={journalOpen} onSelect={onSelect} reducedMotion={reducedMotion} onReady={onReady} onFailure={reportFailure} /></Suspense>
        </Canvas>
      </SceneBoundary>}
    </div>
  )
}
