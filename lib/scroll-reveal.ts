"use client"

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let initialized = false
let gsapContext: gsap.Context | null = null
const refreshHandler = () => {
  gsap.set('.parallax-item', { willChange: 'transform' })
}

export function initScrollReveal() {
  if (initialized || typeof window === 'undefined') return

  initialized = true
  gsap.registerPlugin(ScrollTrigger)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    initialized = false
    return
  }

  gsapContext = gsap.context(() => {
    const fadeElements = gsap.utils.toArray<HTMLElement>('.reveal-fade')
    fadeElements.forEach((element) => {
      gsap.set(element, { opacity: 0, y: 40, willChange: 'transform, opacity' })
      gsap
        .timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
        .to(element, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          onComplete: () => element.style.removeProperty('will-change'),
        })
    })

    const staggerSections = gsap.utils.toArray<HTMLElement>('.reveal-stagger')
    staggerSections.forEach((section) => {
      const children = Array.from(section.querySelectorAll<HTMLElement>('[data-stagger-child]'))
      if (!children.length) return

      gsap.set(children, { opacity: 0, y: 30, willChange: 'transform, opacity' })
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: false,
          },
        })
        .to(children, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          onComplete: () =>
            children.forEach((child) => child.style.removeProperty('will-change')),
        })
    })

    const parallaxItems = gsap.utils.toArray<HTMLElement>('.parallax-item')
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallaxDepth ?? '0.25')
      gsap
        .timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
        .fromTo(
          item,
          { yPercent: depth * -20 },
          { yPercent: depth * 20, ease: 'none' }
        )
    })
  })

  ScrollTrigger.addEventListener('refreshInit', refreshHandler)

  ScrollTrigger.refresh()
}

export function destroyScrollReveal() {
  if (!initialized) return

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  ScrollTrigger.clearMatchMedia()
  ScrollTrigger.removeEventListener('refreshInit', refreshHandler)
  gsapContext?.revert()
  gsapContext = null
  initialized = false
}
