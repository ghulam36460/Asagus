"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Instagram, Linkedin, Twitter, ArrowRight, Check, Send, MapPin, Mail, Phone, Dribbble } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedEmail = email.trim()
    if (!normalizedEmail) return
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubscribed(true)
        setEmail("")
      } else {
        setError(data?.error || "Something went wrong")
      }
    } catch {
      setError("Failed to subscribe")
    } finally {
      setIsSubmitting(false)
    }
  }

  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Dribbble, href: "https://dribbble.com", label: "Dribbble" },
  ]

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ]

  const serviceLinks = [
    { name: "Web Development", href: "/#services" },
    { name: "UI/UX Design", href: "/#services" },
    { name: "Brand Strategy", href: "/#services" },
    { name: "Digital Marketing", href: "/#services" },
    { name: "Consulting", href: "/#services" },
  ]

  return (
    <footer className="site-footer relative bg-black text-white mt-32 md:mt-48 lg:mt-64">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 mb-12 lg:mb-20">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-10 md:mb-14 lg:mb-20">
              <Send className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-blue">Newsletter</span>
            </div>

            {/* Heading */}
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Stay in the <span className="text-brand-blue">Loop</span>
            </h3>

            {/* Description */}
            <p className="text-white/60 mb-8 max-w-lg">
              Get design trends, web dev tips, and exclusive insights delivered straight to your inbox.
            </p>

            {/* Newsletter Form */}
            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-emerald-500/10 border border-emerald-500/20"
              >
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-emerald-400">Successfully Subscribed!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="flex-1 h-10 px-4 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                
                {error && (
                  <p className="text-sm text-red-400 mt-3 text-center">{error}</p>
                )}
                
                {!error && (
                  <p className="text-xs text-white/40 mt-4 flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center">
                <span className="text-base font-black text-white">H</span>
              </div>
              <span className="text-lg font-bold">ASAGUS</span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-white/60 leading-relaxed">
              We create digital experiences that transform businesses into brands people love.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@asagus.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                hello@asagus.com
              </a>
              <a href="tel:+16465550199" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +1 (646) 555-0199
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4" />
                417 Mercer Street, New York, NY 10012
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">
              Get in Touch
            </h4>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Ready to start your project? Let&apos;s create something amazing together.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-blue transition-colors group"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} <span className="text-white/60 font-medium">HINX</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-white/40 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
