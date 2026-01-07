"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink } from 'lucide-react'
import { Button } from './button'
import type { Project } from '@/data/projects'
import { useEffect } from 'react'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[95%] lg:w-[90%] bg-white dark:bg-black z-[2001] overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-[9999] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
              style={{ pointerEvents: 'auto' }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Side - Content */}
              <div 
                className="w-full lg:w-1/2 relative bg-black px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 flex items-start justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{
                  scrollBehavior: 'smooth'
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {/* Subtle color overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 pointer-events-none"></div>
                
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl relative z-10 py-4">
                  {/* Category */}
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ 
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontFamily: 'PT Sans Caption, sans-serif'
                    }}>
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: '1.2',
                    marginBottom: '32px',
                    fontFamily: 'Audiowide, sans-serif'
                  }}>
                    {project.title}
                  </h1>

                  {/* Description */}
                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '20px',
                    marginBottom: '10px',
                    fontFamily: 'PT Sans Caption, sans-serif'
                  }}>
                    {project.fullDescription}
                  </p>

                  <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    marginTop: '40px',
                    marginBottom: '40px'
                  }}></div>

                  {/* Technologies */}
                  <div style={{ marginBottom: '48px' }}>
                    <h3 style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '20px',
                      marginTop: '10px',
                      fontFamily: 'PT Sans Caption, sans-serif'
                    }}>
                      Technologies
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      marginTop: '10px'
                    }}>
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#ffffff',
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '9999px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'background-color 0.2s',
                            cursor: 'default',
                            fontFamily: 'PT Sans Caption, sans-serif'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div style={{ marginTop: '30px' }}>
                    <button 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        color: '#ffffff',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      aria-label="Visit Website"
                    >
                      <ExternalLink style={{ width: '24px', height: '24px' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Scrolling Images */}
              <div className="w-full lg:w-1/2 relative overflow-hidden bg-black h-[250px] sm:h-[350px] lg:h-full">
                <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                  <motion.div
                    className="space-y-6 sm:space-y-8"
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
                      <div key={i} className="relative w-full aspect-square max-w-[200px] sm:max-w-sm lg:max-w-lg mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                        <img
                          src={project.images.hero}
                          alt={`${project.title} - View ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
