'use client'

/**
 * ServicesShowcase.tsx — Premium "What We Offer" section
 * ─────────────────────────────────────────────────────────────────────────────
 * All card content, colors, layout type, and CTAs are controlled from the
 * admin panel via the Services CRUD.
 *
 * Design synthesis:
 *  • Cursor-tracking spotlight border (Vercel)
 *  • Animated gradient shimmer on hover (Stripe / Neon)
 *  • Grain texture overlay (Raycast / Linear)
 *  • Spring-physics hover lift (Arc Browser)
 *  • Glass-morphism inner glow (Apple WWDC)
 *  • Feature pills inside cards (Supabase)
 */

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Brain, Code2, ShieldCheck, Database, Cog, ArrowRight, Shield,
  Cloud, Lock, Globe, Smartphone, Cpu, Terminal, Layers, Zap,
  BarChart, Settings, Palette, MonitorSmartphone, Bot, Workflow, Server,
} from 'lucide-react'
import type { ServiceRecord } from '@/lib/services-api'

// ─────────────────────────────────────────────────────────────────────────────
// Icon Map — maps icon string from admin to Lucide component
// ─────────────────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Code2, ShieldCheck, Database, Cog, Shield, Cloud, Lock, Globe,
  Smartphone, Cpu, Terminal, Layers, Zap, BarChart, Settings, Palette,
  MonitorSmartphone, Bot, Workflow, Server,
  Code: Code2,
}

function RenderIcon({ name, className }: { name?: string; className?: string }) {
  const Comp = name ? (ICON_MAP[name] || Code2) : Code2
  return <Comp className={className} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: hex → rgb string
// ─────────────────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '59,130,246'
  return `${r},${g},${b}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Noise texture overlay — SVG data URI (Raycast / Linear pattern)
// ─────────────────────────────────────────────────────────────────────────────
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`

// ─────────────────────────────────────────────────────────────────────────────
// Cursor Spotlight Hook — Vercel-style glow that follows the pointer
// ─────────────────────────────────────────────────────────────────────────────
function useSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false })

  const handleMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    })
  }, [])

  const handleLeave = useCallback(() => {
    setPos((p) => ({ ...p, visible: false }))
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMove, handleLeave])

  return { containerRef, spotlight: pos }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero Card
