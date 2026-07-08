import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Float, shaderMaterial } from '@react-three/drei'
import { useStore, THEMES } from '../store/useStore.js'

/* ------------------------------------------------------------------ */
/* Dither shader — ordered Bayer dithering over a drifting gradient    */
/* blob, giving the backdrop a handcrafted "risograph" texture (PRD    */
/* §4.1 Shader Effects).                                               */
/* ------------------------------------------------------------------ */

const DitherMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#d96f43'),
    uColorB: new THREE.Color('#f4eee2'),
    uOpacity: 0.32,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uOpacity;
    varying vec2 vUv;

    float bayer4(vec2 p) {
      int x = int(mod(p.x, 4.0));
      int y = int(mod(p.y, 4.0));
      int i = y * 4 + x;
      float m[16];
      m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
      m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
      m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
      m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
      for (int k = 0; k < 16; k++) { if (k == i) return m[k] / 16.0; }
      return 0.0;
    }

    void main() {
      vec2 uv = vUv;
      // Two slow-orbiting soft blobs
      vec2 c1 = vec2(0.72 + 0.12 * sin(uTime * 0.21), 0.6 + 0.12 * cos(uTime * 0.17));
      vec2 c2 = vec2(0.2 + 0.1 * cos(uTime * 0.13), 0.28 + 0.1 * sin(uTime * 0.19));
      float d = smoothstep(0.3, 0.0, distance(uv, c1)) * 0.55
              + smoothstep(0.24, 0.0, distance(uv, c2)) * 0.45;

      float threshold = bayer4(gl_FragCoord.xy / 2.0);
      float dithered = step(threshold + 0.15, d);

      vec3 color = mix(uColorB, uColorA, dithered);
      float alpha = dithered * uOpacity * smoothstep(0.0, 0.4, d);
      gl_FragColor = vec4(color, alpha);
    }
  `,
)

extend({ DitherMaterial })

function DitherBackdrop() {
  const mat = useRef()
  const target = useRef(new THREE.Color('#d96f43'))

  useFrame((state, delta) => {
    if (!mat.current) return
    mat.current.uTime += delta
    const { themeName, hoverColor } = useStore.getState()
    target.current.set(hoverColor || THEMES[themeName].accent)
    mat.current.uColorA.lerp(target.current, 0.04)
  })

  return (
    <mesh position={[0, 0, -6]} scale={[30, 18, 1]}>
      <planeGeometry />
      <ditherMaterial ref={mat} transparent depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Floating art tools — stylized pot, brush, ring, canting drop        */
/* ------------------------------------------------------------------ */

function usePotGeometry() {
  return useMemo(() => {
    const pts = []
    // Lathe profile of a rounded studio pot
    const profile = [
      [0.02, 0], [0.55, 0.02], [0.72, 0.25], [0.78, 0.6],
      [0.66, 0.95], [0.5, 1.15], [0.46, 1.3], [0.52, 1.42], [0.58, 1.48],
    ]
    for (const [x, y] of profile) pts.push(new THREE.Vector2(x, y))
    const geo = new THREE.LatheGeometry(pts, 40)
    geo.center()
    return geo
  }, [])
}

function ArtTools() {
  const group = useRef()
  const potGeo = usePotGeometry()
  const accentMat = useRef()
  const accent2Mat = useRef()
  const targetA = useRef(new THREE.Color())
  const targetB = useRef(new THREE.Color())

  useFrame((state, delta) => {
    const { pointer } = state
    const { themeName, scrollProgress } = useStore.getState()
    const theme = THEMES[themeName]

    if (group.current) {
      // Organic mouse-follow (PRD §5 Mouse Interaction) + scroll drift
      const targetY = pointer.x * 0.28
      const targetX = -pointer.y * 0.18 + scrollProgress * Math.PI * 1.6
      group.current.rotation.y += (targetY - group.current.rotation.y) * 2 * delta
      group.current.rotation.x += (targetX - group.current.rotation.x) * 2 * delta
      group.current.position.y = -scrollProgress * 1.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08
    }

    targetA.current.set(theme.accent)
    targetB.current.set(theme.accent2)
    if (accentMat.current) accentMat.current.color.lerp(targetA.current, 0.05)
    if (accent2Mat.current) accent2Mat.current.color.lerp(targetB.current, 0.05)
  })

  return (
    <group ref={group}>
      {/* Pot — the centerpiece, off to the right of the hero copy */}
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh geometry={potGeo} position={[3.1, 0.4, 0]} scale={1.25} rotation={[0.15, 0.4, -0.08]}>
          <meshStandardMaterial ref={accentMat} color="#d96f43" roughness={0.65} flatShading />
        </mesh>
      </Float>

      {/* Clay ring */}
      <Float speed={1.1} rotationIntensity={0.9} floatIntensity={1.2}>
        <mesh position={[-3.6, 1.6, -1.5]} rotation={[0.6, 0.2, 0.3]}>
          <torusGeometry args={[0.8, 0.26, 12, 40]} />
          <meshStandardMaterial ref={accent2Mat} color="#8a9a72" roughness={0.7} flatShading />
        </mesh>
      </Float>

      {/* Brush — handle + ferrule + bristles */}
      <Float speed={1.7} rotationIntensity={0.7} floatIntensity={1}>
        <group position={[-2.6, -1.7, -0.5]} rotation={[0.3, 0, -0.9]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.09, 0.13, 1.7, 10]} />
            <meshStandardMaterial color="#e8d9b8" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.14, 0.12, 0.4, 10]} />
            <meshStandardMaterial color="#8c7355" roughness={0.5} metalness={0.4} flatShading />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <coneGeometry args={[0.15, 0.55, 10]} />
            <meshStandardMaterial color="#c05f38" roughness={0.9} flatShading />
          </mesh>
        </group>
      </Float>

      {/* Canting drop — nod to batik */}
      <Float speed={2} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={[2.4, -2.1, -1.8]} rotation={[0.4, 0.8, 0]}>
          <torusKnotGeometry args={[0.42, 0.13, 80, 10, 2, 3]} />
          <meshStandardMaterial color="#b0722a" roughness={0.6} flatShading />
        </mesh>
      </Float>

      {/* Pebble accents */}
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.1}>
        <mesh position={[4.6, 2.4, -2.5]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#c9b8a6" roughness={0.9} flatShading />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={1}>
        <mesh position={[-4.9, -0.4, -2.2]}>
          <dodecahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#d9c6a3" roughness={0.9} flatShading />
        </mesh>
      </Float>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Particles — ambient drift + burst impulse on category hover         */
/* ------------------------------------------------------------------ */

const PARTICLE_COUNT = 320

function Particles() {
  const points = useRef()
  const mat = useRef()
  const lastBurst = useRef(0)
  const targetColor = useRef(new THREE.Color('#d96f43'))

  const { positions, velocities, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = -1 - Math.random() * 5
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { positions, velocities, seeds }
  }, [])

  useFrame((state, delta) => {
    const { burst, hoverColor, themeName } = useStore.getState()

    // New burst requested → shoot particles outward, then let them decay
    if (burst !== lastBurst.current) {
      lastBurst.current = burst
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (Math.random() > 0.4) continue
        velocities[i * 3] = (Math.random() - 0.5) * 4
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 4
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 2
      }
    }

    const pos = points.current.geometry.attributes.position
    const t = state.clock.elapsedTime
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      // gentle organic drift
      pos.array[ix] += Math.sin(t * 0.3 + seeds[i]) * 0.0018 + velocities[ix] * delta
      pos.array[ix + 1] += 0.0022 + Math.cos(t * 0.25 + seeds[i]) * 0.0012 + velocities[ix + 1] * delta
      pos.array[ix + 2] += velocities[ix + 2] * delta
      // burst decay
      velocities[ix] *= 1 - 1.8 * delta
      velocities[ix + 1] *= 1 - 1.8 * delta
      velocities[ix + 2] *= 1 - 1.8 * delta
      // wrap vertically
      if (pos.array[ix + 1] > 6) pos.array[ix + 1] = -6
      if (pos.array[ix] > 9) pos.array[ix] = -9
      if (pos.array[ix] < -9) pos.array[ix] = 9
    }
    pos.needsUpdate = true

    targetColor.current.set(hoverColor || THEMES[themeName].accent)
    if (mat.current) mat.current.color.lerp(targetColor.current, 0.06)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.055}
        color="#d96f43"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */

function Lights() {
  const point = useRef()
  const target = useRef(new THREE.Color())

  useFrame(() => {
    const { themeName } = useStore.getState()
    target.current.set(THEMES[themeName].accent)
    if (point.current) point.current.color.lerp(target.current, 0.04)
  })

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <pointLight ref={point} position={[-5, -2, 3]} intensity={12} color="#d96f43" />
    </>
  )
}

export default function Scene() {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Lights />
        <DitherBackdrop />
        <ArtTools />
        <Particles />
      </Canvas>
    </div>
  )
}
