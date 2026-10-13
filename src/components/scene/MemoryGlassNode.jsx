import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import * as THREE from 'three'

const GLASS_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`

const GLASS_FRAGMENT = `
  uniform sampler2D uPoster;
  uniform sampler2D uVideo;
  uniform float uPosterAspect;
  uniform float uVideoAspect;
  uniform vec2 uFocus;
  uniform vec2 uPointer;
  uniform vec3 uTint;
  uniform float uTime;
  uniform float uActive;
  uniform float uOpacity;
  uniform float uVideoMix;
  uniform float uHasVideo;
  uniform float uPortrait;
  varying vec2 vUv;
  vec2 mediaUV(vec2 uv, float aspect) {
    vec2 crop = aspect > 1. ? vec2(1. / aspect, 1.) : vec2(1., aspect);
    vec2 focus = clamp(uFocus, crop * .5, 1. - crop * .5);
    return clamp((uv - .5) * crop + focus, vec2(.001), vec2(.999));
  }
  void main() {
    vec2 p = (vUv - .5) * 2.;
    float radius = length(p);
    if (radius > 1.) discard;
    float dome = sqrt(max(0., 1. - radius * radius));
    vec3 normal = normalize(vec3(p, dome));
    float fresnel = pow(1. - dome, 2.3);
    float drift = sin(uTime * .18) * .055;
    vec3 light = normalize(vec3(-.42 + drift + uPointer.x * .25, .68 + uPointer.y * .2, .74));
    float shine = pow(max(0., dot(normal, light)), 35.);
    float streak = exp(-pow(p.x * .85 + p.y * .4 + .44 + drift, 2.) * 260.);
    streak *= smoothstep(.55, .95, radius);
    vec2 lensUV = vUv + p * radius * radius * mix(.007, .001, uPortrait);
    lensUV += vec2(sin(uTime * .095), cos(uTime * .075)) * .008 * (1. - uPortrait);
    vec4 poster = texture2D(uPoster, mediaUV(lensUV, uPosterAspect));
    vec4 moving = texture2D(uVideo, mediaUV(lensUV, uVideoAspect));
    if (uHasVideo > .5) moving = sRGBTransferEOTF(moving);
    vec4 content = mix(poster, moving, uVideoMix);
    float glassEdge = smoothstep(.84, .99, radius);
    vec3 glass = mix(content.rgb, uTint * .22, glassEdge * .32);
    glass += uTint * fresnel * (.19 + uActive * .12);
    glass += vec3(.85, .96, 1.) * (shine * .17 + streak * .11);
    float rim = exp(-pow(radius - .973, 2.) * 5000.);
    glass += mix(uTint, vec3(.9, .98, 1.), .35) * rim * (.2 + uActive * .14);
    float alpha = (1. - smoothstep(.978, 1., radius)) * uOpacity;
    alpha *= mix(max(content.a, .25), .74, glassEdge * .55);
    gl_FragColor = vec4(glass, alpha);
    #include <colorspace_fragment>
  }
