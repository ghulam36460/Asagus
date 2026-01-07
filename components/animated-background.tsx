"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

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
        </div>
      )}
    </div>
  )
}
