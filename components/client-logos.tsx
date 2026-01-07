"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Section } from './section'

export function ClientLogos() {
  const clients = [
    { name: 'TechCorp', logo: 'TC' },
    { name: 'Innovation Labs', logo: 'IL' },
    { name: 'Digital Solutions', logo: 'DS' },
    { name: 'Creative Agency', logo: 'CA' },
    { name: 'StartupX', logo: 'SX' },
    { name: 'Enterprise Co', logo: 'EC' },
    { name: 'Growth Partners', logo: 'GP' },
    { name: 'Future Tech', logo: 'FT' },
  ]

  return (
    <Section className="bg-gray-50 dark:bg-gray-900/50 py-16">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl sm:text-4xl text-black dark:text-white mb-4">
          Trusted by Industry Leaders
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We've partnered with amazing companies to bring their visions to life
        </p>
      </motion.div>

      <div className="relative overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 dark:from-gray-900/50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 dark:from-gray-900/50 to-transparent z-10"></div>

        {/* Scrolling logos */}
        <div className="flex gap-8 animate-scroll">
          {[...clients, ...clients].map((client, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-brand-blue dark:hover:border-brand-blue transition-colors group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-3xl font-display font-bold text-gray-400 dark:text-gray-500 group-hover:text-brand-blue transition-colors">
                {client.logo}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Section>
  )
}
