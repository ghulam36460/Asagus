"use client"
/**
 * BentoServicesSection — v1.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium, cinematic portfolio-style services section featuring:
 *   • Bento Grid (named CSS grid areas, fully responsive)
 *   • Video-background cards with poster fallback + tap-to-play on mobile
 *   • Glassmorphism 2.0 overlay (--glass-opacity, --glass-blur CSS vars)
 *   • Radial motion glow layer (mouse-tracked via pointer events)
 *   • 3-D perspective tilt (±8° constrained, spring reset)
 *   • Framer Motion spring scroll-reveal + hover state animations
 *   • Metric badge stagger reveal on hover (AnimatePresence)
 *   • prefers-reduced-motion safety throughout
 *   • Mobile: poster + inline tap-to-play, 44 px minimum tap targets
 *   • WCAG AA text contrast, keyboard-accessible focus rings
 *   • IntersectionObserver-based video autoplay (off-screen pause)
 *
 * ─── CardProps API ────────────────────────────────────────────────────────────
 *   id          — unique identifier
 *   type        — 'research' | 'product'
 *   title       — H3 heading
 *   subtitle    — 1-2 line summary
 *   videoSrc    — MP4 video loop (optional; poster shown if absent)
 *   videoSrcWebm— WebM/vp9 variant for better compression
 *   posterSrc   — fallback / placeholder image
 *   metrics     — [{ label, value }] — revealed on hover
 *   icon        — Lucide component
 *   ctaLabel    — button text (default "View Case Study")
 *   ctaHref     — destination URL
 *   gridArea    — CSS grid-area letter (a–g)
 *   accentRgb   — override neon colour "r,g,b"
 *
 * ─── Motion Variants (exported) ──────────────────────────────────────────────
 *   cardScrollVariant — spring entrance (stagger by index * 0.06s)
 *   cardHoverVariant  — content lift + scale
 */

import React, { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion'
import {
  Brain, Code2, Database, BarChart3, Workflow, Microscope,
  ArrowUpRight, FlaskConical, Layers,
  Play,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════

export interface MetricItem {
  label: string
  value: string
}

export type CardType = 'research' | 'product'

export interface CardProps {
  id: string
  type: CardType
  title: string
  subtitle?: string
  /** Looping muted MP4 video src */
  videoSrc?: string
  /** WebM/vp9 variant for modern browsers */
  videoSrcWebm?: string
  /** Poster image (ideally LQIP → full-res) — required */
  posterSrc: string
  metrics?: MetricItem[]
  /** Lucide icon component */
  icon?: React.ComponentType<{ className?: string }>
  ctaLabel?: string
  ctaHref?: string
  /** CSS bento-area class letter: a–g */
  gridArea?: string
  /** Override accent neon colour as "r,g,b" e.g. "139,92,246" */
  accentRgb?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// Motion Variants (copy-ready for Framer prototyping)
// ═══════════════════════════════════════════════════════════════════════════════

export const cardScrollVariant = {
  hidden: { y: 24, scale: 0.98, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 110,
      damping: 16,
      delay: i * 0.06,
    },
  }),
}

const metricsVariant = {
  hidden: { y: 8, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.22,
      ease: 'easeOut' as const,
    },
  }),
}

const innerContentVariant = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.01,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
}

const ctaVariant = {
  rest:  { x: 0,   opacity: 0.72 },
  hover: { x: 3,   opacity: 1,    transition: { duration: 0.18, ease: 'easeOut' as const } },
}

// ═══════════════════════════════════════════════════════════════════════════════
// BentoCard — the individual card component
// ═══════════════════════════════════════════════════════════════════════════════