// ─────────────────────────────────────────────────────────────────────────────
function HeroCard({
  svc,
  index,
  spotlight,
}: {
  svc: ServiceRecord
  index: number
  spotlight: { x: number; y: number; visible: boolean }
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const rgb = useMemo(() => hexToRgb(svc.accentColor), [svc.accentColor])
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 40, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ flex: '1 1 440px', minWidth: 0 }}
    >
      <div
        className="group"
        style={{
          position: 'relative',
          borderRadius: 20,
          background: '#111118',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'default',
          willChange: 'transform',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered && !reduced ? 'translateY(-8px) scale(1.004)' : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? `0 32px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(${rgb},0.22), inset 0 1px 0 rgba(255,255,255,0.05)`
            : `0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Cursor spotlight glow */}
        {spotlight.visible && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 'inherit',
              background: `radial-gradient(600px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${rgb},0.12), transparent 40%)`,
              pointerEvents: 'none',
              zIndex: 0,
              transition: 'opacity 0.3s ease',
              opacity: 1,
            }}
          />
        )}

        {/* Top-left accent gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: 300,
            borderRadius: 'inherit',
            background: `radial-gradient(ellipse at 0% 0%, rgba(${rgb},0.1) 0%, transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE_SVG,
            backgroundRepeat: 'repeat',
            opacity: 0.5,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Animated shimmer bar on hover */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: hovered
              ? `linear-gradient(90deg, transparent, rgba(${rgb},0.6), transparent)`
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            transition: 'background 0.5s ease',
            zIndex: 2,
          }}
        />

        {/* Text block */}
        <div style={{ padding: '40px 36px 28px', position: 'relative', zIndex: 3 }}>
          {/* Category pill */}
          <span
            style={{
              display: 'inline-block',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: `rgba(${rgb},0.8)`,
              background: `rgba(${rgb},0.08)`,
              border: `1px solid rgba(${rgb},0.15)`,
              borderRadius: 999,
              padding: '4px 12px',
              marginBottom: 24,
              fontFamily: 'var(--font-roboto), sans-serif',
            }}
          >
            {svc.categoryLabel || svc.title}
          </span>

          {/* Icon */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `rgba(${rgb},0.1)`,
              border: `1px solid rgba(${rgb},0.2)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
              boxShadow: hovered ? `0 0 20px rgba(${rgb},0.15)` : 'none',
            }}
            aria-hidden="true"
          >
            <span style={{ color: svc.accentColor, display: 'flex' }}>
              <RenderIcon name={svc.icon} className="w-5 h-5" />
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 'clamp(22px, 2.4vw, 30px)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: 16,
              fontFamily: 'var(--font-azonix), sans-serif',
            }}
          >
            {svc.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 24,
              maxWidth: 420,
              fontFamily: 'var(--font-roboto), sans-serif',
            }}
          >
            {svc.description}
          </p>

          {/* Feature pills */}
          {svc.features && svc.features.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 28,
              }}
            >
              {svc.features.slice(0, 5).map((feat) => (
                <span
                  key={feat}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.45)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontFamily: 'var(--font-roboto), sans-serif',
                    transition: 'background 0.2s ease, color 0.2s ease',
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <Link
            href={svc.ctaHref || '#contact'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 600,
              color: svc.accentColor,
              textDecoration: 'none',
              fontFamily: 'var(--font-roboto), sans-serif',
              transition: 'gap 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = '14px' }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = '8px' }}
          >
            {svc.ctaLabel || 'Learn more'}
            <ArrowRight size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
          </Link>
        </div>

        {/* Image illustration (if provided via admin) */}
        {svc.imageUrl && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 'auto',
              padding: '0 20px',
              borderRadius: '12px 12px 0 0',
              overflow: 'hidden',
              boxShadow: '0 -16px 48px rgba(0,0,0,0.6)',
            }}
            aria-hidden="true"
          >
            <Image
              src={svc.imageUrl}
              alt=""
              width={460}
              height={200}
              style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Built-in SVG illustration when no image set */}
        {!svc.imageUrl && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              marginTop: 'auto',
              padding: '0 20px',
              borderRadius: '12px 12px 0 0',
              overflow: 'hidden',
              boxShadow: '0 -16px 48px rgba(0,0,0,0.6)',
            }}
            aria-hidden="true"
          >
            <DefaultIllustration accent={svc.accentColor} rgb={rgb} type={index % 2 === 0 ? 'ai' : 'web'} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Standard Card (3-col body cards)
// ─────────────────────────────────────────────────────────────────────────────
function StandardCard({
  svc,
  index,
  spotlight,
}: {
  svc: ServiceRecord
  index: number
  spotlight: { x: number; y: number; visible: boolean }
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const rgb = useMemo(() => hexToRgb(svc.accentColor), [svc.accentColor])
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 36, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.85, delay: 0.1 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ flex: '1 1 280px', minWidth: 0 }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          background: '#0e0e16',
          padding: '32px 28px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'default',
          willChange: 'transform',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered && !reduced ? 'translateY(-6px) scale(1.005)' : 'translateY(0) scale(1)',
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(${rgb},0.2)`
            : '0 0 0 1px rgba(255,255,255,0.06)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Cursor spotlight */}
        {spotlight.visible && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -1,
              borderRadius: 'inherit',
              background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${rgb},0.1), transparent 40%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Corner gradient */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 180,
            height: 180,
            background: `radial-gradient(ellipse at top right, rgba(${rgb},0.08) 0%, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Grain */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: NOISE_SVG,
            backgroundRepeat: 'repeat',
            opacity: 0.4,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Top shimmer line */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: hovered
              ? `linear-gradient(90deg, transparent, rgba(${rgb},0.5), transparent)`
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            transition: 'background 0.4s ease',
            zIndex: 2,
          }}
        />

        {/* Icon */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `rgba(${rgb},0.1)`,
            border: `1px solid rgba(${rgb},0.18)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            flexShrink: 0,
            transition: 'box-shadow 0.3s ease',
            boxShadow: hovered ? `0 0 16px rgba(${rgb},0.12)` : 'none',
          }}
          aria-hidden="true"
        >
          <span style={{ color: svc.accentColor, display: 'flex', width: 18, height: 18 }}>
            <RenderIcon name={svc.icon} className="w-full h-full" />
          </span>
        </div>

        {/* Category */}
        <span
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'block',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: `rgba(${rgb},0.7)`,
            marginBottom: 12,
            fontFamily: 'var(--font-roboto), sans-serif',
          }}
        >
          {svc.categoryLabel || svc.title}
        </span>

        {/* Title */}
        <h3
          style={{
            position: 'relative',
            zIndex: 3,
            fontSize: 18,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.25,
            marginBottom: 14,
            fontFamily: 'var(--font-azonix), sans-serif',
          }}
        >
          {svc.title}
        </h3>

        {/* Description */}
        <p
          style={{
            position: 'relative',
            zIndex: 3,
            fontSize: 13,
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.45)',
            marginBottom: 20,
            flexGrow: 1,
            fontFamily: 'var(--font-roboto), sans-serif',
          }}
        >
          {svc.description}
        </p>

        {/* Feature pills */}
        {svc.features && svc.features.length > 0 && (
          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 20,
            }}
          >
            {svc.features.slice(0, 4).map((feat) => (
              <span
                key={feat}
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.38)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 999,
                  padding: '3px 10px',
                  fontFamily: 'var(--font-roboto), sans-serif',
                }}
              >
                {feat}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <Link
          href={svc.ctaHref || '#contact'}
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: svc.accentColor,
            textDecoration: 'none',
            marginTop: 'auto',
            fontFamily: 'var(--font-roboto), sans-serif',
            transition: 'gap 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = '11px' }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = '6px' }}
        >
          {svc.ctaLabel || 'Learn more'}
          <ArrowRight size={12} aria-hidden="true" style={{ flexShrink: 0 }} />
        </Link>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Default SVG Illustrations
