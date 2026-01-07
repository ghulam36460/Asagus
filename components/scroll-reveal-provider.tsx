"use client"

import { type ReactNode, useEffect } from 'react'
import { initScrollReveal, destroyScrollReveal } from '@/lib/scroll-reveal'

export function ScrollRevealProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initScrollReveal()
    return () => {
      destroyScrollReveal()
    }
  }, [])

  return <>{children}</>
}
