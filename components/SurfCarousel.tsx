'use client'

/**
 * SurfCarousel.tsx
 * ---------------------
 * Center-spotlight card carousel.
 * - Framer Motion: drag + spring snap
 * - Tailwind: utility base classes
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react'
import {
  motion,
  useMotionValue,
  animate,
  type PanInfo,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface CardData {
  id: number
  type: 'NEWS' | 'GALLERY'
  image: string
  headline: string
  timestamp: string
  bgColor: string
  readMoreUrl: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — swap images / content to match Asagus projects
// ─────────────────────────────────────────────────────────────────────────────
const CARDS: CardData[] = [
  {
    id: 1,
    type: 'NEWS',
    image: '/images/logbog.png',
    headline: 'LOGBOG — Full-Stack Blogging Platform',
    timestamp: '2024',
    bgColor: '#4338CA', // vibrant indigo — matches the modern web/React palette
    readMoreUrl: '/projects/logbog',
  },
  {
    id: 2,
    type: 'NEWS',
    image: '/images/vocalexpert.png',
    headline: 'AI Vocal Expert — Speech & Face Auth System',
    timestamp: '2024',
    bgColor: '#0369A1', // electric sky blue — AI / tech energy
    readMoreUrl: '/projects/ai-vocal-expert',
  },
  {
    id: 3,
    type: 'GALLERY',
    image: '/images/gs.png',
    headline: 'GS Dashboard — Enterprise CRM Solution',
    timestamp: '2024',
    bgColor: '#0F766E', // deep vibrant teal — data / enterprise feel
    readMoreUrl: '/projects/gs-dashboard',
  },
  {
    id: 4,
    type: 'NEWS',
    image: '/images/carosal-3.jpg',
    headline: 'Complete Brand Identity Redesign',
    timestamp: '2024',
    bgColor: '#9333EA', // vivid purple — creative / design energy
    readMoreUrl: '/projects/brand-identity-redesign',
  },
  {
    id: 5,
    type: 'NEWS',
    image: '/images/grilli.png',
    headline: 'Grilli — Premium Restaurant Web Experience',
    timestamp: '2024',
    bgColor: '#C2410C', // deep amber-orange — warm, appetising restaurant tones
    readMoreUrl: '/projects/grilli-restaurant',
  },
]

const BADGE_COLORS: Record<string, string> = {
  NEWS: '#E8412A',
  GALLERY: '#F5A623',
}

// ─────────────────────────────────────────────────────────────────────────────
// Drag-cursor oval
// ─────────────────────────────────────────────────────────────────────────────
function DragCursorOval({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        position: 'absolute',
        right: 28,
        top: '50%',
        translateY: '-50%',
        width: 90,
        height: 55,
        borderRadius: 50,
        border: '2.5px solid rgba(255,255,255,0.9)',
        background: 'transparent',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 9h12M11 6l4 3-4 3"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual card
// ─────────────────────────────────────────────────────────────────────────────
interface SurfCardProps {
  card: CardData
  isActive: boolean
}

function SurfCard({ card, isActive }: SurfCardProps) {
  const [hovering, setHovering] = useState(false)

  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0.95,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 1 }}
      onHoverStart={() => isActive && setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        height: '76vh',
        minHeight: 460,
        boxShadow: isActive
          ? '0 32px 90px rgba(0,0,0,0.55)'
          : '0 16px 48px rgba(0,0,0,0.22)',
        cursor: 'grab',
        willChange: 'transform',
        userSelect: 'none',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Full-bleed background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.headline}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          zIndex: 0,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        onError={(e) => {
          // fallback gradient if image 404s
          const el = e.currentTarget
          el.style.display = 'none'
        }}
      />

      {/* Colour-tinted fallback bg (shows ONLY if image fails to load) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${card.bgColor}cc 0%, #0a0a1a 100%)`,
          zIndex: -1,
        }}
      />

      {/* Gradient overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.72) 100%)',
          zIndex: 1,
        }}
      />

      {/* Category badge — top-left */}
      <span
        style={{
          position: 'absolute',
          top: 18,
          left: 18,
          zIndex: 3,
          background: BADGE_COLORS[card.type] ?? '#E8412A',
          color: '#fff',
          borderRadius: 999,
          padding: '5px 14px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {card.type}
      </span>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 20,
          right: 20,
          zIndex: 3,
          fontSize: 'clamp(18px, 2.4vw, 26px)',
          fontWeight: 800,
          color: '#fff',
          lineHeight: 1.22,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.headline}
      </div>

      {/* Timestamp */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 20,
          zIndex: 3,
          fontSize: 13,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        {card.timestamp}
      </div>

      {/* Read More CTA */}
      <a
        href={card.readMoreUrl}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.8)',
            flexShrink: 0,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path
              d="M2 4.5h5M5 2.5l2 2-2 2"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        Read more
      </a>

      {/* Drag cursor oval — only on active card */}
      {isActive && <DragCursorOval visible={hovering} />}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main carousel
// ─────────────────────────────────────────────────────────────────────────────
const DRAG_THRESHOLD = 80
const SPRING        = { type: 'spring' as const, stiffness: 280, damping: 30, mass: 1 }
const SPRING_WIDTH  = { type: 'spring' as const, stiffness: 240, damping: 26, mass: 1 }

// Active card takes ~55 % of viewport; side cards take ~21 % each
const ACTIVE_VW = 0.55
const SIDE_VW   = 0.21
const MAX_ACTIVE = 640
const MAX_SIDE   = 280
const CARD_GAP   = 24

function clampW(vw: number, frac: number, max: number) {
  return Math.min(Math.round(vw * frac), max)
}

export function SurfCarousel() {
  const total = CARDS.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const wasDragged = useRef(false)  // true during & just after a drag — suppresses click

  // Viewport-responsive card widths
  const [vw, setVw] = useState(0)
  useLayoutEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const activeW = vw ? clampW(vw, ACTIVE_VW, MAX_ACTIVE) : 480
  const sideW   = vw ? clampW(vw, SIDE_VW,   MAX_SIDE)   : 200

  // Track x motion value — drive the card-track position
  const x = useMotionValue(0)

  // Snap track to activeIndex=0 offset (center card is always the pivot)
  // x=0 means center card is centered. We only ever render 3 slots.
  const snapToCenter = useCallback(() => {
    animate(x, 0, SPRING)
  }, [x])

  // Advance to next/prev (with infinite wrap)
  const advance = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((prev) => (prev + dir + total) % total)
      snapToCenter()
    },
    [total, snapToCenter],
  )

  // Handle drag end
  const onDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false)
      // Reset wasDragged after the click event that follows pointerup has fired
      setTimeout(() => { wasDragged.current = false }, 0)
      const offset = info.offset.x
      const velocity = info.velocity.x

      if (offset < -DRAG_THRESHOLD || velocity < -400) {
        advance(1)
      } else if (offset > DRAG_THRESHOLD || velocity > 400) {
        advance(-1)
      } else {
        snapToCenter()
      }
    },
    [advance, snapToCenter],
  )

  // Build the 3 visible card indices
  const prevIdx = (activeIndex - 1 + total) % total
  const nextIdx = (activeIndex + 1) % total
  const slots   = [prevIdx, activeIndex, nextIdx]

  return (
    <section
      id="projects"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 72,
        paddingBottom: 60,
      }}
    >
      {/* background comes from body */}


      {/* ── Section header ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          textAlign: 'center',
          marginBottom: 40,
          color: '#fff',
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: 10,
          }}
        >
          Our Work
        </p>
        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 58px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Featured Projects
        </h2>
      </div>

      {/* ── Card track viewport (overflow hidden) ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Draggable track — x motion value drives position */}
        <motion.div
          drag="x"
          dragMomentum={false}
          dragElastic={0.06}
          style={{
            x,
            display: 'flex',
            alignItems: 'center',
            gap: CARD_GAP,
            cursor: isDragging ? 'grabbing' : 'grab',
            willChange: 'transform',
          }}
          onDragStart={() => { setIsDragging(true); wasDragged.current = true }}
          onDragEnd={onDragEnd}
        >
          {slots.map((cardIdx, slot) => {
            const isActive = slot === 1
            const slotW = isActive ? activeW : sideW
            return (
              <motion.div
                key={`${cardIdx}-${slot}`}
                layout
                animate={{ width: slotW }}
                transition={SPRING_WIDTH}
                onClick={() => {
                  if (wasDragged.current || isActive) return
                  advance(slot === 0 ? -1 : 1)
                }}
                style={{
                  flexShrink: 0,
                  overflow: 'visible',
                  cursor: isActive ? 'grab' : 'pointer',
                }}
              >
                <SurfCard
                  card={CARDS[cardIdx]}
                  isActive={isActive}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ── Navigation dots ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 32,
        }}
      >
        {CARDS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setActiveIndex(i)
              snapToCenter()
            }}
            animate={{
              width: i === activeIndex ? 28 : 8,
              background:
                i === activeIndex
                  ? 'rgba(255,255,255,1)'
                  : 'rgba(255,255,255,0.35)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{
              height: 8,
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Edge fade masks ── */}
      <div
        style={{
          position: 'absolute',
          zIndex: 6,
          top: 0,
          left: 0,
          bottom: 0,
          width: '10%',
          pointerEvents: 'none',
          background: 'linear-gradient(to right, var(--background, transparent) 0%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          zIndex: 6,
          top: 0,
          right: 0,
          bottom: 0,
          width: '10%',
          pointerEvents: 'none',
          background: 'linear-gradient(to left, var(--background, transparent) 0%, transparent 100%)',
        }}
      />
    </section>
  )
}
