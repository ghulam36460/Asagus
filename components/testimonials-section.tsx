"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Section } from './section'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      image: '/images/testimonials/client-1.jpg',
      content: 'HINX transformed our online presence. Their creative approach and technical expertise delivered results beyond our expectations. Our conversion rate increased by 250%!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Marketing Director, GrowthCo',
      image: '/images/testimonials/client-2.jpg',
      content: 'Working with HINX was a game-changer. They understood our vision and brought it to life with stunning design and flawless execution. Highly recommend!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Founder, Creative Studios',
      image: '/images/testimonials/client-3.jpg',
      content: 'The team\'s attention to detail and dedication to our project was outstanding. They delivered on time, on budget, and exceeded every milestone. True professionals.',
      rating: 5,
    },
  ]

  const marqueeTestimonials = [...testimonials, ...testimonials]
  const carouselRows = [
    { direction: 'left', speed: 28 },
    { direction: 'right', speed: 32 },
  ]

  return (
    <Section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black min-h-[120vh] flex items-center"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-80 h-80 bg-brand-blue/10 blur-[140px] parallax-item" data-parallax-depth="0.2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[160px] parallax-item" data-parallax-depth="0.25"></div>
      </div>

      <div className="relative max-w-6xl mx-auto reveal-stagger">
        <div className="text-center mb-16 reveal-fade" data-stagger-child>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 dark:bg-white/10 text-brand-blue text-xs font-semibold uppercase tracking-[0.3em] mb-8 backdrop-blur">
            Voices we trust
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight text-gray-900 dark:text-white mb-6">
            Proof that partnerships <span className="bg-gradient-to-r from-brand-blue via-blue-500 to-purple-600 bg-clip-text text-transparent">move the needle</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Growing brands trust us to craft digital experiences that feel human. Slide through a few of the unfiltered love letters.
          </p>
        </div>

        <div className="space-y-8" data-stagger-child>
          {carouselRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex gap-8 w-full"
              animate={{
                x:
                  row.direction === 'left'
                    ? ['0%', '-50%']
                    : ['-50%', '0%'],
              }}
              transition={{ duration: row.speed, repeat: Infinity, ease: 'linear' }}
            >
              {marqueeTestimonials.map((testimonial, idx) => (
                <article
                  key={`${rowIndex}-${testimonial.id}-${idx}`}
                  className="group relative flex min-w-[280px] sm:min-w-[320px] lg:min-w-[360px] flex-col gap-5 rounded-3xl border border-white/20 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/70 p-6 backdrop-blur-xl shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-blue/5 via-transparent to-purple-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-brand-blue text-brand-blue" />
                      ))}
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">
                      Verified
                    </span>
                  </div>
                  <p className="relative z-10 text-base leading-relaxed text-gray-700 dark:text-gray-200">
                    “{testimonial.content}”
                  </p>
                  <div className="relative z-10 flex items-center gap-4 border-t border-gray-200/60 dark:border-gray-800/70 pt-5 mt-auto">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-500 text-white font-display text-xl flex items-center justify-center">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </motion.div>
          ))}
        </div>

        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-white/30 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl p-8 reveal-fade"
          data-stagger-child
        >
          <div className="text-center">
            <p className="font-display text-4xl text-brand-blue mb-2">98%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Client satisfaction</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl text-brand-blue mb-2">4.9/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average rating</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl text-brand-blue mb-2">85%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Repeat clients</p>
          </div>
          <div className="text-center">
            <p className="font-display text-4xl text-brand-blue mb-2">24/7</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Agency support</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
