"use client"

import { motion } from 'framer-motion'

export function AboutSection() {
  const stats = [
    { value: '2023', label: 'Year Started' },
    { value: '150+', label: 'Clients' },
    { value: '200+', label: 'Projects' },
  ]

  return (
    <section id="about" className="relative bg-black text-white overflow-hidden mb-16 md:mb-24 lg:mb-32" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient orbs */}
      <div className="absolute" style={{ top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
      <div className="absolute" style={{ bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>

      <div className="relative max-w-6xl" style={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '80px', alignItems: 'start' }}>
          {/* Left Column - Title & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Badge */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ 
                display: 'inline-block',
                padding: '10px 20px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.03)'
              }}>
                <span className="text-sm text-white/70 font-medium">Our Story</span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-display leading-tight" style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              marginBottom: '60px',
              lineHeight: '1.1'
            }}>
              <span style={{ display: 'block', marginBottom: '8px' }}>About ASAGUS</span>
              <span style={{ 
                display: 'block',
                background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>SOFTWARE COMPANY</span>
            </h2>

            {/* Stats */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '40px',
              paddingTop: '40px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div className="font-display font-bold" style={{ 
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1',
                    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              paddingTop: '40px'
            }}
          >
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.7)',
              margin: '0'
            }}>
              ASAGUS is a forward-thinking software and development company founded in 2024 with a clear mission: to build smart, scalable, and impactful digital solutions.
            </p>

            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.7)',
              margin: '0'
            }}>
              Since our inception, we have worked on a wide range of projects, including AI-based systems, modern websites, custom software, and intelligent AI tools. Our focus is on turning ideas into powerful products that solve real-world problems and help businesses grow.
            </p>

            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.7)',
              margin: '0'
            }}>
              We thrive on innovation, quality, and continuous improvement. From concept and design to development and deployment, our team is committed to delivering reliable, high-performance solutions tailored to our clients’ needs.
            </p>

            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.7)',
              margin: '0'
            }}>
              At ASAGUS, we believe technology should be intelligent, efficient, and future-ready. With every project we complete, we push boundaries, embrace new technologies, and aim to create lasting value.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
