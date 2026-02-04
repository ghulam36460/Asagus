"use client"

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './button'

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-36 lg:py-48 mb-16 md:mb-24 lg:mb-32">
      {/* Animated glow effect (responsive, accessible, and performance-minded) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* subtle contrast overlay to improve text legibility */}
        <div className="absolute inset-0 bg-black/20 mix-blend-normal" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 parallax-item" data-parallax-depth="0.15">
          <motion.div
            className="w-[clamp(240px,40vw,800px)] h-[clamp(240px,40vw,800px)] rounded-full bg-brand-blue/30 blur-[80px] sm:blur-[120px]"
            animate={!useReducedMotion() ? {
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.15, 1]
            } : { opacity: 0.4, scale: 1 }}
            transition={!useReducedMotion() ? {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            } : { duration: 0 }}
            style={{ willChange: 'transform, opacity' }}
          />
        </div>

        <div className="absolute top-20 right-20 parallax-item" data-parallax-depth="0.25">
          <motion.div
            className="w-[clamp(160px,25vw,400px)] h-[clamp(160px,25vw,400px)] rounded-full bg-purple-500/20 blur-[60px] sm:blur-[100px]"
            animate={!useReducedMotion() ? {
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.08, 1]
            } : { opacity: 0.25, scale: 1 }}
            transition={!useReducedMotion() ? {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            } : { duration: 0 }}
            style={{ willChange: 'transform, opacity' }}
          />
        </div>

        {/* Floating orbs (reduced size on small screens for better perf) */}
        <motion.div
          className="absolute left-10 top-1/4 w-24 h-24 rounded-full bg-blue-500/18 blur-[48px] sm:w-32 sm:h-32 sm:blur-[60px]"
          animate={!useReducedMotion() ? {
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3]
          } : { opacity: 0.4 }}
          transition={!useReducedMotion() ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          className="absolute left-20 bottom-1/3 w-36 h-36 rounded-full bg-cyan-500/12 blur-[56px] sm:w-48 sm:h-48"
          animate={!useReducedMotion() ? {
            y: [20, -20, 20],
            x: [10, -5, 10],
            opacity: [0.2, 0.5, 0.2]
          } : { opacity: 0.3 }}
          transition={!useReducedMotion() ? { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } : { duration: 0 }}
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Floating orbs on right side */}
        <motion.div
          className="absolute right-10 top-1/3 w-32 h-32 rounded-full bg-purple-500/18 blur-[52px] sm:w-40 sm:h-40"
          animate={!useReducedMotion() ? {
            y: [15, -15, 15],
            x: [5, -5, 5],
            opacity: [0.25, 0.55, 0.25]
          } : { opacity: 0.35 }}
          transition={!useReducedMotion() ? { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 } : { duration: 0 }}
          style={{ willChange: 'transform, opacity' }}
        />
        <motion.div
          className="absolute right-32 bottom-1/4 w-28 h-28 rounded-full bg-pink-500/12 blur-[48px] sm:w-36 sm:h-36"
          animate={!useReducedMotion() ? {
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            opacity: [0.2, 0.45, 0.2]
          } : { opacity: 0.3 }}
          transition={!useReducedMotion() ? { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 } : { duration: 0 }}
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Animated particles (reduced count & lighter weight for perf) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand-blue/40"
            style={{
              left: `${8 + i * 14}%`,
              top: `${18 + (i % 3) * 18}%`,
              willChange: 'transform, opacity'
            }}
            animate={!useReducedMotion() ? {
              y: [0, -20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            } : { opacity: 0.4 }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}

        {/* Subtle noise texture for richness */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("/noise.png")', mixBlendMode: 'overlay' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <h1 className="font-display text-5xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-[0.95] tracking-tight">
            <span className="block bg-gradient-to-r from-brand-blue via-blue-400 to-purple-500 bg-clip-text text-transparent">ASAGUS</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 leading-tight">
            <span className="block text-gray-400">ENGINEERING THE</span>
            <span className="block text-white mt-1.5">FUTURE OF DIGITAL</span>
            <span className="block text-brand-blue mt-1.5">INNOVATION</span>
          </h2>
        </motion.div>

        <motion.p
          className="text-base sm:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          We unite <span className="text-white font-medium">creativity</span> and data-driven intelligence to create 
          <span className="text-white font-medium"> digital experiences</span> that fuel real business growth.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            icon={<ArrowRight className="w-4 h-4" />}
            className="min-w-[180px] !px-6 !py-3 !text-sm"
          >
            Start Your Project
          </Button>
          <Button
            variant="secondary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="min-w-[180px] !px-6 !py-3 !text-sm"
          >
            View Our Work
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ 
            opacity: { delay: 1.3 },
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-[2px] h-10 bg-gradient-to-b from-brand-blue via-brand-blue/50 to-transparent"></div>
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-blue rounded-full"
                animate={{ y: [0, 32, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
