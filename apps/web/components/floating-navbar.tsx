'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '#projects' },
  { label: 'Research', href: '/research-development' },
  { label: 'Services', href: '#services' },
  { label: 'Enterprise', href: '#enterprise' },
  { label: 'Contact', href: '#contact' },
]

export function FloatingNavbar({ barOffset = 44 }: { barOffset?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (drawerRef.current?.contains(target)) return
      if (target.closest('[data-menu-trigger]')) return
      setIsMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isMenuOpen])

  const handleLinkClick = () => setIsMenuOpen(false)

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed',
          top: `${barOffset}px`,
          left: 0,
          transition: 'top 0.3s ease',
          right: 0,
          zIndex: 1100,
          background: 'rgba(12, 8, 30, 0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Desktop bar */}
        <div
          className="hidden md:flex items-center"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
            height: '60px',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-azonix), sans-serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            ASAGUS
          </Link>

          {/* Center links */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  fontFamily: 'var(--font-roboto), sans-serif',
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <Link
              href="#contact"
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.9)',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.45)',
                borderRadius: '6px',
                padding: '7px 18px',
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 500,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)'
                e.currentTarget.style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
              }}
            >
              Book a Demo →
            </Link>
            <Link
              href="/login"
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontFamily: 'var(--font-roboto), sans-serif',
                fontWeight: 400,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Mobile bar */}
        <div
          className="md:hidden flex items-center justify-between"
          style={{ padding: '0 1.25rem', height: '56px' }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-azonix), sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textDecoration: 'none',
            }}
          >
            ASAGUS
          </Link>
          <button
            type="button"
            data-menu-trigger
            onClick={() => setIsMenuOpen((prev) => !prev)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
            }}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1040,
                background: 'rgba(0,0,0,0.5)',
              }}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 1060,
                width: '260px',
                background: 'rgba(8,6,20,0.97)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-azonix), sans-serif',
                    fontSize: '1rem',
                    color: '#ffffff',
                    letterSpacing: '0.08em',
                  }}
                >
                  ASAGUS
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ffffff',
                  }}
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', gap: '0.25rem' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-roboto), sans-serif',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                      e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link
                    href="#contact"
                    onClick={handleLinkClick}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-roboto), sans-serif',
                      border: '1px solid rgba(255,255,255,0.35)',
                      textAlign: 'center',
                    }}
                  >
                    Book a Demo →
                  </Link>
                  <Link
                    href="/login"
                    onClick={handleLinkClick}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-roboto), sans-serif',
                      textAlign: 'center',
                    }}
                  >
                    Log In
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}