function BentoCard({
  id,
  type,
  title,
  subtitle,
  videoSrc,
  videoSrcWebm,
  posterSrc,
  metrics = [],
  icon: Icon,
  ctaLabel = 'View Case Study',
  ctaHref = '#',
  gridArea,
  accentRgb,
  index = 0,
}: CardProps & { index?: number }) {
  const prefersReduced = useReducedMotion()

  // Scroll-reveal
  const wrapperRef    = useRef<HTMLDivElement>(null)
  const isInView      = useInView(wrapperRef, { once: true, margin: '-80px' })

  // Hover state (pointer + keyboard)
  const [hovered,  setHovered]  = useState(false)
  const [clicked,  setClicked]  = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [showPlay, setShowPlay] = useState(false)    // mobile tap-to-play overlay

  // DOM refs
  const cardRef  = useRef<HTMLDivElement>(null)
  const tiltRef  = useRef<HTMLDivElement>(null)
  const glowRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const resolvedAccent = accentRgb ?? (type === 'research' ? '139,92,246' : '29,77,241')
  const MAX_TILT = 8

  // ── Glow + tilt on pointer move ──────────────────────────────────────────
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced) return

      // Track mouse for radial glow
      if (glowRef.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width)  * 100
        const y = ((e.clientY - rect.top)  / rect.height) * 100
        glowRef.current.style.setProperty('--x', `${x}%`)
        glowRef.current.style.setProperty('--y', `${y}%`)
      }

      // 3-D tilt
      if (tiltRef.current) {
        const rect = tiltRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width  / 2
        const cy = rect.top  + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width  / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        tiltRef.current.style.transform =
          `perspective(1200px) rotateY(${dx * MAX_TILT}deg) rotateX(${-dy * MAX_TILT}deg) translateZ(0)`
        tiltRef.current.style.transition = 'transform 0.08s ease-out'
      }
    },
    [prefersReduced],
  )

  const onPointerLeave = useCallback(() => {
    setHovered(false)
    if (!tiltRef.current || prefersReduced) return
    tiltRef.current.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
    tiltRef.current.style.transform  =
      'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)'
  }, [prefersReduced])

  // ── Video: IntersectionObserver lazy autoplay ─────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video || !videoSrc) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = video.play()
          if (p) p.catch(() => { /* autoplay blocked — poster still visible */ })
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    obs.observe(video)
    return () => obs.disconnect()
  }, [videoSrc])

  // ── Mobile: detect coarse pointer, show play button ───────────────────────
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse && videoSrc) setShowPlay(true)
  }, [videoSrc])

  const handleTapPlay = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    setShowPlay(false)
    video.muted = true
    try { await video.play() } catch { /* silent */ }
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    setClicked(true)
    setTimeout(() => setClicked(false), 300)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setClicked(true)
      setTimeout(() => setClicked(false), 300)
    }
  }, [])

  // ── Card CSS custom properties ────────────────────────────────────────────
  const cardVars = {
    '--neon-color-rgb': resolvedAccent,
    '--accent-rgb':     resolvedAccent,
  } as React.CSSProperties

  return (
    <motion.div
      ref={wrapperRef}
      className={gridArea ? `bento-area-${gridArea}` : ''}
      variants={cardScrollVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
    >
      {/* Tilt wrapper — preserves 3-D context */}
      <div
        ref={tiltRef}
        style={{ height: '100%', transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {/* ── Card shell ─────────────────────────────────────────────────── */}
        <div
          ref={cardRef}
          id={`bento-card-${id}`}
          className="bento-card"
          style={{ ...cardVars, height: '100%' }}
          onPointerEnter={() => setHovered(true)}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="article"
          aria-label={`${type === 'research' ? 'Research' : 'Product'}: ${title}`}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          {/* ── LAYER 0 — Video / Poster background ───────────────────────── */}
          {videoSrc ? (
            <video
              ref={videoRef}
              className="bento-video"
              poster={posterSrc}
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlayThrough={() => setVideoReady(true)}
              aria-hidden="true"
            >
              {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : null}

          {/* Poster — always shown until video is ready */}
          {(!videoSrc || !videoReady) && (
            <img
              className="bento-poster"
              src={posterSrc}
              alt=""
              aria-hidden="true"
              loading={index < 3 ? 'eager' : 'lazy'}
              decoding="async"
            />
          )}

          {/* ── LAYER 1 — Radial glow motion layer ────────────────────────── */}
          <div
            ref={glowRef}
            className="bento-glow-layer"
            style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
            aria-hidden="true"
          />

          {/* ── LAYER 2 — Glass overlay ────────────────────────────────────── */}
          <div className="bento-glass" aria-hidden="true" />

          {/* ── LAYER 3 — Gradient scrim ───────────────────────────────────── */}
          <div className="bento-scrim" aria-hidden="true" />

          {/* ── LAYER 4 — Content ─────────────────────────────────────────── */}
          <motion.div
            className="bento-content"
            variants={prefersReduced ? undefined : innerContentVariant}
            initial="rest"
            animate={hovered ? 'hover' : 'rest'}
          >
            {/* Top row: type badge + icon */}
            <div className="flex items-start justify-between">
              <span className={`bento-type-badge ${type}`}>
                {type === 'research'
                  ? <><FlaskConical className="w-2.5 h-2.5" aria-hidden="true" /> Research</>
                  : <><Layers       className="w-2.5 h-2.5" aria-hidden="true" /> Product</>
                }
              </span>

              {Icon && (
                <div className="relative flex-shrink-0" aria-hidden="true">
                  <div
                    className="absolute inset-0 rounded-xl blur-xl opacity-60"
                    style={{ background: `rgba(${resolvedAccent}, 0.5)` }}
                  />
                  <div className="relative w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Spacer pushes bottom content down */}
            <div className="flex-1" />

            {/* Bottom block */}
            <div>
              {/* Metrics reveal — staggered on hover */}
              <AnimatePresence>
                {hovered && metrics.length > 0 && (
                  <div className="bento-metrics mb-3" role="list" aria-label="Metrics">
                    {metrics.map((m, i) => (
                      <motion.span
                        key={m.label}
                        className="bento-metric-badge"
                        role="listitem"
                        variants={metricsVariant}
                        initial="hidden"
                        animate="visible"
                        exit={{ y: 4, opacity: 0, transition: { duration: 0.12 } }}
                        custom={i}
                      >
                        <span
                          className="font-bold mr-1"
                          style={{ color: `rgb(${resolvedAccent})` }}
                        >
                          {m.value}
                        </span>
                        {m.label}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Title */}
              <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug mb-1.5 drop-shadow-lg">
                {title}
              </h3>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xs sm:text-sm text-white/72 leading-relaxed mb-3.5 line-clamp-2">
                  {subtitle}
                </p>
              )}

              {/* CTA */}
              <Link
                href={ctaHref ?? '#'}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           text-white/85 hover:text-white transition-colors
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-white/60 rounded-sm"
                aria-label={`${ctaLabel}: ${title}`}
                tabIndex={hovered ? 0 : -1}
              >
                <motion.span
                  className="inline-flex items-center gap-1.5"
                  variants={prefersReduced ? undefined : ctaVariant}
                  initial="rest"
                  animate={hovered ? 'hover' : 'rest'}
                >
                  {ctaLabel}
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* ── Mobile tap-to-play overlay ─────────────────────────────────── */}
          {showPlay && (
            <div className="bento-play-btn" aria-hidden="true">
              <button
                className="bento-play-btn-inner"
                onClick={handleTapPlay}
                aria-label={`Play video for ${title}`}
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <Play className="w-5 h-5 fill-white text-white" />
              </button>
            </div>
          )}

          {/* ── Click ripple ───────────────────────────────────────────────── */}
          {clicked && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                borderRadius: 'var(--bento-radius, 24px)',
                background: `rgba(${resolvedAccent}, 0.25)`,
              }}
              initial={{ scale: 1, opacity: 0.18 }}
              animate={{ scale: 1.04, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Card data — 3 Research + 3 Product (+ 1 wide featured each = 7 cards → 3+4)
// Change videoSrc / videoSrcWebm once you have optimised clips:
//   • 6–10 s loop, 720 p, H.264 MP4 + VP9 WebM, ~1.2–2.5 Mbps
//   • Research: loss-curve / activation / convergence animations
//   • Product:  UI screen-recordings inside device frames
// ═══════════════════════════════════════════════════════════════════════════════

const CARDS: (CardProps & { index: number })[] = [
  // ── A: Research — Neural Architecture Search (2×2 featured) ────────────────
  {
    id:          'research-neural',
    type:        'research',
    title:       'Neural Architecture Search',
    subtitle:    'Automated discovery of optimal network topologies using gradient-guided evolution and Bayesian optimisation.',
    posterSrc:   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=900&fit=crop&auto=format&q=75',
    // videoSrc: '/videos/neural-arch-search.mp4',
    metrics:     [{ label: 'faster convergence', value: '3.2×' }, { label: 'fewer parameters', value: '–41%' }],
    icon:        Brain,
    ctaLabel:    'View Research',
    ctaHref:     '/portfolio/neural-architecture',
    gridArea:    'a',
    accentRgb:   '139,92,246',
    index:       0,
  },

  // ── B: Product — AI SaaS Platform (1×1) ────────────────────────────────────
  {
    id:          'product-platform',
    type:        'product',
    title:       'Asagus AI Platform',
    subtitle:    'Full-stack SaaS delivering real-time inference at the edge with sub-100 ms P99.',
    posterSrc:   'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&h=500&fit=crop&auto=format&q=75',
    // videoSrc: '/videos/ai-platform-demo.mp4',
    metrics:     [{ label: 'avg response time', value: '<80 ms' }, { label: 'uptime SLA', value: '99.97%' }],
    icon:        Code2,
    ctaLabel:    'View Case Study',
    ctaHref:     '/portfolio/ai-platform',
    gridArea:    'b',
    accentRgb:   '29,77,241',
    index:       1,
  },

  // ── C: Research — Training Dynamics (1×1) ──────────────────────────────────
  {
    id:          'research-training',
    type:        'research',
    title:       'Adaptive Training Dynamics',
    subtitle:    'Real-time loss-curve analysis with dynamic learning-rate scheduling.',
    posterSrc:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=500&fit=crop&auto=format&q=75',
    metrics:     [{ label: 'training time saved', value: '60%' }],
    icon:        BarChart3,
    ctaLabel:    'View Research',
    ctaHref:     '/portfolio/training-dynamics',
    gridArea:    'c',
    accentRgb:   '139,92,246',
    index:       2,
  },

  // ── D: Product — Telemetry Dashboard (1×1) ─────────────────────────────────
  {
    id:          'product-dashboard',
    type:        'product',
    title:       'Telemetry Dashboard',
    subtitle:    'Datadog-inspired observability layer for live ML pipelines.',
    posterSrc:   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=500&fit=crop&auto=format&q=75',
    metrics:     [{ label: 'metrics / sec', value: '1.2 M' }],
    icon:        Database,
    ctaLabel:    'View Case Study',
    ctaHref:     '/portfolio/telemetry-dashboard',
    gridArea:    'd',
    accentRgb:   '29,77,241',
    index:       3,
  },

  // ── E: Research — Activation Maps (1×1) ────────────────────────────────────
  {
    id:          'research-activations',
    type:        'research',
    title:       'Activation Map Explorer',
    subtitle:    'Interactive visualisation of layer-by-layer feature representations.',
    posterSrc:   'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&h=500&fit=crop&auto=format&q=75',
    metrics:     [{ label: 'interpretability score', value: '↑ 87%' }],
    icon:        Microscope,
    ctaLabel:    'View Research',
    ctaHref:     '/portfolio/activation-explorer',
    gridArea:    'e',
    accentRgb:   '139,92,246',
    index:       4,
  },

  // ── F: Product — Automation Engine (2×1 wide) ──────────────────────────────
  {
    id:          'product-automation',
    type:        'product',
    title:       'Intelligent Automation Engine',
    subtitle:    'End-to-end workflow automation fusing LLMs with deterministic business rules to cut manual overhead by 94%.',
    posterSrc:   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop&auto=format&q=75',
    metrics:     [{ label: 'manual tasks eliminated', value: '94%' }, { label: 'ROI in 90 days', value: '4.8×' }],
    icon:        Workflow,
    ctaLabel:    'View Case Study',
    ctaHref:     '/portfolio/automation-engine',
    gridArea:    'f',
    accentRgb:   '29,77,241',
    index:       5,
  },

  // ── G: Research — Multimodal Fusion (2×1 wide) ─────────────────────────────
  {
    id:          'research-multimodal',
    type:        'research',
    title:       'Multimodal Fusion Research',
    subtitle:    'Cross-modal alignment of vision, language, and structured data for next-generation reasoning models.',
    posterSrc:   'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=900&h=500&fit=crop&auto=format&q=75',
    metrics:     [{ label: 'benchmark SOTA delta', value: '+12 pts' }, { label: 'cross-modal accuracy', value: '96.4%' }],
    icon:        FlaskConical,
    ctaLabel:    'View Research',
    ctaHref:     '/portfolio/multimodal-fusion',
    gridArea:    'g',
    accentRgb:   '139,92,246',
    index:       6,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// BentoServicesSection — top-level export
// ═══════════════════════════════════════════════════════════════════════════════

export function BentoServicesSection() {
  const prefersReduced = useReducedMotion()
  const headerRef      = useRef<HTMLDivElement>(null)
  const headerInView   = useInView(headerRef, { once: true, margin: '-60px' })

  return (
    <section
      id="services"
      aria-label="Our Services — Research and Products"
      className="relative overflow-hidden bg-gradient-to-b from-black via-gray-950 to-black py-32 lg:py-48"
    >
      {/* ── Ambient background orbs ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-16 right-8 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(139,92,246), transparent 70%)' }}
        />
        <div
          className="absolute bottom-24 left-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(29,77,241), transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] rounded-full opacity-[0.035] blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgb(99,179,237), transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ────────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 md:mb-20"
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-purple-500/30 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">
              What We Build
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[80px] font-extrabold mb-5 leading-[0.95]">
            <span className="block text-white/95">Research &amp;</span>
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Products
            </span>
          </h2>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Each card is a window into a live research thread or deployed product.
            Hover to surface metrics. Click to read the full case&nbsp;study.
          </p>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6" aria-label="Card type legend">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: 'rgb(139,92,246)' }}
                aria-hidden="true"
              />
              Research
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: 'rgb(29,77,241)' }}
                aria-hidden="true"
              />
              Product
            </div>
          </div>
        </motion.div>

        {/* ── Bento Grid ────────────────────────────────────────────────────── */}
        <div className="bento-grid">
          {CARDS.map((card) => (
            <BentoCard key={card.id} {...card} />
          ))}
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <motion.div
          className="text-center mt-14"
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.32, duration: 0.5, ease: 'easeOut' }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white
                       border border-white/10 bg-white/[0.06] backdrop-blur-sm
                       hover:bg-white/[0.11] hover:border-white/20
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                       transition-all duration-300"
          >
            Explore Full Portfolio
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
