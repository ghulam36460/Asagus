"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"
import {
  Instagram, Linkedin, Twitter, ArrowRight, ArrowUpRight,
  Check, Send, MapPin, Mail, Phone, Dribbble,
  Brain, Zap, ChevronRight,
} from "lucide-react"

// ─── Motion helpers ────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 110, damping: 16, delay },
  },
})

// ─── Link hover row ────────────────────────────────────────────────────────────
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm text-white/50
                   hover:text-white transition-colors duration-200"
      >
        <ChevronRight
          className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                     transition-all duration-200 text-brand-blue"
          aria-hidden="true"
        />
        {children}
      </Link>
    </li>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Footer
// ═══════════════════════════════════════════════════════════════════════════════
export function Footer() {
  const prefersReduced = useReducedMotion()
  const rootRef   = useRef<HTMLDivElement>(null)
  const isInView  = useInView(rootRef, { once: true, margin: "-60px" })

  const [email,        setEmail]        = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error,        setError]        = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedEmail = email.trim()
    if (!normalizedEmail) return
    setIsSubmitting(true)
    setError("")
    try {
      const response = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: normalizedEmail }),
      })
      const data = await response.json()
      if (response.ok) { setIsSubscribed(true); setEmail("") }
      else setError(data?.error || "Something went wrong")
    } catch {
      setError("Failed to subscribe")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Data ──────────────────────────────────────────────────────────────────
  const socialLinks = [
    { icon: Linkedin,  href: "https://linkedin.com",  label: "LinkedIn"  },
    { icon: Twitter,   href: "https://twitter.com",   label: "Twitter"   },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Dribbble,  href: "https://dribbble.com",  label: "Dribbble"  },
  ]

  const navLinks = [
    { name: "Home",     href: "/"          },
    { name: "Projects", href: "/projects"  },
    { name: "Services", href: "/#services" },
    { name: "About",    href: "/#about"    },
    { name: "Contact",  href: "/#contact"  },
    { name: "Privacy",  href: "/privacy"   },
    { name: "Terms",    href: "/terms"     },
  ]

  const serviceLinks = [
    { name: "Web & App Development", href: "/#services" },
    { name: "AI & Machine Learning",  href: "/#services" },
    { name: "API & Backend Engineering",          href: "/#services" },
    { name: "Data & Automation",    href: "/#services" },
    { name: "Neural Architecture",  href: "/#services" },
    { name: "Research & Consulting", href: "/#services" },
  ]

  const stats = [
    { value: "50+",  label: "Projects Delivered" },
    { value: "99%",  label: "Client Satisfaction" },
    { value: "3.2×", label: "Avg Performance Gain" },
  ]

  return (
    <footer
      ref={rootRef}
      className="site-footer relative bg-black text-white overflow-hidden"
      aria-label="Site footer"
    >
      {/* ── Ambient orbs ──────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[340px] rounded-full opacity-[0.055] blur-[130px]"
          style={{ background: "radial-gradient(ellipse, rgb(29,77,241) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full opacity-[0.04] blur-[110px]"
          style={{ background: "radial-gradient(circle, rgb(139,92,246), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: "radial-gradient(circle, rgb(29,77,241), transparent 70%)" }}
        />
      </div>

      {/* ── Top gradient separator ─────────────────────────────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(29,77,241,0.6) 35%, rgba(139,92,246,0.6) 65%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          NEWSLETTER BAND
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.06]">
        {/* Inner glass card */}
        <motion.div
          className="max-w-3xl mx-auto px-6 lg:px-8 py-20 flex flex-col items-center text-center"
          variants={prefersReduced ? undefined : fadeUp(0.05)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-brand-blue/10 border border-brand-blue/25 backdrop-blur-sm mb-7">
            <Send className="w-3.5 h-3.5 text-brand-blue" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-blue">
              Newsletter
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Stay in the{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Loop
            </span>
          </h2>

          <p className="text-base text-white/50 max-w-md mb-10 leading-relaxed">
            AI insights, product launches, and research notes — dropped into your inbox
            when they actually matter.
          </p>

          {/* Form / Success */}
          {isSubscribed ? (
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl
                         bg-emerald-500/10 border border-emerald-500/25"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-emerald-400">You&apos;re in!</p>
                <p className="text-xs text-emerald-400/60">We&apos;ll be in touch soon.</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-lg" noValidate>
              {/* Input row */}
              <div className="flex items-center gap-2 p-1.5 rounded-2xl
                              bg-white/[0.04] border border-white/[0.08]
                              focus-within:border-brand-blue/40 focus-within:bg-white/[0.06]
                              transition-all duration-300">
                <div className="pl-3 text-white/30" aria-hidden="true">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  aria-label="Email address"
                  className="flex-1 h-11 bg-transparent text-sm text-white
                             placeholder:text-white/30 focus:outline-none disabled:opacity-50 px-2"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-brand-blue hover:bg-blue-500
                             text-sm font-semibold text-white transition-colors
                             disabled:opacity-50 flex items-center gap-2 flex-shrink-0
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                >
                  {isSubmitting ? (
                    <div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                      aria-label="Sending…"
                    />
                  ) : (
                    <>Subscribe <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                  )}
                </button>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-400 mt-3 text-center">{error}</p>
              )}

              <p className="text-xs text-white/30 mt-4 flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Zero spam. Unsubscribe any time.
              </p>
            </form>
          )}

          {/* Stat pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl
                           bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
              >
                <span className="text-sm font-bold text-white">{s.value}</span>
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN GRID
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* ── Brand column (lg: 4/12) ──────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-4 space-y-7"
            variants={prefersReduced ? undefined : fadeUp(0.08)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Wordmark */}
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Asagus home">
              {/* Icon badge */}
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-brand-blue/40 blur-lg group-hover:bg-brand-blue/55 transition-all" aria-hidden="true" />
                <div className="relative w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">ASAGUS</span>
            </Link>

            {/* Tagline */}
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              We architect the future of AI — fusing deep learning research with
              world-class product engineering.
            </p>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-emerald-500/10 border border-emerald-500/20 w-max">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-emerald-400">Available for new projects</span>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <a
                href="mailto:hello@asagus.com"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors group/link"
              >
                <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover/link:border-brand-blue/40 transition-colors flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                hello@asagus.com
              </a>
              <a
                href="tel:+16465550199"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors group/link"
              >
                <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover/link:border-brand-blue/40 transition-colors flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                +1 (646) 555-0199
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/50">
                <span className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                417 Mercer Street, New York, NY 10012
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2" role="list" aria-label="Social links">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08]
                             flex items-center justify-center text-white/50
                             hover:text-white hover:border-brand-blue/40 hover:bg-brand-blue/10
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50
                             transition-all duration-200 group/s"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Navigation (lg: 2/12) ──────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-2"
            variants={prefersReduced ? undefined : fadeUp(0.14)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-6">
              Navigation
            </p>
            <ul className="space-y-3.5">
              {navLinks.map((l) => (
                <FooterLink key={l.name} href={l.href}>{l.name}</FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* ── Services (lg: 3/12) ──────────────────────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            variants={prefersReduced ? undefined : fadeUp(0.20)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-6">
              Services
            </p>
            <ul className="space-y-3.5">
              {serviceLinks.map((l) => (
                <FooterLink key={l.name} href={l.href}>{l.name}</FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* ── Start a Project CTA card (lg: 3/12) ──────────────────────────── */}
          <motion.div
            className="lg:col-span-3"
            variants={prefersReduced ? undefined : fadeUp(0.26)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-6">
              Work With Us
            </p>

            {/* CTA glass card */}
            <div
              className="relative rounded-2xl overflow-hidden p-6 border border-white/[0.08]
                         bg-gradient-to-br from-brand-blue/12 via-transparent to-purple-600/10"
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 80% 20%, rgba(29,77,241,0.3), transparent 60%)",
                }}
                aria-hidden="true"
              />

              <div className="relative space-y-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-blue" aria-hidden="true" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">Got a project?</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Let&apos;s build something remarkable together. From concept to deployment.
                  </p>
                </div>

                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white
                             px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-500
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60
                             transition-colors group/cta"
                >
                  Start a Project
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM BAR
      ════════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative border-t border-white/[0.06]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(29,77,241,0.03) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-white/30 order-2 sm:order-1" suppressHydrationWarning>
              © {new Date().getFullYear()}{" "}
              <span className="text-white/50 font-semibold">ASAGUS</span>
              {" "}— All rights reserved.
            </p>

            {/* Legal links */}
            <div className="flex items-center gap-5 order-1 sm:order-2">
              <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
              <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Terms of Service
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
              <span className="text-xs text-white/20">
                Built with{" "}
                <span
                  className="text-brand-blue/70"
                  title="Next.js + Framer Motion + Three.js"
                >
                  ♥
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
