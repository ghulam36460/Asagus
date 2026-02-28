'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AnnouncementBar } from './announcement-bar'
import { FloatingNavbar } from './floating-navbar'

export function SiteHeader() {
  const [barVisible, setBarVisible] = useState(true)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--announcement-height',
      barVisible ? '44px' : '0px'
    )
  }, [barVisible])

  // Set initial CSS variable on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--announcement-height', '44px')
  }, [])

  return (
    <>
      <AnimatePresence>
        {barVisible && (
          <motion.div
            key="announcement"
            initial={{ height: 44, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1200 }}
          >
            <AnnouncementBar visible={barVisible} onDismiss={() => setBarVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingNavbar barOffset={barVisible ? 44 : 0} />
    </>
  )
}
