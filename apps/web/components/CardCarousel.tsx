'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { gsap } from 'gsap'
import { CarouselCard } from './CarouselCard'
import { useCards } from '@/hooks/useCards'

// ── Constants ─────────────────────────────────────────────────────────────────
const CARD_WIDTH = 320          // active card DOM width
const CARD_GAP   = 36           // gap between cards (px)
const CARD_STEP  = CARD_WIDTH + CARD_GAP
const AUTOPLAY_INTERVAL = 3800  // ms

// SSR-safe layout effect
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// ── Component ─────────────────────────────────────────────────────────────────
export function CardCarousel() {
  const { cards, loading } = useCards()
  const [activeIndex, setActiveIndex] = useState(0)

  const trackRef  = useRef<HTMLDivElement>(null)
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const autoRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStart = useRef<number | null>(null)

  const total = cards.length

  // Keep cardRefs in sync with card count
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, total)
  }, [total])

  // ── Core animation ───────────────────────────────────────────────────────
  const animateTo = useCallback(
    (index: number) => {
      if (!trackRef.current) return

      // Container width (read at animation time for responsiveness)
      const containerWidth =
        trackRef.current.parentElement?.clientWidth ?? window.innerWidth

      const offsetX =
        containerWidth / 2 - CARD_WIDTH / 2 - index * CARD_STEP

      // Slide the track
      gsap.to(trackRef.current, {
        x: offsetX,
        duration: 0.62,
        ease: 'power3.out',
      })

      // Scale/fade each card
      cardRefs.current.forEach((ref, i) => {
        if (!ref) return
        const isActive = i === index
        gsap.to(ref, {
          scale:   isActive ? 1    : 0.82,
          opacity: isActive ? 1    : 0.52,
          filter:  isActive ? 'saturate(1) brightness(1)' : 'saturate(0.6) brightness(0.8)',
          duration: 0.5,
          ease: 'power2.out',
        })
      })
    },
    [],
  )

  // ── Initial render ───────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    if (total === 0) return
    animateTo(activeIndex)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  // Animate whenever active index changes
  useEffect(() => {
    if (total === 0) return
    animateTo(activeIndex)
  }, [activeIndex, animateTo, total])

  // ── Auto-play ────────────────────────────────────────────────────────────
  const resetAutoplay = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total)
    }, AUTOPLAY_INTERVAL)
  }, [total])

  useEffect(() => {
    if (total === 0) return
    resetAutoplay()
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
    }
  }, [resetAutoplay, total])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index)
      resetAutoplay()
    },
    [resetAutoplay],
  )

  // ── Drag / swipe ─────────────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(delta) < 40) return
    if (delta < 0) goTo(Math.min(activeIndex + 1, total - 1))
    else           goTo(Math.max(activeIndex - 1, 0))
  }

  if (loading) {
    return (
      <section
        className="w-full flex items-center justify-center"
        style={{ height: 620, background: '#0a0a14' }}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: 'rgba(255,255,255,0.3)',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id="projects"
      style={{ background: '#0a0a14', overflow: 'hidden' }}
      className="relative w-full py-20 flex flex-col items-center"
    >
      {/* ── Ambient glow backdrop ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Section header ── */}
      <div className="relative z-10 text-center mb-14 px-6">
        <p
          className="mb-3 font-semibold uppercase tracking-[0.3em]"
          style={{ fontSize: 11, color: '#555' }}
        >
          Our Work
        </p>
        <h2
          className="font-display leading-tight"
          style={{ fontSize: 'clamp(36px,5vw,60px)', color: '#fff', fontWeight: 700 }}
        >
          Featured Projects
        </h2>
      </div>

      {/* ── Carousel viewport ── */}
      <div
        className="relative w-full"
        style={{ height: 520, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={(e) => {
          if (dragStart.current !== null) onPointerUp(e)
        }}
      >
        {/* Track — GSAP moves this */}
        <div
          ref={trackRef}
          className="absolute top-0 flex items-center"
          style={{
            gap: CARD_GAP,
            height: '100%',
            paddingTop: 20,
            paddingBottom: 20,
            willChange: 'transform',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el }}
              style={{ flexShrink: 0 }}
            >
              <CarouselCard
                card={card}
                isActive={i === activeIndex}
                onClick={() => goTo(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation dots ── */}
      <div className="relative z-10 flex items-center gap-2.5 mt-8">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to card ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width:  i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 999,
              background:
                i === activeIndex
                  ? '#6366f1'
                  : 'rgba(255,255,255,0.18)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ── Edge fade masks ── */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-28 z-20"
        style={{
          background: 'linear-gradient(to right, #0a0a14 0%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-28 z-20"
        style={{
          background: 'linear-gradient(to left, #0a0a14 0%, transparent 100%)',
        }}
      />
    </section>
  )
}
