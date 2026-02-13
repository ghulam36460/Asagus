"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects as allProjects, type Project } from '@/data/projects'
import { ProjectModal } from './project-modal'

const CARD_GAP = 32
const demoImages = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1600&q=80',
]

const techIconMap: Record<string, string> = {
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  react: 'react',
  'react native': 'react',
  typescript: 'typescript',
  javascript: 'javascript',
  tailwind: 'tailwindcss',
  'tailwind css': 'tailwindcss',
  stripe: 'stripe',
  postgres: 'postgresql',
  postgresql: 'postgresql',
  node: 'nodedotjs',
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  aws: 'amazonaws',
  mongo: 'mongodb',
  mongodb: 'mongodb',
  figma: 'figma',
  firebase: 'firebase',
  redux: 'redux',
  d3: 'd3dotjs',
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const getTechIconSlug = (tech: string) => {
  const key = tech.trim().toLowerCase()
  return techIconMap[key] || null
}

export function ProjectsSection() {
  const projects = useMemo(() => allProjects.filter((p) => p.featured).slice(0, 6), [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(360)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const slideWidth = cardWidth
  const maxOffset = Math.max(0, slideWidth * (projects.length - 1))

  useEffect(() => {
    const updateWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth + CARD_GAP)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    const controls = animate(x, -activeIndex * slideWidth, {
      type: 'spring',
      stiffness: 320,
      damping: 38,
    })
    return controls.stop
  }, [activeIndex, slideWidth, x])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = slideWidth * 0.2
    let nextIndex = activeIndex

    if (info.offset.x <= -threshold) {
      nextIndex = clamp(activeIndex + 1, 0, projects.length - 1)
    } else if (info.offset.x >= threshold) {
      nextIndex = clamp(activeIndex - 1, 0, projects.length - 1)
    } else {
      const raw = Math.round(Math.abs(x.get()) / slideWidth)
      nextIndex = clamp(raw, 0, projects.length - 1)
    }

    setActiveIndex(nextIndex)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(date))
  }

  if (!projects.length) {
    return null
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 py-48 lg:py-56 min-h-[140vh] flex items-center justify-center mb-16 md:mb-24 lg:mb-32">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl parallax-item" data-parallax-depth="0.2"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl parallax-item" data-parallax-depth="0.25"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-blue/10 to-purple-500/10 border border-brand-blue/20 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">
              Our Work
            </span>
          </motion.div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            <span className="block text-gray-900 dark:text-white mb-2">FEATURED</span>
            <span className="block bg-gradient-to-r from-brand-blue via-blue-500 to-purple-600 bg-clip-text text-transparent">PROJECTS</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Discover how we transform ideas into exceptional digital experiences
          </p>
        </motion.div>

        <div className="relative w-full max-w-6xl">
          <motion.div
            className="flex items-stretch gap-8 cursor-grab active:cursor-grabbing select-none"
            drag="x"
            dragConstraints={{ left: -maxOffset, right: 0 }}
            dragElastic={0.08}
            style={{ x }}
            onDragEnd={handleDragEnd}
          >
            {projects.map((project, index) => {
              const distance = Math.abs(activeIndex - index)
              const isActive = index === activeIndex
              const scale = isActive ? 1 : 0.88
              const cardOpacity = isActive ? 1 : 0.55
              const imageSrc = project.images?.hero || demoImages[index % demoImages.length]

              return (
                <motion.article
                  ref={index === 0 ? cardRef : undefined}
                  key={project.slug}
                  onClick={() => {
                    setActiveIndex(index)
                    setSelectedProject(project)
                    setIsModalOpen(true)
                  }}
                  className="relative shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] h-[400px] sm:h-[460px] lg:h-[520px] rounded-[32px] overflow-hidden shadow-[0_25px_90px_rgba(15,23,42,0.35)]"
                  style={{
                    scale,
                    opacity: cardOpacity,
                    zIndex: projects.length - distance,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                >
                  <Image
                    src={imageSrc}
                    alt={project.title}
                    fill
                    className="object-contain bg-black"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 60vw, 420px"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>

                  <div className="absolute inset-5 flex flex-col justify-between">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/90 text-white text-xs font-semibold uppercase tracking-[0.3em]">{project.category}</span>

                    <div className="space-y-4 text-left">
                      <h3 className="font-display text-2xl sm:text-3xl text-white leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/70">{formatDate(project.date)}</p>

                      <div className="flex flex-col gap-4">
                        <p className="text-sm text-white/80 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-3">
                          {project.technologies.slice(0, 3).map((tech, techIndex) => {
                            const slug = getTechIconSlug(tech)
                            return (
                              <div key={`${project.slug}-tech-${techIndex}`} className="flex items-center gap-2">
                                {slug ? (
                                  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                                    <img
                                      src={`https://cdn.simpleicons.org/${slug}/ffffff`}
                                      alt={tech}
                                      className="w-5 h-5"
                                      loading="lazy"
                                    />
                                  </span>
                                ) : (
                                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue/70 to-purple-600/70 text-white text-xs font-semibold flex items-center justify-center border border-white/15">
                                    {tech.charAt(0).toUpperCase()}
                                  </span>
                                )}
                                <span className="text-xs text-white/70 uppercase tracking-[0.3em] hidden sm:inline-block">
                                  {tech}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.4em] text-white/60">
                            {project.technologies.slice(0, 2).join(' • ')}
                          </span>
                          {project.externalLink ? (
                            <a
                              href={project.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-blue transition-colors"
                            >
                              Visit Site
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedProject(project)
                                setIsModalOpen(true)
                              }}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-brand-blue transition-colors"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => setActiveIndex((prev) => clamp(prev - 1, 0, projects.length - 1))}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/80 text-gray-900 dark:text-white dark:bg-white/5 dark:border-white/15 hover:border-brand-blue hover:text-brand-blue transition-colors disabled:opacity-30"
            disabled={activeIndex === 0}
            aria-label="Previous project"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex ? 'bg-gradient-to-r from-brand-blue to-purple-500 w-10' : 'bg-gray-400/40 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <button
            onClick={() => setActiveIndex((prev) => clamp(prev + 1, 0, projects.length - 1))}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/80 text-gray-900 dark:text-white dark:bg-white/5 dark:border-white/15 hover:border-brand-blue hover:text-brand-blue transition-colors disabled:opacity-30"
            disabled={activeIndex === projects.length - 1}
            aria-label="Next project"
          >
            ›
          </button>
        </div>

        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-brand-blue text-white hover:bg-blue-600 transition-colors duration-300 font-semibold text-base"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProject(null)
        }}
      />
    </section>
  )
}
