"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// ─── Neuron node data ─────────────────────────────────────────────────────────
// Positioned at grid intersections (grid = 80px × 80px).
// left/top are percentages based on a 1920×1080 reference viewport.
// Each node has: position, color, size (px), blink duration, delay.
// Deterministic so no hydration mismatch (wrapped in mounted gate anyway).
const NEURONS: ReadonlyArray<{
  left: string; top: string
  color: string; size: number
  dur: number; delay: number
}> = [
  // col×80/1920*100  row×80/1080*100
  { left: '4.17%',  top: '7.41%',  color: '#1D4DF1', size: 3, dur: 2.8, delay: 0    },
  { left: '8.33%',  top: '14.81%', color: '#7b61ff', size: 2, dur: 3.4, delay: 0.6  },
  { left: '12.5%',  top: '7.41%',  color: '#00d4ff', size: 3, dur: 2.2, delay: 1.1  },
  { left: '16.67%', top: '22.22%', color: '#1D4DF1', size: 2, dur: 4.0, delay: 0.3  },
  { left: '20.83%', top: '14.81%', color: '#ffffff', size: 2, dur: 3.1, delay: 1.7  },
  { left: '25.0%',  top: '29.63%', color: '#7b61ff', size: 3, dur: 2.6, delay: 0.9  },
  { left: '29.17%', top: '7.41%',  color: '#00d4ff', size: 2, dur: 3.8, delay: 0.4  },
  { left: '33.33%', top: '22.22%', color: '#1D4DF1', size: 3, dur: 2.4, delay: 2.0  },
  { left: '37.5%',  top: '37.04%', color: '#7b61ff', size: 2, dur: 4.2, delay: 1.3  },
  { left: '41.67%', top: '14.81%', color: '#ffffff', size: 3, dur: 2.9, delay: 0.7  },
  { left: '45.83%', top: '44.44%', color: '#00d4ff', size: 2, dur: 3.5, delay: 1.9  },
  { left: '50.0%',  top: '7.41%',  color: '#1D4DF1', size: 3, dur: 2.1, delay: 0.2  },
  { left: '54.17%', top: '29.63%', color: '#7b61ff', size: 2, dur: 3.7, delay: 1.5  },
  { left: '58.33%', top: '14.81%', color: '#00d4ff', size: 3, dur: 2.5, delay: 0.8  },
  { left: '62.5%',  top: '51.85%', color: '#ffffff', size: 2, dur: 4.1, delay: 2.2  },
  { left: '66.67%', top: '22.22%', color: '#1D4DF1', size: 3, dur: 2.7, delay: 0.5  },
  { left: '70.83%', top: '37.04%', color: '#7b61ff', size: 2, dur: 3.3, delay: 1.6  },
  { left: '75.0%',  top: '7.41%',  color: '#00d4ff', size: 3, dur: 2.3, delay: 1.0  },
  { left: '79.17%', top: '44.44%', color: '#1D4DF1', size: 2, dur: 4.3, delay: 2.4  },
  { left: '83.33%', top: '14.81%', color: '#ffffff', size: 3, dur: 2.6, delay: 0.3  },
  { left: '87.5%',  top: '29.63%', color: '#7b61ff', size: 2, dur: 3.2, delay: 1.8  },
  { left: '91.67%', top: '7.41%',  color: '#00d4ff', size: 3, dur: 2.0, delay: 0.9  },
  // Second band (row 7–10)
  { left: '4.17%',  top: '51.85%', color: '#7b61ff', size: 2, dur: 3.6, delay: 1.2  },
  { left: '12.5%',  top: '59.26%', color: '#1D4DF1', size: 3, dur: 2.9, delay: 0.6  },
  { left: '20.83%', top: '66.67%', color: '#00d4ff', size: 2, dur: 4.0, delay: 2.1  },
  { left: '29.17%', top: '51.85%', color: '#ffffff', size: 3, dur: 2.4, delay: 0.4  },
  { left: '37.5%',  top: '59.26%', color: '#7b61ff', size: 2, dur: 3.1, delay: 1.7  },
  { left: '45.83%', top: '66.67%', color: '#1D4DF1', size: 3, dur: 2.7, delay: 0.8  },
  { left: '54.17%', top: '74.07%', color: '#00d4ff', size: 2, dur: 3.9, delay: 2.3  },
  { left: '62.5%',  top: '59.26%', color: '#ffffff', size: 3, dur: 2.2, delay: 1.4  },
  { left: '70.83%', top: '66.67%', color: '#7b61ff', size: 2, dur: 4.4, delay: 0.7  },
  { left: '79.17%', top: '51.85%', color: '#1D4DF1', size: 3, dur: 2.5, delay: 2.0  },
  { left: '87.5%',  top: '74.07%', color: '#00d4ff', size: 2, dur: 3.4, delay: 1.1  },
  { left: '95.83%', top: '59.26%', color: '#ffffff', size: 3, dur: 2.8, delay: 0.5  },
  // Third band (row 11–13)
  { left: '8.33%',  top: '81.48%', color: '#7b61ff', size: 2, dur: 3.7, delay: 1.9  },
  { left: '16.67%', top: '88.89%', color: '#1D4DF1', size: 3, dur: 2.3, delay: 0.3  },
  { left: '25.0%',  top: '81.48%', color: '#00d4ff', size: 2, dur: 4.2, delay: 1.6  },
  { left: '33.33%', top: '88.89%', color: '#ffffff', size: 3, dur: 2.6, delay: 2.5  },
  { left: '41.67%', top: '81.48%', color: '#7b61ff', size: 2, dur: 3.0, delay: 0.2  },
  { left: '50.0%',  top: '88.89%', color: '#1D4DF1', size: 3, dur: 2.1, delay: 1.3  },
  { left: '58.33%', top: '81.48%', color: '#00d4ff', size: 2, dur: 4.5, delay: 0.6  },
  { left: '66.67%', top: '88.89%', color: '#ffffff', size: 3, dur: 2.8, delay: 2.1  },
  { left: '75.0%',  top: '81.48%', color: '#7b61ff', size: 2, dur: 3.5, delay: 1.0  },
  { left: '83.33%', top: '88.89%', color: '#1D4DF1', size: 3, dur: 2.4, delay: 0.8  },
  { left: '91.67%', top: '81.48%', color: '#00d4ff', size: 2, dur: 3.2, delay: 1.7  },
  // Accent high-glow nodes (slightly bigger, pulsing slower)
  { left: '33.33%', top: '44.44%', color: '#7b61ff', size: 4, dur: 5.0, delay: 0.0  },
  { left: '58.33%', top: '37.04%', color: '#00d4ff', size: 4, dur: 5.5, delay: 1.2  },
  { left: '16.67%', top: '66.67%', color: '#1D4DF1', size: 4, dur: 4.8, delay: 2.8  },
  { left: '75.0%',  top: '59.26%', color: '#7b61ff', size: 4, dur: 5.2, delay: 0.7  },
  { left: '45.83%', top: '22.22%', color: '#00d4ff', size: 4, dur: 4.6, delay: 1.9  },
  { left: '87.5%',  top: '44.44%', color: '#1D4DF1', size: 4, dur: 5.8, delay: 3.1  },
]

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Graph paper grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      
      {/* Animated color waves over grid */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Blue wave */}
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(rgba(29,77,241,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(29,77,241,0.15)_1px,transparent_1px)] bg-[size:80px_80px]"
            animate={{
              x: [0, 80, 0],
              y: [0, 80, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          {/* Red/Purple wave */}
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.12)_1px,transparent_1px)] bg-[size:80px_80px]"
            animate={{
              x: [0, -80, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
              delay: 2
            }}
          />
          {/* Cyan wave */}
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:80px_80px]"
            animate={{
              x: [0, 40, 0],
              y: [0, -40, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 5
            }}
          />

          {/* ── Neuron bulbs at grid intersections ── */}
          {NEURONS.map((n, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="absolute rounded-full"
              style={{
                left: n.left,
                top: n.top,
                width: n.size,
                height: n.size,
                background: n.color,
                // Subtract half the size so the dot is centred on the grid line crossing
                marginLeft: -n.size / 2,
                marginTop: -n.size / 2,
                boxShadow: `0 0 ${n.size * 3}px ${n.size * 1.5}px ${n.color}60`,
              }}
              animate={{
                opacity: [0, 0.9, 0.15, 1, 0],
                scale:   [0.6, 1.3, 0.8, 1.1, 0.6],
              }}
              transition={{
                duration: n.dur,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: n.delay,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
