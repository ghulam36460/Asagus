import React from 'react'

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, className = '', children }: SectionProps) {
  return (
    <section id={id} className={`py-36 lg:py-48 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  )
}
