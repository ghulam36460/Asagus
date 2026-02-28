"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface Service {
  name: string
  description: string
  fullDescription?: string
  features?: string[]
}

interface ServiceModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ServiceModal({ service, isOpen, onClose }: ServiceModalProps) {
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

  if (!service) return null

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
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[95%] lg:w-[60%] xl:w-[50%] bg-white dark:bg-black z-[2001] overflow-hidden"
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

            {/* Content */}
            <div 
              className="h-full relative bg-black px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 flex items-start justify-center overflow-y-auto"
              style={{
                scrollBehavior: 'smooth'
              }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Custom Scrollbar Styles */}
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 8px;
                }
                div::-webkit-scrollbar-track {
                  background: transparent;
                }
                div::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.3);
                  border-radius: 4px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.5);
                }
              `}</style>
              
              {/* Subtle color overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10 pointer-events-none"></div>
              
              <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl relative z-10 py-4">
                {/* Service Name */}
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: '1.2',
                  marginBottom: '32px',
                  fontFamily: 'Audiowide, sans-serif'
                }}>
                  {service.name}
                </h1>

                {/* Short Description */}
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginTop: '20px',
                  marginBottom: '10px',
                  fontFamily: 'PT Sans Caption, sans-serif'
                }}>
                  {service.description}
                </p>

                {/* Full Description */}
                {service.fullDescription && (
                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginTop: '20px',
                    marginBottom: '10px',
                    fontFamily: 'PT Sans Caption, sans-serif'
                  }}>
                    {service.fullDescription}
                  </p>
                )}

                <div style={{ 
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                  marginTop: '40px',
                  marginBottom: '40px'
                }}></div>

                {/* Features */}
                {service.features && service.features.length > 0 && (
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
                      Key Features
                    </h3>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      marginTop: '10px'
                    }}>
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          style={{
                            fontSize: '15px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '12px',
                            paddingLeft: '24px',
                            position: 'relative',
                            fontFamily: 'PT Sans Caption, sans-serif',
                            lineHeight: '1.5'
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            left: '0',
                            top: '6px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(29, 77, 241, 0.8)'
                          }}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
