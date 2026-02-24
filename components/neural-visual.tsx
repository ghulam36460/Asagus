"use client"
/**
 * NeuralVisual — public wrapper
 * ------------------------------
 * • Dynamically imports the heavy Three.js scene only on desktop viewports.
 * • Falls back to a static lightweight SVG on mobile / low-power devices.
 * • Respects prefers-reduced-motion.
 * • Lazy mounts after idle via requestIdleCallback.
 */

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

// Lazy-load the r3f canvas (never SSR)
const NeuralVisualScene = dynamic(
  () => import('./neural-visual-scene').then((m) => ({ default: m.NeuralVisualScene })),
  { ssr: false, loading: () => null },
)

// ─── Static SVG Fallback ──────────────────────────────────────────────────────
function StaticNeuralFallback() {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-20"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7b61ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Central orb glow */}
      <circle cx="200" cy="200" r="80" fill="url(#orbGrad)" />
      <circle cx="200" cy="200" r="40" fill="none" stroke="#7b61ff" strokeWidth="0.8" opacity="0.5" />
      <circle cx="200" cy="200" r="60" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
      {/* Static nodes */}
      {[
        [120,100],[280,90],[340,200],[290,310],[140,320],[80,220],[180,60],[320,150],
        [360,270],[200,360],[60,160],[150,240],[250,150],[310,230],[100,290],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#7b61ff" opacity="0.6" />
      ))}
      {/* Static lines */}
      {[
        [120,100,200,200],[280,90,200,200],[340,200,200,200],[290,310,200,200],
        [140,320,200,200],[80,220,200,200],[120,100,280,90],[280,90,340,200],
        [340,200,290,310],[290,310,140,320],[140,320,80,220],[180,60,280,90],
        [320,150,340,200],[360,270,290,310],[100,290,140,320],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a90e2" strokeWidth="0.6" opacity="0.3" />
      ))}
    </svg>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
interface NeuralVisualProps {
  className?: string
}

export function NeuralVisual({ className = '' }: NeuralVisualProps) {
  const [shouldMount, setShouldMount] = useState(false)
  const [useThreeJS, setUseThreeJS]   = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChangeMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChangeMotion)

    // Decide whether to use Three.js:
    // – Only on viewport width >= 768px (md breakpoint)
    // – Only when GPU concurrency info suggests a non-low-power device
    const isDesktop = window.innerWidth >= 768
    const nav = navigator as Navigator & { hardwareConcurrency?: number; deviceMemory?: number }
    const isLowPower =
      (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
      (nav.deviceMemory        !== undefined && nav.deviceMemory    <= 2)

    if (isDesktop && !isLowPower) {
      setUseThreeJS(true)
    }

    // Mount after idle so the visual doesn't block the main thread on load
    const schedule = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: object) => void })
          .requestIdleCallback(cb, { timeout: 2000 })
      } else {
        setTimeout(cb, 300)
      }
    }

    // Use IntersectionObserver to mount when hero enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          schedule(() => setShouldMount(true))
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) observer.observe(containerRef.current)
    else schedule(() => setShouldMount(true))

    return () => {
      observer.disconnect()
      mq.removeEventListener('change', onChangeMotion)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      aria-hidden="true"
    >
      {shouldMount && useThreeJS ? (
        <NeuralVisualScene
          reducedMotion={reducedMotion}
          className="w-full h-full"
        />
      ) : (
        <StaticNeuralFallback />
      )}
    </div>
  )
}
