"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"
import {
  ArrowRight, Facebook, Twitter, Linkedin,
  Instagram, Github,
} from "lucide-react"

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20, delay },
  },
})

// ---------------------------------------------------------------------------
export function Footer() {
  const prefersReduced = useReducedMotion()
  const rootRef  = useRef<HTMLDivElement>(null)
  const isInView = useInView(rootRef, { once: true, margin: "-60px" })

  const [email,        setEmail]        = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error,        setError]        = useState("")

  const anim = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          variants: fadeUp(delay),
          initial: "hidden" as const,
          animate: isInView ? "visible" as const : "hidden" as const,
        }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = email.trim()
    if (!val) return
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: val }),
      })
      const data = await res.json()
      if (res.ok) { setIsSubscribed(true); setEmail("") }
      else setError(data?.error || "Something went wrong")
    } catch {
      setError("Failed to subscribe")
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    { label: "AI & Machine Learning",      href: "/#services" },
    { label: "Web & Mobile Development",   href: "/#services" },
    { label: "Automation & Data",          href: "/#services" },
    { label: "Enterprise Software",        href: "/#services" },
    { label: "Cybersecurity",              href: "/#services" },
  ]

  const about = [
    { label: "About",          href: "/#about"   },
    { label: "Contact Us",     href: "/#contact" },
    { label: "Careers",        href: "/#careers" },
    { label: "Blog",           href: "/blog"     },
    { label: "Privacy Policy", href: "/privacy"  },
  ]

  const extra = [
    { label: "Education",    href: "/#education" },
    { label: "Research",     href: "/#research"  },
    { label: "Terms of Use", href: "/terms"      },
    { label: "Pricing",      href: "/#pricing"   },
  ]

  const help = [
    { label: "FAQs",           href: "/#contact" },
    { label: "Contact Us",     href: "/#contact" },
    { label: "Privacy Policy", href: "/privacy"  },
    { label: "Terms of Use",   href: "/terms"    },
  ]

  const socials = [
    { icon: Facebook,  href: "https://facebook.com",  label: "Facebook"  },
    { icon: Twitter,   href: "https://twitter.com",   label: "Twitter"   },
    { icon: Linkedin,  href: "https://linkedin.com",  label: "LinkedIn"  },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Github,    href: "https://github.com",    label: "GitHub"    },
  ]

  return (
    <footer
      ref={rootRef}
      className="w-full"
      style={{ background: "#000000", borderTop: "1px solid rgba(255,255,255,0.07)" }}
      aria-label="Site footer"
    >
      <div className="w-full">

        {/* ═══ TOP BANNER ═════════════════════════════════════════════════════ */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 lg:px-16 py-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          {...anim(0.05)}
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="ASAGUS home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontFamily: 'var(--font-azonix), sans-serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            ASAGUS
          </Link>

        </motion.div>

        {/* ═══ MAIN GRID ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.9fr] gap-10 px-6 sm:px-10 lg:px-16 py-10">

          {/* ── Col 1: Newsletter + Socials ─────────────────────────────────── */}
          <motion.div className="flex flex-col gap-6" {...anim(0.10)}>
            <div>
              <p className="text-white font-semibold text-[15px] mb-4">Subscribe to our newsletter</p>

              {isSubscribed ? (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-emerald-400"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  ✓ You&apos;re subscribed!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <div
                    className="flex items-center rounded-lg overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email Address"
                      required
                      disabled={isSubmitting}
                      aria-label="Email address"
                      className="flex-1 px-4 py-2.5 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50 min-w-0"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      aria-label="Subscribe"
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-white transition-opacity disabled:opacity-50 focus-visible:outline-none"
                      style={{ background: "linear-gradient(135deg, #6b52cc, #3a78c9)" }}
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                </form>
              )}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40"
                  style={{ background: "rgba(107,82,204,0.15)", border: "1px solid rgba(107,82,204,0.3)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = "linear-gradient(135deg, rgba(107,82,204,0.45), rgba(58,120,201,0.45))"
                    el.style.border = "1px solid rgba(107,82,204,0.7)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = "rgba(107,82,204,0.15)"
                    el.style.border = "1px solid rgba(107,82,204,0.3)"
                  }}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Col 2: Services ─────────────────────────────────────────────── */}
          <motion.div {...anim(0.14)}>
            <p className="text-white font-semibold text-[15px] mb-5">Services</p>
            <ul className="flex flex-col gap-3">
              {services.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3a78c9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 3: About ────────────────────────────────────────────────── */}
          <motion.div {...anim(0.18)}>
            <p className="text-white font-semibold text-[15px] mb-5">About</p>
            <ul className="flex flex-col gap-3">
              {about.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3a78c9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 4: Help ─────────────────────────────────────────────────── */}
          <motion.div {...anim(0.22)}>
            <p className="text-white font-semibold text-[15px] mb-5">Help</p>
            <ul className="flex flex-col gap-3">
              {help.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3a78c9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Col 5: Extra ────────────────────────────────────────────────── */}
          <motion.div {...anim(0.26)}>
            <p className="text-white font-semibold text-[15px] mb-5">More</p>
            <ul className="flex flex-col gap-3">
              {extra.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#3a78c9")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ═══ BOTTOM COPYRIGHT BAR ═══════════════════════════════════════════ */}
        <motion.div
          className="px-6 sm:px-10 lg:px-16 py-4 text-center text-[12.5px]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.35)",
          }}
          {...anim(0.26)}
          suppressHydrationWarning
        >
          Copyright &copy; {new Date().getFullYear()} ASAGUS. All Rights Reserved.
        </motion.div>

      </div>
    </footer>
  )
}

export default Footer
