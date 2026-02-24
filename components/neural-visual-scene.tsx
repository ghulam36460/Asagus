"use client"
/**
 * NeuralVisualScene — r3f (Three.js) implementation
 * ---------------------------------------------------
 * • ~80 floating particle nodes
 * • Thin line connections between nearby nodes
 * • Low-poly emissive central orb
 * • Cursor spring physics (damped, per springPhysics.ts)
 * • prefers-reduced-motion aware
 * • Cleans up all Three.js objects on unmount
 *
 * This file is ONLY ever imported dynamically (ssr: false) to avoid
 * server-side import of Three.js / react-three-fiber.
 */

import { useRef, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { integrateSpring3D, makeSpring3D, SpringState3D, SpringParams } from '@/lib/springPhysics'

// ─── Constants ────────────────────────────────────────────────────────────────
const NODE_COUNT = 80
const CONNECTION_DIST = 1.8        // world-space threshold for drawing a line
const SPRING_PARAMS: SpringParams = { m: 1, c: 10, k: 50 }
const CURSOR_INFLUENCE_RADIUS = 2.2 // world-space radius around cursor that affects nodes
const CURSOR_FORCE = 0.35           // max displacement toward cursor

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface NodeData {
  origin: THREE.Vector3         // resting position
  spring: SpringState3D         // current spring state
  phase: number                 // for slow organic pulse
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function NeuralScene({ reducedMotion }: { reducedMotion: boolean }) {

  // Refs for Three objects (avoid React state → no re-renders)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef  = useRef<THREE.LineSegments>(null)
  const orbRef    = useRef<THREE.Mesh>(null)

  // Cursor in normalized device coords → converted to world-space each frame
  const cursorNDC = useRef(new THREE.Vector2(9999, 9999))
  const clock     = useRef(new THREE.Clock())

  // ── Node data ──────────────────────────────────────────────────────────────
  const nodes = useMemo<NodeData[]>(() => {
    return Array.from({ length: NODE_COUNT }, () => {
      // Distribute nodes in a rough ellipsoid skewed to the right half
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(randomInRange(-1, 1))
      const r     = randomInRange(1.2, 3.8)
      const x     = r * Math.sin(phi) * Math.cos(theta)
      const y     = r * Math.sin(phi) * Math.sin(theta) * 0.75
      const z     = r * Math.cos(phi) * 0.5
      const origin = new THREE.Vector3(x, y, z)
      return {
        origin,
        spring: makeSpring3D(x, y, z),
        phase: Math.random() * Math.PI * 2,
      }
    })
  }, [])

  // ── Point positions buffer ─────────────────────────────────────────────────
  const positions = useMemo(() => new Float32Array(NODE_COUNT * 3), [])

  // ── Line segment indices ───────────────────────────────────────────────────
  // Compute once from node origins; store pairs in a ref for useFrame access
  const pairsRef = useRef<number[]>([])
  const linePositions = useMemo(() => {
    const pairs: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].origin.distanceTo(nodes[j].origin) < CONNECTION_DIST) {
          pairs.push(i, j)
        }
      }
    }
    pairsRef.current = pairs
    return new Float32Array(pairs.length * 2 * 3) // 2 verts per segment, 3 floats each
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes])

  // ── Geometries (memoised, disposed on unmount) ────────────────────────────
  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return g
  }, [linePositions])

  const orbGeo = useMemo(() => new THREE.IcosahedronGeometry(0.55, 2), [])

  // ── Materials ──────────────────────────────────────────────────────────────
  const pointMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x7b61ff,
        size: 0.055,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    [],
  )

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    [],
  )

  const orbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x7b61ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.35,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
    [],
  )

  // ── Cursor tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Dispose on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      pointGeo.dispose()
      lineGeo.dispose()
      orbGeo.dispose()
      pointMat.dispose()
      lineMat.dispose()
      orbMat.dispose()
    }
  }, [pointGeo, lineGeo, orbGeo, pointMat, lineMat, orbMat])

  // ── Reusable raycaster for cursor→world ──────────────────────────────────
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const rayPlane  = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const cursorWorld = useRef(new THREE.Vector3())

  // ── Animation loop ────────────────────────────────────────────────────────
  useFrame(({ camera }) => {
    const dt = Math.min(clock.current.getDelta(), 0.05)
    const t  = clock.current.elapsedTime

    // Project cursor NDC → world position on z=0 plane
    raycaster.setFromCamera(cursorNDC.current, camera)
    raycaster.ray.intersectPlane(rayPlane, cursorWorld.current)

    const pairs = pairsRef.current

    // Update each node's spring state
    for (let i = 0; i < NODE_COUNT; i++) {
      const node = nodes[i]

      // Small slow organic pulse offset
      const pulse = reducedMotion ? 0 : Math.sin(t * 0.4 + node.phase) * 0.04

      // Cursor influence: if cursor is within radius, nudge target toward cursor
      const dx = cursorWorld.current.x - node.origin.x
      const dy = cursorWorld.current.y - node.origin.y
      const distSq = dx * dx + dy * dy
      const radiusSq = CURSOR_INFLUENCE_RADIUS * CURSOR_INFLUENCE_RADIUS
      let tx = node.origin.x + pulse
      let ty = node.origin.y + pulse
      const tz = node.origin.z

      if (!reducedMotion && distSq < radiusSq) {
        const influence = (1 - distSq / radiusSq) * CURSOR_FORCE
        tx += dx * influence
        ty += dy * influence
      }

      node.spring = integrateSpring3D(
        node.spring,
        { x: tx, y: ty, z: tz },
        dt,
        SPRING_PARAMS,
        reducedMotion,
      )

      const idx = i * 3
      positions[idx]     = node.spring.px
      positions[idx + 1] = node.spring.py
      positions[idx + 2] = node.spring.pz
    }

    // Mark point positions dirty
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      attr.needsUpdate = true
    }

    // Update line segment endpoints
    if (linesRef.current) {
      const lineBuf = linesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
      const arr = lineBuf.array as Float32Array
      for (let p = 0; p < pairs.length; p += 2) {
        const ia = pairs[p]     * 3
        const ib = pairs[p + 1] * 3
        const li = p * 3        // line buffer index (2 verts × 3 floats per pair)
        arr[li]     = positions[ia];     arr[li + 1] = positions[ia + 1]; arr[li + 2] = positions[ia + 2]
        arr[li + 3] = positions[ib];     arr[li + 4] = positions[ib + 1]; arr[li + 5] = positions[ib + 2]
      }
      lineBuf.needsUpdate = true
    }

    // Orb slow rotation + gentle bob
    if (orbRef.current && !reducedMotion) {
      orbRef.current.rotation.y += dt * 0.18
      orbRef.current.rotation.x += dt * 0.08
      orbRef.current.position.y = Math.sin(t * 0.5) * 0.07
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color={0x7b61ff} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={0x00d4ff} />

      {/* Central neural orb */}
      <mesh ref={orbRef} geometry={orbGeo} material={orbMat} position={[0, 0, 0]} />

      {/* Particle nodes */}
      <points ref={pointsRef} geometry={pointGeo} material={pointMat} />

      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} />
    </>
  )
}

// ─── Canvas Wrapper ──────────────────────────────────────────────────────────
interface NeuralVisualSceneProps {
  reducedMotion?: boolean
  className?: string
}

export function NeuralVisualScene({ reducedMotion = false, className }: NeuralVisualSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop="always"
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ background: 'transparent' }}
      className={className}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      aria-hidden="true"
    >
      <NeuralScene reducedMotion={reducedMotion} />
    </Canvas>
  )
}