`

// Clips never block scene readiness. Resource/autoplay failures keep the poster.
function useMemoryVideo(videoSource, reducedMotion) {
  const videoRef = useRef(null)
  const textureRef = useRef(null)
  const attempted = useRef(false)
  const failure = useRef(null)
  const documentVisible = useRef(document.visibilityState !== 'hidden')
  const [media, setMedia] = useState(null)
  const source = typeof videoSource === 'string' ? videoSource : videoSource?.src
  useEffect(() => {
    const visibility = () => {
      documentVisible.current = document.visibilityState !== 'hidden'
      if (!documentVisible.current) videoRef.current?.pause()
    }
    document.addEventListener('visibilitychange', visibility)
    return () => document.removeEventListener('visibilitychange', visibility)
  }, [])
  useEffect(() => {
    setMedia(null)
    failure.current = null
    attempted.current = false
    if (!source || reducedMotion) return
    let cancelled = false
    const video = document.createElement('video')
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.preload = 'none'
    video.setAttribute('playsinline', '')
    if (/^https?:\/\//i.test(source) && new URL(source).origin !== location.origin) video.crossOrigin = 'anonymous'
    videoRef.current = video
    const loaded = () => {
      if (cancelled || textureRef.current) return
      const texture = new THREE.VideoTexture(video)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false
      textureRef.current = texture
      setMedia({ texture, aspect: (video.videoWidth || 1) / (video.videoHeight || 1) })
    }
    const failed = () => {
      failure.current = 'resource'
      video.pause()
      if (!cancelled) setMedia(null)
      textureRef.current?.dispose()
      textureRef.current = null
    }
    video.addEventListener('loadeddata', loaded)
    video.addEventListener('error', failed)
    video.src = source
    return () => {
      cancelled = true
      video.removeEventListener('loadeddata', loaded)
      video.removeEventListener('error', failed)
      video.pause()
      video.removeAttribute('src')
      video.load()
      if (videoRef.current === video) videoRef.current = null
      textureRef.current?.dispose()
      textureRef.current = null
    }
  }, [source, reducedMotion])
  const play = (gesture = false) => {
    const video = videoRef.current
    if (!video || !documentVisible.current || failure.current === 'resource') return
    if (gesture && failure.current === 'blocked') { failure.current = null; attempted.current = false }
    if (failure.current || attempted.current || !video.paused) return
    attempted.current = true
    video.play().then(() => { if (videoRef.current === video) attempted.current = false }).catch(() => { if (videoRef.current === video) { attempted.current = false; failure.current = 'blocked' } })
  }
  return { media, videoRef, documentVisible, play, source }
}

export default function MemoryGlassNode({ node, texture, selected, hovered, highlighted, muted, covered = false, onSelect, onHover, reducedMotion }) {
  const group = useRef(null)
  const glow = useRef(null)
  const glass = useRef(null)
  const ripple = useRef(null)
  const rippleMaterial = useRef(null)
  const label = useRef(null)
  const rippleAt = useRef(-100)
  const previousSelected = useRef(false)
  const projected = useMemo(() => new THREE.Vector3(), [])
  const hoverPoint = useMemo(() => new THREE.Vector2(), [])
  const { clock } = useThree()
  const portrait = node.kind === 'journey' || node.id === 'journey'
  const active = selected || hovered || highlighted
  const video = useMemoryVideo(node.video, reducedMotion)
  const posterAspect = (texture.image?.width || 1) / (texture.image?.height || 1)
  const focusX = node.mediaFocus?.[0] ?? 0.5
  const focusY = node.mediaFocus?.[1] ?? 0.5
  const uniforms = useMemo(() => ({
    uPoster: { value: texture }, uVideo: { value: texture },
    uPosterAspect: { value: posterAspect }, uVideoAspect: { value: posterAspect },
    uFocus: { value: new THREE.Vector2(focusX, focusY) }, uPointer: { value: new THREE.Vector2() },
    uTint: { value: new THREE.Color(node.color) }, uTime: { value: 0 },
    uActive: { value: 0 }, uOpacity: { value: 1 }, uVideoMix: { value: 0 }, uHasVideo: { value: 0 }, uPortrait: { value: portrait ? 1 : 0 },
  }), [texture, posterAspect, focusX, focusY, node.color, portrait])
  useEffect(() => { texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true }, [texture])
  useEffect(() => {
    if (selected && !previousSelected.current) rippleAt.current = clock.elapsedTime
    previousSelected.current = selected
  }, [selected, clock])
  useFrame(({ clock: frameClock, camera }, delta) => {
    if (!group.current) return
    const t = frameClock.elapsedTime
    // The portrait remains at the exact tendril nexus; its light alone breathes.
    group.current.position.y = node.position[1] + (reducedMotion || portrait ? 0 : Math.sin(t * 0.32 + node.index * 1.3) * node.radius * 0.045)
    const targetScale = selected || hovered || (highlighted && !reducedMotion) ? 1.045 : 1
    group.current.scale.setScalar(reducedMotion ? targetScale : THREE.MathUtils.damp(group.current.scale.x, targetScale, 4, delta))
    if (glow.current) glow.current.opacity = active ? 0.095 : reducedMotion ? 0.018 : 0.024 + Math.sin(t * 0.6 + node.index) * 0.007
    group.current.getWorldPosition(projected)
    projected.project(camera)
    const visible = Math.abs(projected.x) < 1.12 && Math.abs(projected.y) < 1.12 && projected.z < 1
    const mayPlay = visible && !covered && !muted && !reducedMotion && video.documentVisible.current
    if (mayPlay) video.play()
    else if (video.videoRef.current && !video.videoRef.current.paused) video.videoRef.current.pause()
    const showVideo = Boolean(mayPlay && video.media && !video.videoRef.current?.paused)
    if (glass.current) {
      const values = glass.current.uniforms
      values.uTime.value = reducedMotion ? 0 : t + node.index * 1.7
      values.uPointer.value.set(reducedMotion || !hovered ? 0 : hoverPoint.x, reducedMotion || !hovered ? 0 : hoverPoint.y)
      values.uActive.value = reducedMotion ? active ? 1 : 0 : THREE.MathUtils.damp(values.uActive.value, active ? 1 : 0, 4, delta)
      values.uOpacity.value = reducedMotion ? muted ? 0.3 : 1 : THREE.MathUtils.damp(values.uOpacity.value, muted ? 0.3 : 1, 4, delta)
      values.uVideo.value = video.media?.texture ?? texture
      values.uHasVideo.value = video.media?.texture ? 1 : 0
      values.uVideoAspect.value = video.media?.aspect ?? posterAspect
      values.uVideoMix.value = reducedMotion ? 0 : THREE.MathUtils.damp(values.uVideoMix.value, showVideo ? 1 : 0, 6, delta)
    }
    if (label.current) {
      const previewType = showVideo ? 'video' : 'image'
      const mediaSource = showVideo ? video.source : node.image
      if (label.current.dataset.previewType !== previewType) label.current.dataset.previewType = previewType
      if (label.current.dataset.mediaSource !== mediaSource) label.current.dataset.mediaSource = mediaSource
    }
    if (ripple.current && rippleMaterial.current) {
      const phase = (t - rippleAt.current) / 0.9
      const visibleRipple = !reducedMotion && phase >= 0 && phase < 1
      ripple.current.visible = visibleRipple
      if (visibleRipple) { ripple.current.scale.setScalar(1 + phase * 0.48); rippleMaterial.current.opacity = (1 - phase) * 0.38 }
    }
  })
  const select = (event) => { event.stopPropagation(); rippleAt.current = clock.elapsedTime; if (!reducedMotion) video.play(true); onSelect?.(node.id) }
  const beginHover = (event) => { event.stopPropagation(); if (!hovered) rippleAt.current = clock.elapsedTime; onHover(node.id) }
  const moveLight = (event) => { if (event.uv) hoverPoint.set((event.uv.x - 0.5) * 2, (event.uv.y - 0.5) * 2) }
  const endHover = () => { hoverPoint.set(0, 0); onHover(null) }
  const focus = () => { rippleAt.current = clock.elapsedTime; onHover(node.id) }
  return (
    <group ref={group} position={node.position}>
      <mesh raycast={() => null}><sphereGeometry args={[node.radius * 1.11, 24, 16]} /><meshBasicMaterial ref={glow} color={node.color} transparent opacity={0.024} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></mesh>
      <Billboard>
        <mesh onClick={select} onPointerOver={beginHover} onPointerMove={moveLight} onPointerOut={endHover}>
          <planeGeometry args={[node.radius * 2, node.radius * 2]} />
          <shaderMaterial ref={glass} uniforms={uniforms} vertexShader={GLASS_VERTEX} fragmentShader={GLASS_FRAGMENT} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh raycast={() => null}><ringGeometry args={[node.radius * 1.017, node.radius * 1.025, 64]} /><meshBasicMaterial color={node.color} transparent opacity={active ? 0.65 : 0.19} depthWrite={false} toneMapped={false} /></mesh>
        <mesh ref={ripple} visible={false} raycast={() => null}><ringGeometry args={[node.radius * 1.07, node.radius * 1.083, 48]} /><meshBasicMaterial ref={rippleMaterial} color={node.color} transparent opacity={0} depthWrite={false} toneMapped={false} /></mesh>
      </Billboard>
      <Html center position={[0, -node.radius * 1.2, 0.06]} zIndexRange={[25, 15]} style={{ pointerEvents: 'auto', opacity: muted ? 0.16 : 1, transition: reducedMotion ? 'none' : 'opacity 220ms ease' }}>
        <button ref={label} type="button" className={`pf-node ${selected ? 'is-selected' : ''} ${highlighted ? 'is-pulsed' : ''} ${muted ? 'is-muted' : ''}`} data-kind={node.kind} data-preview-type="image" data-media-source={node.image} aria-label={`${node.title} — ${portrait ? 'my journey and experience' : 'project case study'}`} aria-pressed={selected} onClick={select} onFocus={focus} onBlur={endHover} onPointerOver={beginHover} onPointerOut={endHover} style={{ '--pf-node-color': node.color, '--node-color': node.color, minWidth: node.compact ? portrait ? 92 : 100 : portrait ? 108 : 145, maxWidth: node.compact ? 126 : 230, whiteSpace: node.compact ? 'normal' : 'nowrap' }}>
          <span className="pf-node-label">{node.title}</span><small className="pf-node-kind">{portrait && node.compact ? 'My journey' : node.label || (portrait ? 'My journey & experience' : node.id === 'causeconnect' ? 'ACS team project' : 'Explore project')}</small>
        </button>
      </Html>
    </group>
  )
}
