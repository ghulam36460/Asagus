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

// ─── Hero Buttons (100% inline styles — immune to all global/Tailwind overrides) ─
function HeroPrimaryBtn({ onClick, label }: { onClick: () => void; label: string }) {
  const [hovered, setHovered] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label={label}
      style={{
        all: 'unset',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 26px',
        borderRadius: '9999px',
        background: '#ffffff',
        color: '#000000',
        fontSize: '0.9rem',
        fontWeight: 600,
        fontFamily: 'var(--font-roboto), sans-serif',
        cursor: 'pointer',
        boxSizing: 'border-box',
        userSelect: 'none',
        transform: pressed ? 'scale(0.97)' : hovered ? 'scale(1.04)' : 'scale(1)',
        boxShadow: hovered
          ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 32px rgba(255,255,255,0.2)'
          : 'inset 0 1px 0 rgba(255,255,255,0.1)',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
      <ArrowRight style={{ width: 16, height: 16, flexShrink: 0, transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 180ms ease' }} aria-hidden="true" />
    </button>
  )
}

function HeroSecondaryBtn({ onClick, label }: { onClick: () => void; label: string }) {
  const [hovered, setHovered] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      aria-label={label}
      style={{
        all: 'unset',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 26px',
        borderRadius: '9999px',
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        color: hovered ? '#fff' : 'rgba(255,255,255,0.75)',
        fontSize: '0.9rem',
        fontWeight: 600,
        fontFamily: 'var(--font-roboto), sans-serif',
        cursor: 'pointer',
        boxSizing: 'border-box',
        userSelect: 'none',
        border: '1.5px solid rgba(255,255,255,0.35)',
        transform: pressed ? 'scale(0.97)' : hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 180ms ease, background 180ms ease, color 180ms ease',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {label}
    </button>
  )
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
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: 'calc(var(--announcement-height, 44px) + 60px + 12px)' }}
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-10 sm:px-20 lg:px-28 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-4 items-center">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col items-start text-left"
            style={{ paddingLeft: 'clamp(0.5rem, 2.5vw, 2rem)', marginTop: '-7rem' }}
            {...motionProps}
          >
            {/* Headline — h1 is the dominant typographic element */}
            <motion.h1
              className="font-display leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', marginBottom: '1.25rem' }}
              variants={prefersReducedMotion ? {} : headlineVariants}
            >
              <span className="block text-white">{HERO_CONTENT.line1}</span>
              <span className="block bg-gradient-to-r from-[#6b52cc] via-[#3a78c9] to-[#00aabf] bg-clip-text text-transparent opacity-75">
                {HERO_CONTENT.line2}
              </span>
            </motion.h1>

            {/* Supporting paragraph */}
            <motion.p
              className="font-body text-[0.9rem] sm:text-[0.975rem] leading-relaxed text-[#9aa0a6] max-w-[460px]"
              style={{ marginBottom: '1.75rem' }}
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              {HERO_CONTENT.paragraph}
            </motion.p>

            {/* CTAs */}
            <motion.div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}
              variants={prefersReducedMotion ? {} : itemVariants}
            >
              {/* Primary CTA */}
              <HeroPrimaryBtn onClick={handlePrimaryClick} label={HERO_CONTENT.primaryCTA} />

              {/* Secondary CTA */}
              <HeroSecondaryBtn onClick={handleSecondaryClick} label={HERO_CONTENT.secondaryCTA} />
            </motion.div>

          </motion.div>

          {/* ── RIGHT COLUMN — desktop neural visual ──────────────────────── */}
          <motion.div
            className="hidden lg:flex justify-center items-center w-full h-[540px] relative"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' }}
            style={{ marginTop: '-3rem' }}
            aria-hidden="true"
          >

            <NeuralVisual className="w-full h-full relative z-10" />
          </motion.div>

          {/* Mobile simplified visual (stacks below text, small height) */}
          <motion.div
            className="flex lg:hidden justify-center items-center w-full h-[220px] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            aria-hidden="true"
          >

            <NeuralVisual className="w-full h-full relative z-10" />
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
