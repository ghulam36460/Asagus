'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CardEntry } from '@/data/cards'

interface CarouselCardProps {
  card: CardEntry
  isActive: boolean
  onClick: () => void
}

// Gradient accents per category
const CATEGORY_GRADIENTS: Record<string, string> = {
  'Web Development': 'from-indigo-500/20 via-purple-500/10 to-transparent',
  'AI & Machine Learning': 'from-cyan-500/20 via-blue-500/10 to-transparent',
  'Brand Design': 'from-rose-500/20 via-pink-500/10 to-transparent',
  'Mobile Development': 'from-emerald-500/20 via-teal-500/10 to-transparent',
}

const CATEGORY_GLOW: Record<string, string> = {
  'Web Development': 'rgba(99,102,241,0.35)',
  'AI & Machine Learning': 'rgba(34,211,238,0.35)',
  'Brand Design': 'rgba(244,63,94,0.35)',
  'Mobile Development': 'rgba(16,185,129,0.35)',
}

export function CarouselCard({ card, isActive, onClick }: CarouselCardProps) {
  const gradientClass =
    CATEGORY_GRADIENTS[card.category] ?? 'from-indigo-500/20 via-purple-500/10 to-transparent'
  const glowColor = CATEGORY_GLOW[card.category] ?? 'rgba(99,102,241,0.35)'

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        isActive
          ? {
              y: -6,
              boxShadow: `0 28px 80px ${glowColor}`,
            }
          : {}
      }
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{
        width: 320,
        height: 480,
        borderRadius: 22,
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: isActive
          ? `0 0 60px ${glowColor}, 0 2px 40px rgba(0,0,0,0.5)`
          : `0 0 30px rgba(99,102,241,0.08), 0 2px 20px rgba(0,0,0,0.4)`,
        overflow: 'hidden',
      }}
    >
      {/* Top gradient accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass} pointer-events-none z-0`}
      />

      {/* Image / Visual area */}
      <div className="relative w-full h-[200px] overflow-hidden z-10">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="320px"
          />
        ) : (
          /* Placeholder abstract shape */
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-full opacity-40"
              style={{
                background: `radial-gradient(circle, ${glowColor}, transparent)`,
                boxShadow: `0 0 60px ${glowColor}`,
              }}
            />
            <div
              className="absolute w-16 h-16 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, #fff, transparent)` }}
            />
          </div>
        )}
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a14] to-transparent" />
      </div>

      {/* Content area */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-5 pb-6 h-[280px]">
        {/* Card ID */}
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            color: '#555',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          #{card.id}
        </span>

        {/* Title */}
        <h3
          className="mt-2 mb-3 leading-tight"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
            lineHeight: 1.2,
          }}
        >
          {card.title}
        </h3>

        {/* Description */}
        <p
          className="flex-1 overflow-hidden"
          style={{
            fontSize: 13.5,
            lineHeight: 1.7,
            color: '#888',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {card.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {card.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#999',
                letterSpacing: '0.05em',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        {card.link && (
          <Link
            href={card.link}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mt-auto"
            style={{ color: isActive ? '#a5b4fc' : 'rgba(165,180,252,0.5)' }}
          >
            View Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
