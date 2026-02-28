"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ProjectRecord } from '@/lib/projects-api'

interface PortfolioFilterProps {
  initialProjects: ProjectRecord[]
}

export function PortfolioFilter({ initialProjects }: PortfolioFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>(['All'])
    initialProjects.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  }, [initialProjects])

  // Filter projects based on search, category, and featured
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      // Category filter
      if (selectedCategory !== 'All' && project.category !== selectedCategory) {
        return false
      }

      // Featured filter
      if (showFeaturedOnly && !project.featured) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = project.title.toLowerCase().includes(query)
        const matchesDesc = project.description.toLowerCase().includes(query)
        const matchesTech = project.technologies.some((t) =>
          t.toLowerCase().includes(query)
        )
        return matchesTitle || matchesDesc || matchesTech
      }

      return true
    })
  }, [initialProjects, selectedCategory, showFeaturedOnly, searchQuery])

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px' }}>
      <div
        style={{
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Filters */}
        <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ marginBottom: '20px', maxWidth: '760px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
            <input
              type="text"
              placeholder="Search by title, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontSize: '18px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
                outline: 'none',
                boxShadow: '0 6px 24px rgba(2,6,23,0.45)',
                background: 'rgba(255,255,255,0.02)',
                color: 'inherit',
              }}
              className="placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>

          {/* Category & Featured Filters */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Featured Toggle */}
            <button
              type="button"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.18s',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: showFeaturedOnly ? '0 6px 18px rgba(37,99,235,0.14)' : 'none',
                background: showFeaturedOnly ? '#2563eb' : 'rgba(255,255,255,0.03)'
              }}
              className={
                showFeaturedOnly
                  ? 'text-white'
                  : 'text-black/80 dark:text-white/80'
              }
            >
              ⭐ Featured
            </button>

            {/* Category Buttons */}
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: selectedCategory === cat ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                  background: selectedCategory === cat ? 'rgba(255,255,255,0.06)' : 'transparent'
                }}
                className={
                  selectedCategory === cat
                    ? 'text-white'
                    : 'text-black/70 dark:text-white/70'
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCategory !== 'All' || showFeaturedOnly) && (
            <p
              style={{ fontSize: '14px' }}
              className="text-black/50 dark:text-white/50"
            >
              Showing {filteredProjects.length} of {initialProjects.length} projects
            </p>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: '32px',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              paddingBottom: '80px',
            }}
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.slug} project={project} index={idx} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}
            >
              🔍
            </div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
              className="text-black dark:text-white"
            >
              No projects found
            </h3>
            <p
              style={{ fontSize: '14px', marginBottom: '24px' }}
              className="text-black/60 dark:text-white/60"
            >
              Try adjusting your filters or search terms
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setShowFeaturedOnly(false)
              }}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '9999px',
                cursor: 'pointer',
                border: 'none',
              }}
              className="bg-black/10 text-black hover:bg-black/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Project Card Component
function ProjectCard({ project, index }: { project: ProjectRecord; index: number }) {
  const image = project.heroImage || project.galleryImages?.[0] || ''
  const year = project.year ?? (project.createdAt ? new Date(project.createdAt).getFullYear() : undefined)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        style={{
          display: 'block',
          height: '100%',
          textDecoration: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid',
            transition: 'all 0.3s',
          }}
          className="border-black/10 hover:border-black/20 hover:shadow-lg dark:border-white/10 dark:hover:border-white/20 project-card"
        >
          {/* Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingTop: '60%',
              overflow: 'hidden',
            }}
            className="bg-black/5 dark:bg-white/5"
          >
            {image ? (
              <Image
                src={image}
                alt={project.title}
                fill
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s',
                }}
                className="project-card-image"
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  fontWeight: '700',
                }}
                className="text-black/10 dark:text-white/10"
              >
                {project.title.substring(0, 2).toUpperCase()}
              </div>
            )}

            {/* Badges */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                display: 'flex',
                gap: '8px',
              }}
            >
              {project.featured && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                  }}
                >
                  ⭐ Featured
                </span>
              )}
              {year && (
                <span
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                  }}
                >
                  {year}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {/* Category */}
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              className="text-blue-600 dark:text-blue-400"
            >
              {project.category}
            </span>

            {/* Title */}
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.3',
              }}
              className="text-black dark:text-white project-card-title"
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              className="text-black/60 dark:text-white/60"
            >
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '6px',
                    }}
                    className="bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '6px',
                    }}
                    className="bg-black/5 text-black/40 dark:bg-white/5 dark:text-white/40"
                  >
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* View Link */}
            <div
              style={{
                marginTop: 'auto',
                fontSize: '14px',
                fontWeight: '500',
              }}
              className="text-black/50 dark:text-white/50 project-card-link"
            >
              View Project →
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        .project-card:hover .project-card-image {
          transform: scale(1.05);
        }
        .project-card:hover .project-card-title {
          color: #2563eb;
        }
        .project-card:hover .project-card-link {
          color: #2563eb;
        }
      `}</style>
    </motion.article>
  )
}