// ─────────────────────────────────────────────────────────────────────────────
function DefaultIllustration({ accent, rgb, type }: { accent: string; rgb: string; type: 'ai' | 'web' }) {
  if (type === 'ai') {
    return (
      <svg viewBox="0 0 480 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect width="480" height="200" rx="12" fill="#0d0d14" />
        <rect width="480" height="30" rx="12" fill="#13131f" />
        <rect x="12" y="9" width="7" height="7" rx="3.5" fill="#e85454" />
        <rect x="24" y="9" width="7" height="7" rx="3.5" fill="#e8a054" />
        <rect x="36" y="9" width="7" height="7" rx="3.5" fill="#54e88a" />
        <text x="200" y="19" fill="#ffffff30" fontSize="9" textAnchor="middle" fontFamily="monospace">asagus · ai pipeline</text>
        {/* Code lines */}
        {[40, 52, 64, 76, 88, 100, 112, 124].map((y, i) => (
          <rect key={y} x="16" y={y} width={60 + (i % 3) * 30} height="5" rx="2.5" fill={`rgba(${rgb},${0.1 + (i % 3) * 0.08})`} />
        ))}
        {/* Neural net */}
        {[65, 95, 125].map(y => <circle key={`l1-${y}`} cx="195" cy={y} r="6" fill={accent} opacity="0.8" />)}
        {[55, 80, 105, 130, 155].map(y => <circle key={`l2-${y}`} cx="250" cy={y} r="5" fill={accent} opacity="0.5" />)}
        {[70, 105, 140].map(y => <circle key={`l3-${y}`} cx="305" cy={y} r="6" fill={accent} opacity="0.7" />)}
        {[85, 115].map(y => <circle key={`l4-${y}`} cx="360" cy={y} r="7" fill={accent} opacity="0.9" />)}
        {[65, 95, 125].flatMap(y1 => [55, 80, 105, 130, 155].map(y2 => (
          <line key={`c1-${y1}-${y2}`} x1="201" y1={y1} x2="244" y2={y2} stroke={`rgba(${rgb},0.08)`} strokeWidth="1" />
        )))}
        {[55, 80, 105, 130, 155].flatMap(y1 => [70, 105, 140].map(y2 => (
          <line key={`c2-${y1}-${y2}`} x1="255" y1={y1} x2="299" y2={y2} stroke={`rgba(${rgb},0.08)`} strokeWidth="1" />
        )))}
        {[70, 105, 140].flatMap(y1 => [85, 115].map(y2 => (
          <line key={`c3-${y1}-${y2}`} x1="311" y1={y1} x2="353" y2={y2} stroke={`rgba(${rgb},0.08)`} strokeWidth="1" />
        )))}
        <rect x="390" y="48" width="72" height="60" rx="8" fill="#13131f" />
        <text x="426" y="64" fill="#ffffff50" fontSize="7" textAnchor="middle" fontFamily="monospace">ACCURACY</text>
        <text x="426" y="80" fill={accent} fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="monospace">98.2%</text>
        <rect x="400" y="92" width="52" height="4" rx="2" fill="#ffffff10" />
        <rect x="400" y="92" width="45" height="4" rx="2" fill={`rgba(${rgb},0.6)`} />
        <rect y="170" width="480" height="30" fill="#0d0d14" />
        <circle cx="18" cy="185" r="3.5" fill="#54e88a" opacity="0.85" />
        <text x="28" y="189" fill="#ffffff40" fontSize="8" fontFamily="monospace">Model training complete</text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 480 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="480" height="200" rx="12" fill="#0d0d14" />
      <rect width="480" height="30" rx="12" fill="#13131f" />
      <rect x="12" y="9" width="7" height="7" rx="3.5" fill="#e85454" />
      <rect x="24" y="9" width="7" height="7" rx="3.5" fill="#e8a054" />
      <rect x="36" y="9" width="7" height="7" rx="3.5" fill="#54e88a" />
      <rect x="130" y="7" width="220" height="15" rx="7.5" fill="#1e1e2e" />
      <text x="240" y="18" fill="#ffffff30" fontSize="7" textAnchor="middle" fontFamily="monospace">https://app.asagus.com</text>
      {/* Sidebar */}
      <rect y="30" width="64" height="170" fill="#111118" />
      {[46, 60, 74, 88, 102].map((y, i) => (
        <rect key={y} x="10" y={y} width="44" height="7" rx="3.5" fill={i === 0 ? `rgba(${rgb},0.3)` : '#ffffff12'} />
      ))}
      {/* Main */}
      <rect x="72" y="38" width="395" height="22" rx="5" fill="#13131f" />
      <text x="86" y="53" fill="#ffffff60" fontSize="9" fontFamily="sans-serif">Dashboard</text>
      <rect x="393" y="43" width="56" height="11" rx="5.5" fill={accent} />
      <text x="421" y="52" fill="#ffffff" fontSize="7" textAnchor="middle" fontFamily="sans-serif">New +</text>
      {/* KPI cards */}
      {[
        { x: 72, label: 'USERS', val: '12.4k', color: accent },
        { x: 162, label: 'REVENUE', val: '$48k', color: '#34d399' },
        { x: 252, label: 'UPTIME', val: '99.9%', color: '#a78bfa' },
        { x: 342, label: 'GROWTH', val: '↑ 34%', color: '#fb923c' },
      ].map((kpi) => (
        <g key={kpi.label}>
          <rect x={kpi.x} y="68" width="82" height="40" rx="7" fill="#13131f" />
          <text x={kpi.x + 8} y="82" fill="#ffffff50" fontSize="6" fontFamily="sans-serif">{kpi.label}</text>
          <text x={kpi.x + 8} y="98" fill={kpi.color} fontSize="12" fontWeight="700" fontFamily="monospace">{kpi.val}</text>
        </g>
      ))}
      {/* Chart */}
      <rect x="72" y="116" width="254" height="74" rx="7" fill="#13131f" />
      <text x="82" y="130" fill="#ffffff50" fontSize="7" fontFamily="sans-serif">Weekly Traffic</text>
      {[0,1,2,3,4,5,6].map((i) => {
        const hs = [24, 38, 30, 50, 42, 56, 38]
        return <rect key={i} x={84 + i * 32} y={182 - hs[i]} width="16" height={hs[i]} rx="2.5" fill={i === 5 ? accent : `rgba(${rgb},0.15)`} />
      })}
      {/* Table */}
      <rect x="334" y="116" width="130" height="74" rx="7" fill="#13131f" />
      <text x="344" y="130" fill="#ffffff50" fontSize="7" fontFamily="sans-serif">Recent</text>
      {[0,1,2,3].map(i => <rect key={i} x={344} y={138 + i * 12} width="100" height="6" rx="3" fill={i === 0 ? `rgba(${rgb},0.15)` : '#ffffff06'} />)}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────────────────────────────────────
export function ServicesShowcase({ services }: { services: ServiceRecord[] }) {
  const reduced = useReducedMotion()
  const headRef = useRef<HTMLDivElement>(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })
  const { containerRef, spotlight } = useSpotlight()

  // Split into hero and standard based on admin-controlled cardType
  const heroCards = services.filter((s) => s.cardType === 'hero')
  const standardCards = services.filter((s) => s.cardType !== 'hero')

  return (
    <section
      id="services"
      aria-label="Our Services"
      ref={containerRef}
      style={{
        position: 'relative',
        background: 'transparent',
        padding: '110px 0 100px',
        overflow: 'hidden',
      }}
    >
      {/* Ambient orbs */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-60px', left: '12%',
          width: 550, height: 550, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30px', right: '10%',
          width: 450, height: 450, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <motion.div
          ref={headRef}
          style={{ textAlign: 'center', marginBottom: 80 }}
          initial={reduced ? false : { opacity: 0, y: 32, filter: 'blur(4px)' }}
          animate={headInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            marginBottom: 24,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#3b82f6', display: 'inline-block',
              boxShadow: '0 0 6px rgba(59,130,246,0.5)',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.13em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-roboto), sans-serif',
            }}>
              What We Offer
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(38px, 5.8vw, 72px)', fontWeight: 800,
            color: '#ffffff', lineHeight: 1.05, marginBottom: 20,
            fontFamily: 'var(--font-azonix), sans-serif',
          }}>
            Services That{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Drive Results
            </span>
          </h2>

          <p style={{
            fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.42)',
            maxWidth: 580, margin: '0 auto',
            fontFamily: 'var(--font-roboto), sans-serif',
          }}>
            From AI-powered systems to polished web products — we architect and
            ship end-to-end solutions that scale with your ambitions.
          </p>
        </motion.div>

        {/* ── Hero Cards ───────────────────────────────────────────────────── */}
        {heroCards.length > 0 && (
          <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
            {heroCards.map((svc, i) => (
              <HeroCard key={svc.id} svc={svc} index={i} spotlight={spotlight} />
            ))}
          </div>
        )}

        {/* ── Standard Cards ───────────────────────────────────────────────── */}
        {standardCards.length > 0 && (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {standardCards.map((svc, i) => (
              <StandardCard key={svc.id} svc={svc} index={i} spotlight={spotlight} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <motion.div
          style={{ textAlign: 'center', marginTop: 64 }}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0.2, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="#contact"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 30px', borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              fontFamily: 'var(--font-roboto), sans-serif',
              transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.1)'
              el.style.borderColor = 'rgba(255,255,255,0.22)'
              el.style.color = '#ffffff'
              el.style.boxShadow = '0 4px 24px rgba(255,255,255,0.06)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.05)'
              el.style.borderColor = 'rgba(255,255,255,0.12)'
              el.style.color = 'rgba(255,255,255,0.85)'
              el.style.boxShadow = 'none'
            }}
          >
            Start a Project with Us
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
