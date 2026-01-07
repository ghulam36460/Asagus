"use client"

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/button'
import { projects } from '@/data/projects'
import { use } from 'react'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params)
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Content */}
        <motion.div 
          className="w-full lg:w-1/2 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 dark:from-brand-blue dark:via-blue-600 dark:to-purple-600 px-8 sm:px-12 lg:px-16 py-32 lg:py-40 flex items-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-xl">
            {/* Category */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-black/70">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-black mb-8 leading-[0.95]">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-black/90 leading-relaxed mb-12">
              {project.fullDescription}
            </p>

            <div className="border-t-2 border-black/20 pt-8 mb-12"></div>

            {/* Technologies */}
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-black/70 mb-6">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="text-sm font-semibold text-black"
                  >
                    {tech}{index < project.technologies.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Button */}
            <Button 
              className="bg-black text-white hover:bg-black/80 px-10 py-5 text-base"
              icon={<ExternalLink className="w-5 h-5" />}
            >
              Visit Website
            </Button>
          </div>
        </motion.div>

        {/* Right Side - Scrolling Images */}
        <motion.div 
          className="w-full lg:w-1/2 relative overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="h-screen lg:h-full flex items-center justify-center p-8">
            <motion.div
              className="space-y-8"
              animate={{
                y: [0, -100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Display project image multiple times for scrolling effect */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative w-full aspect-square max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={project.images.hero}
                    alt={`${project.title} - View ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
