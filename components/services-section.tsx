"use client"

import { Code2, Brain, Database, Workflow } from 'lucide-react'
import { useState } from 'react'
import { ServiceModal } from './service-modal'

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const services = [
    {
      name: "Web & App Development",
      description: "We build custom, high-performance websites and web/mobile applications tailored to your business goals.",
      fullDescription: "We build custom, high-performance websites and web/mobile applications tailored to your business goals. From simple business websites to complex, feature-rich platforms, we use modern frameworks, scalable architectures, and best development practices to deliver fast, secure, and future-ready digital products.\n\nOur expertise covers all types of websites, including corporate websites, portfolios, eCommerce stores, dashboards, SaaS platforms, landing pages, and custom web applications. We also bring designs to life by converting Figma designs into fully functional, pixel-perfect websites.\n\nUsing technologies such as React, Next.js, Node.js, Express, MERN stack, WordPress, and React Native, we ensure optimal performance, smooth animations, and seamless user experiences across all devices.",
      features: [
        "Custom websites and web applications for any industry",
        "Animated and interactive UI experiences",
        "MERN Stack development (MongoDB, Express, React, Node.js)",
        "Next.js applications with SEO optimization",
        "WordPress development (custom themes & plugins)",
        "Figma to WordPress / Figma to custom website conversion",
        "Responsive design for mobile, tablet, and desktop",
        "Progressive Web Apps (PWA)",
        "Native & cross-platform mobile app development (iOS & Android)",
        "Real-time functionality and WebSocket integration",
        "RESTful API development and third-party integrations",
        "Performance optimization, security, and SEO best practices"
      ],
      icon: Code2,
      bgImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    },
    {
      name: "AI & Machine Learning",
      description: "Intelligent solutions powered by cutting-edge AI and machine learning algorithms to transform your business.",
      fullDescription: "Leverage the power of artificial intelligence and machine learning to automate processes, gain insights from data, and create intelligent applications. We work with the latest AI models and frameworks to deliver solutions that give you a competitive edge.",
      features: [
        "Natural Language Processing (NLP)",
        "Computer Vision and Image Recognition",
        "Predictive Analytics and Forecasting",
        "Chatbots and Virtual Assistants",
        "Recommendation Systems",
        "Custom AI Model Development"
      ],
      icon: Brain,
      bgImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    },
    {
      name: "API & Backend Engineering",
      description: "Robust and scalable backend systems with secure APIs for seamless data flow and integration.",
      fullDescription: "Build the foundation of your digital infrastructure with our robust backend solutions. We design and implement scalable APIs, microservices architectures, and server-side logic that power your applications efficiently and securely.",
      features: [
        "RESTful and GraphQL API design",
        "Microservices architecture",
        "Database design and optimization",
        "Authentication and authorization",
        "Cloud infrastructure setup (AWS, Azure, GCP)",
        "Real-time data processing"
      ],
      icon: Database,
      bgImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    },
    {
      name: "Data & Automation",
      description: "Streamline operations with intelligent automation and data-driven insights for better decision making.",
      fullDescription: "Transform your business processes with automation and harness the power of your data. We create custom automation solutions and analytics platforms that help you make informed decisions and improve operational efficiency.",
      features: [
        "Business Process Automation",
        "Data Pipeline Development",
        "ETL and Data Integration",
        "Business Intelligence Dashboards",
        "Automated Reporting Systems",
        "Workflow Automation"
      ],
      icon: Workflow,
      bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    },
  ]

  const handleServiceClick = (service: any) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  return (
    <section id="services" className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black py-48 lg:py-56 min-h-[120vh] flex items-center justify-center mb-16 md:mb-24 lg:mb-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] animate-pulse parallax-item" data-parallax-depth="0.2"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse parallax-item" data-parallax-depth="0.25" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] parallax-item" data-parallax-depth="0.15"></div>
      </div>

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center reveal-stagger">
        {/* Header */}
        <div className="text-center mb-16 reveal-fade" data-stagger-child>
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-black/40 border border-purple-500/30 backdrop-blur-sm mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">WHAT WE DO</span>
          </div>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-[96px] font-extrabold mb-6 leading-tight">
            <span className="block text-white/95">OUR</span>
            <span className="block bg-gradient-to-r from-brand-blue via-blue-500 to-purple-600 bg-clip-text text-transparent">SERVICES</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Comprehensive digital solutions to elevate your brand and drive growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-items-center">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                data-stagger-child
                className="group relative w-full max-w-sm"
              >
                <div 
                  onClick={() => handleServiceClick(service)}
                  className="relative h-[360px] rounded-3xl overflow-hidden border border-white/8 hover:border-purple-400/30 transition-all duration-500 cursor-pointer shadow-[0_20px_50px_rgba(2,6,23,0.6)]"
                >
                  {/* Background Image with Blur */}
                  <div className="absolute inset-0">
                    <img 
                      src={service.bgImage} 
                      alt={service.name}
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 backdrop-blur-sm"></div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/60 via-gray-900/70 to-black/80"></div>

                  {/* Noise Texture */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                  }}></div>

                  {/* Content Container */}
                  <div className="relative h-full flex flex-col p-8">
                    {/* Top Section */}
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-brand-blue/40 blur-xl"></div>
                        <div className="relative w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Number */}
                      <span className="text-[72px] font-extrabold text-white/8 opacity-30 leading-none">0{index + 1}</span>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-auto">
                      {/* Title */}
                      <h3 className="font-display text-xl font-bold text-white mb-3 leading-tight">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-300 leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {/* Button */}
                      <button className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all duration-300">
                        <span>Explore</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Service Modal */}
      <ServiceModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedService(null)
        }}
      />
    </section>
  )
}
