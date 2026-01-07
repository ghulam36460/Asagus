"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Dribbble, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react'

const extraLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Our Team', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const contactDetails = [
  { icon: MapPin, text: '417 Mercer Street, New York, NY 10012' },
  { icon: Mail, text: 'hello@brandalchemy.com', href: 'mailto:hello@brandalchemy.com' },
  { icon: Phone, text: '+1 (646) 555-0199', href: 'tel:+16465550199' },
]

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: Dribbble },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(29,77,241,0.4),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.4),_transparent_50%)]" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 md:gap-16 md:grid-cols-2 lg:grid-cols-12 mb-16"
        >
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="font-display text-lg font-bold text-white">H</span>
                </div>
                <h3 className="font-display text-3xl bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  HINX
                </h3>
              </div>
              <p className="text-base text-white/70 max-w-md leading-relaxed">
                We create digital experiences that transform businesses into brands people love. Cutting-edge web solutions, innovative design, and results-driven strategies.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:border-transparent overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon className="h-5 w-5 relative z-10 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Navigation</h4>
            <ul className="space-y-3.5">
              {extraLinks.map((link, index) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    className="group text-sm text-white/70 hover:text-white inline-flex items-center gap-2 transition-all duration-200"
                  >
                    <span className="w-0 h-px bg-gradient-to-r from-purple-500 to-pink-400 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Get In Touch</h4>
            <ul className="space-y-5">
              {contactDetails.map(({ icon: Icon, text, href }, index) => (
                <motion.li 
                  key={text} 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-400/10 border border-white/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  {href ? (
                    <a 
                      href={href} 
                      className="text-sm text-white/70 hover:text-white transition-colors leading-relaxed pt-1.5"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm text-white/70 leading-relaxed pt-1.5">{text}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {currentYear} <span className="text-white/60 font-medium">HINX</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link 
                href="/privacy" 
                className="text-sm text-white/40 hover:text-white transition-colors relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-pink-400 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-white/40 hover:text-white transition-colors relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-pink-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
