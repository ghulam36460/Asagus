"use client"
/**
 * HeroSection v2.0 — Neural Hero
 * --------------------------------
 * • Left-aligned 2-column layout (60 / 40 desktop split)
 * • Three.js interactive neural visual on the right (lazy, ssr:false)
 * • Spring-physics cursor interaction (lib/springPhysics.ts)
 * • Staggered Framer Motion entrance
 * • data-hero-version="v2.0" for A/B testing
 * • Analytics events: hero_primary_click, hero_secondary_click
 * • WCAG AA contrast, focus styles, prefers-reduced-motion
 *
 * Spring param tuning:  edit SPRING_PARAMS in neural-visual-scene.tsx
 * Disable animation:    prefers-reduced-motion in OS settings
 * Feature flag:         ?hero=v2 (always on — remove param to revert)
 */

import React, { useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { NeuralVisual } from './neural-visual'

// ─── Content ─────────────────────────────────────────────────────────────────
// Defaults; swap for API-driven content when CMS is wired up.
const HERO_CONTENT = {
  badge:        'V2.0 Innovation Lab',
  line1:        'Architecting the',
  line2:        'Future of AI.',
  paragraph:    'We unite creativity, product engineering, and deep learning to build intelligent web and mobile experiences.',
  primaryCTA:   'Start Your Project',
  secondaryCTA: 'View Our Work',
} as const

// ─── Analytics helper ─────────────────────────────────────────────────────────
function emitEvent(name: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).gtag) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).gtag('event', name)
    }
    window.dispatchEvent(new CustomEvent(name))
  } catch { /* ignore in non-browser env */ }
}

// ─── Framer Motion variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}
const headlineVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()

  const handlePrimaryClick = useCallback(() => {
    emitEvent('hero_primary_click')
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSecondaryClick = useCallback(() => {
    emitEvent('hero_secondary_click')
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleScrollDown = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const motionProps = prefersReducedMotion
    ? {}
    : { variants: containerVariants, initial: 'hidden' as const, animate: 'visible' as const }

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      data-hero-version="v2.0"
      aria-label="Hero — Architecting the Future of AI"
    >
      {/* ── Subtle ambient layer (no heavy outer glows/rings) ────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Very soft ambient wash — no heavy rings */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#7b61ff]/8 blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[350px] h-[350px] rounded-full bg-[#00d4ff]/6 blur-[100px]" />
      </div>

      {/* ── Main 2-column grid ───────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-4 items-center">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col items-start text-left"
            {...motionProps}
          >
            {/* Badge */}
            <motion.div variants={prefersReducedMotion ? {} : itemVariants} className="mb-6">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-semibold tracking-wide border border-white/10 bg-white/5 text-[#9aa0a6] backdrop-blur-sm select-none"
                aria-label="Version badge"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7b61ff] animate-pulse" aria-hidden="true" />
                {HERO_CONTENT.badge}
              </span>
            </motion.div>

            {/* Headline — h1 is the dominant typographic element */}
            <motion.h1
              className="font-display leading-[1.02] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.0rem)' }}
              variants={prefersReducedMotion ? {} : headlineVariants}
            >
              <span className="block text-white">{HERO_CONTENT.line1}</span>
              <span className="block bg-gradient-to-r from-[#7b61ff] via-[#4a90e2] to-[#00d4ff] bg-clip-text text-transparent">
                {HERO_CONTENT.line2}
              </span>
            </motion.h1>

            {/* Supporting paragraph */}
            <motion.p
              className="font-body text-[1rem] sm:text-[1.075rem] leading-relaxed text-[#9aa0a6] mb-10 max-w-[480px]"
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              {HERO_CONTENT.paragraph}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-start"
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              {/* Primary CTA — gradient contained, no outer glow ring */}
              <button
                type="button"
                onClick={handlePrimaryClick}
                aria-label="Start your project with ASAGUS"
                className={[
                  'group inline-flex items-center gap-2.5 px-7 py-4 rounded-full',
                  'font-body font-semibold text-[1rem] text-white',
                  'bg-gradient-to-r from-[#7b61ff] to-[#00d4ff]',
                  'relative overflow-hidden',
                  'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/15 before:to-transparent before:pointer-events-none',
                  'shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]',
                  'transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7b61ff] focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                ].join(' ')}
              >
                <span className="relative z-10">{HERO_CONTENT.primaryCTA}</span>
                <ArrowRight
                  className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>

              {/* Secondary CTA — transparent, 1px border at 40% white */}
              <button
                type="button"
                onClick={handleSecondaryClick}
                aria-label="View our work and portfolio"
                className={[
                  'inline-flex items-center gap-2 px-7 py-4 rounded-full',
                  'font-body font-semibold text-[1rem] text-white/80',
                  'border border-white/40 bg-transparent',
                  'transition-all duration-200 hover:bg-white/5 hover:text-white hover:scale-[1.03] active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                ].join(' ')}
              >
                {HERO_CONTENT.secondaryCTA}
              </button>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8rem] text-[#9aa0a6]"
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">50+</span> Projects shipped
              </span>
              <span className="w-px h-3 bg-white/20 hidden sm:block" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">2024</span> Founded
              </span>
              <span className="w-px h-3 bg-white/20 hidden sm:block" aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span className="font-semibold text-white">AI-first</span> engineering
              </span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — desktop neural visual ──────────────────────── */}
          <motion.div
            className="hidden lg:flex justify-center items-center w-full h-[540px] relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <NeuralVisual className="w-full h-full" />
          </motion.div>

          {/* Mobile simplified visual (stacks below text, small height) */}
          <motion.div
            className="flex lg:hidden justify-center items-center w-full h-[220px] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            aria-hidden="true"
          >
            <NeuralVisual className="w-full h-full" />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll down indicator ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll down to explore"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
        initial={{ opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { opacity: 0.5 }
            : { opacity: [0, 0.6, 0.6], y: [0, 0, 6] }
        }
        transition={
          prefersReducedMotion
            ? {}
            : {
                opacity: { delay: 1.5, duration: 0.6 },
                y: { delay: 1.5, duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              }
        }
      >
        <span className="text-[0.68rem] tracking-[0.15em] uppercase text-white/30 font-body group-hover:text-white/50 transition-colors">
          Scroll
        </span>
        <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" aria-hidden="true" />
      </motion.button>
    </section>
  )
}
