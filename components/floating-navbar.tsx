'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

// You should define 'brand-blue' in your tailwind.config.js file
// or replace it with an existing color like 'blue-600'
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Project', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export function FloatingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close when clicking outside of the drawer
  useEffect(() => {
    if (!isMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Check if the click is inside the drawer or on the trigger button
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-6 left-1/2 z-[1100] flex w-full -translate-x-1/2 justify-center px-4"
      >
        <div className="relative w-full max-w-3xl">
          {/* Desktop/Tablet: show full floating pill */}
          <div className="hidden md:block">
            {/* Outer Gradient Glow (Now 85% opacity) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue via-blue-500 to-purple-500 opacity-[0.85] blur-md" aria-hidden="true"></div>

            {/* Main Floating Pill (Height increased) */}
            <div className="relative flex w-full items-center justify-between gap-4 rounded-full border border-white/30 bg-white/20 text-gray-900 shadow-[0_25px_80px_rgba(15,23,42,0.25)] backdrop-blur-[20px] px-8 py-5 sm:px-12 sm:py-6 dark:border-white/20 dark:bg-white/5 dark:text-white">
              {/* Desktop Links (Now using justify-evenly) */}
              <div className="hidden w-full items-center justify-evenly md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-center text-sm font-semibold text-gray-900 transition hover:bg-white/80 hover:text-gray-900/80 dark:text-white dark:hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: only show a minimal toggle button, no pill */}
          <div className="md:hidden flex w-full justify-start">
            <button
              type="button"
              data-menu-trigger
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg dark:bg-white/80"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-drawer"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay Backdrop */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[1040] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Drawer (Slides from the left on small screens) */}
            <motion.aside
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-[1060] w-72 bg-gradient-to-b from-brand-blue/95 via-blue-900 to-black text-white shadow-[0_25px_80px_rgba(3,7,18,0.6)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold text-white">Navigation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 px-6 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="rounded-2xl bg-white/5 px-4 py-3 text-base font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}