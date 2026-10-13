import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { memoryMediaFrame } from './memoryMediaFrame'

const MEDIA_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`
const MEDIA_FRAGMENT = `
  uniform sampler2D uPoster;
  uniform sampler2D uVideo;
  uniform vec2 uPosterHalfSize;
  uniform vec2 uVideoHalfSize;
  uniform float uVideoMix;
  uniform float uHasVideo;
  uniform float uBrightness;
  uniform vec3 uTint;
  varying vec2 vUv;
  vec4 completeFrame(sampler2D source, vec2 p, vec2 halfSize, bool video) {
    if (all(lessThanEqual(abs(p), halfSize))) {
      // All four original corners remain visible. There is no lens warp,
      // focus offset, zoom or aspect-fill crop on project media.
      vec4 content = texture2D(source, p / (2. * halfSize) + .5);
      if (video) content = sRGBTransferEOTF(content);
      return vec4(content.rgb, 1.);
    }
    if (all(lessThanEqual(abs(p), halfSize + .015))) return vec4(mix(vec3(.025, .07, .085), uTint, .22), 1.);
    return vec4(0.);
  }
  void main() {
    vec2 p = (vUv - .5) * 2.;
    vec4 poster = completeFrame(uPoster, p, uPosterHalfSize, false);
    vec4 moving = completeFrame(uVideo, p, uVideoHalfSize, true);
    float blend = uVideoMix * uHasVideo;
    float coverage = poster.a * (1. - blend) + moving.a * blend;
    if (coverage < .001) discard;
    vec3 backing = vec3(.008, .025, .035);
    vec3 color = mix(mix(backing, poster.rgb, poster.a), mix(backing, moving.rgb, moving.a), blend);
    // The transition remains opaque over branches, even for different aspects.
    gl_FragColor = vec4(color * uBrightness, 1.);
    #include <colorspace_fragment>
  }
`
const SHELL_VERTEX = `
  varying vec3 normalView;
  varying vec3 positionView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    positionView = mv.xyz;
    normalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`
const SHELL_FRAGMENT = `
  varying vec3 normalView;
  varying vec3 positionView;
  uniform vec3 uTint;
  uniform float uActive;
  uniform float uBrightness;
  void main() {
    vec3 n = normalize(normalView);
    vec3 v = normalize(-positionView);
    float edge = pow(1. - max(dot(n, v), 0.), 2.7);
    float shine = pow(max(dot(n, normalize(normalize(vec3(-.68, .82, 1.)) + v)), 0.), 80.);
    float second = pow(max(dot(n, normalize(normalize(vec3(.9, -.45, .45)) + v)), 0.), 130.);
    float streak = exp(-pow(n.x * .85 + n.y * .27 + .49, 2.) * 170.) * smoothstep(.1, .8, edge);
    vec3 color = uTint * (.15 + edge * .85) + vec3(.82, .98, 1.) * (shine * .85 + second * .25 + streak * .22);
    float alpha = clamp(.018 + edge * (.67 + uActive * .1) + shine * .38 + streak * .1, 0., .84);
    gl_FragColor = vec4(color * uBrightness, alpha);
    #include <colorspace_fragment>
  }
`

export default function ProjectMemoryVessel({ radius, uniforms, posterAspect, videoAspect, compact, reducedMotion, ...events }) {
  const media = useRef(null)
  const vessel = useRef(null)
  const orbit = useRef(null)
  const bowl = useRef(null)
  const ring = useRef(null)
  const poster = useMemo(() => memoryMediaFrame(posterAspect), [posterAspect])
  const moving = useMemo(() => memoryMediaFrame(videoAspect || posterAspect), [videoAspect, posterAspect])
  // Keep the uniform container stable: Three caches it after shader compilation.
  const mediaUniforms = useMemo(() => ({
    ...uniforms,
    uPosterHalfSize: { value: new THREE.Vector2() },
    uVideoHalfSize: { value: new THREE.Vector2() },
  }), [uniforms])
  useFrame((_, delta) => {
    if (!vessel.current) return
    // R3F keeps the mounted material across metadata updates. Update its
    // vectors directly when the video reveals a different source aspect.
    if (media.current) {
      media.current.uniforms.uPosterHalfSize.value.set(poster.halfWidth, poster.halfHeight)
      media.current.uniforms.uVideoHalfSize.value.set(moving.halfWidth, moving.halfHeight)
    }
    const pointer = uniforms.uPointer.value
    vessel.current.rotation.y = reducedMotion ? 0 : THREE.MathUtils.damp(vessel.current.rotation.y, pointer.x * .12, 4, delta)
    vessel.current.rotation.x = reducedMotion ? 0 : THREE.MathUtils.damp(vessel.current.rotation.x, -pointer.y * .08, 4, delta)
    orbit.current.rotation.z = -.4 + (reducedMotion ? 0 : Math.sin(uniforms.uTime.value * .2) * .08)
    if (ring.current) ring.current.color.copy(uniforms.uTint.value).multiplyScalar(uniforms.uBrightness.value * (.75 + uniforms.uActive.value * .25))
    if (bowl.current) bowl.current.color.set('#073847').multiplyScalar(uniforms.uBrightness.value)
  })
  return <group ref={vessel} {...events}>
    <mesh renderOrder={8} raycast={() => null}>
      <sphereGeometry args={[radius * .99, compact ? 32 : 48, compact ? 20 : 32]} />
      <meshBasicMaterial ref={bowl} color="#073847" transparent opacity={.46} side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
    <mesh position={[0, 0, radius * .05]} renderOrder={10}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <shaderMaterial ref={media} uniforms={mediaUniforms} vertexShader={MEDIA_VERTEX} fragmentShader={MEDIA_FRAGMENT} transparent depthWrite={false} toneMapped={false} />
    </mesh>
    <mesh renderOrder={20}>
      <sphereGeometry args={[radius, compact ? 32 : 48, compact ? 20 : 32]} />
      <shaderMaterial uniforms={uniforms} vertexShader={SHELL_VERTEX} fragmentShader={SHELL_FRAGMENT} transparent depthWrite={false} side={THREE.FrontSide} toneMapped={false} />
    </mesh>
    <group ref={orbit} rotation={[.9, -.25, -.4]}>
      <mesh renderOrder={9} raycast={() => null}>
        <torusGeometry args={[radius * 1.115, radius * .007, 6, compact ? 48 : 64, Math.PI * 1.7]} />
        <meshBasicMaterial ref={ring} color={uniforms.uTint.value} transparent opacity={.7} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[radius * 1.115, 0, 0]} renderOrder={22} raycast={() => null}>
        <sphereGeometry args={[radius * .018, 8, 6]} />
        <meshBasicMaterial color="#ddfff3" transparent opacity={.8} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  </group>
}
