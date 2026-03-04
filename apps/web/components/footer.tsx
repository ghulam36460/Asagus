"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay },
  },
})

// ─── Social icons (inline SVGs for clean rendering) ───────────────────────────
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

// ─── Link data ────────────────────────────────────────────────────────────────
const footerLinks = {
  services: {
    title: "Services",
    links: [
      { label: "AI & Machine Learning", href: "/#services" },
      { label: "Web Development", href: "/#services" },
      { label: "Mobile Development", href: "/#services" },
      { label: "Enterprise Software", href: "/#services" },
      { label: "Cybersecurity", href: "/#services" },
      { label: "Automation & Data", href: "/#services" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Careers", href: "/#careers" },
      { label: "Blog", href: "/blog" },
      { label: "Research", href: "/research-development" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Products", href: "/products" },
      { label: "Projects", href: "/projects" },
      { label: "FAQs", href: "/#contact" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  connect: {
    title: "Connect",
    links: [
      { label: "Contact Us", href: "/#contact", external: false },
      { label: "LinkedIn", href: "https://linkedin.com", external: true },
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "X (Twitter)", href: "https://twitter.com", external: true },
    ],
  },
}

const socialLinks = [
  { icon: XIcon, href: "https://twitter.com", label: "X (Twitter)" },
  { icon: LinkedInIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: GitHubIcon, href: "https://github.com", label: "GitHub" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: YouTubeIcon, href: "https://youtube.com", label: "YouTube" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
]

// ─── CSS for hover states ─────────────────────────────────────────────────────
const footerStyles = `
  .footer-link {
    color: rgba(255,255,255,0.52);
    transition: color 0.2s ease;
    text-decoration: none;
    font-size: 0.84rem;
    line-height: 1.65;
  }
  .footer-link:hover {
    color: rgba(255,255,255,0.92);
  }
  .footer-social {
    color: rgba(255,255,255,0.42);
    transition: color 0.22s ease, transform 0.22s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer-social:hover {
    color: #ffffff;
    transform: translateY(-2px);
  }
  .footer-legal-link {
    color: rgba(255,255,255,0.32);
    transition: color 0.2s ease;
    text-decoration: none;
    font-size: 0.775rem;
  }
  .footer-legal-link:hover {
    color: rgba(255,255,255,0.72);
  }
  .footer-nav-heading {
    font-size: 0.6875rem;
    font-weight: 700;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.11em;
    text-transform: uppercase;
    margin-bottom: 1.35rem;
    font-family: var(--font-roboto), system-ui, sans-serif;
  }
  .footer-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 30px;
    border-radius: 9999px;
    background: #ffffff;
    color: #000000;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.18s ease, box-shadow 0.25s ease;
  }
  .footer-cta-primary:hover {
    background: rgba(255,255,255,0.93);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,255,255,0.14);
  }
  .footer-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 30px;
    border-radius: 9999px;
    background: transparent;
    color: rgba(255,255,255,0.88);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.16);
    transition: border-color 0.22s ease, background 0.22s ease, transform 0.18s ease, color 0.18s ease;
  }
  .footer-cta-secondary:hover {
    border-color: rgba(255,255,255,0.38);
    background: rgba(255,255,255,0.05);
    color: #ffffff;
    transform: translateY(-2px);
  }
`

// ─── Shared inner container ───────────────────────────────────────────────────
const INNER = "w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16"

// ═══════════════════════════════════════════════════════════════════════════════
export function Footer() {
  const prefersReduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const isInView = useInView(rootRef, { once: true, margin: "-60px" })

  const anim = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          variants: fadeUp(delay),
          initial: "hidden" as const,
          animate: isInView ? ("visible" as const) : ("hidden" as const),
        }

  const currentYear = new Date().getFullYear()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />
      <footer
        ref={rootRef}
        className="w-full site-footer"
        style={{
          background: "#000000",
          fontFamily: "var(--font-roboto), system-ui, sans-serif",
        }}
        aria-label="Site footer"
      >
        {/* ═══ GRADIENT SHIMMER SEPARATOR ══════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
            flexShrink: 0,
          }}
        />

        {/* ═══ PRE-FOOTER CTA ═══════════════════════════════════════════════ */}
        <div
          style={{
            borderBottom: "none",
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
          }}
        >
          <motion.div
            className={`${INNER} flex flex-col sm:flex-row items-center justify-between gap-10 pb-12 lg:pb-18`}
            style={{
              paddingTop: 0,
              marginTop: 0,
            }}
            {...anim(0.05)}
          >
            {/* Left: heading + subtext */}
            <div className="text-center sm:text-left">
              <p
                className="text-white font-bold leading-tight"
                style={{
                  fontFamily: "var(--font-azonix), sans-serif",
                  fontSize: "clamp(1.85rem, 3.2vw, 2.8rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                }}
              >
                Ready to build the future?
              </p>
              <p
                className="mt-3.5 text-[0.9375rem]"
                style={{ color: "rgba(255,255,255,0.45)", maxWidth: "440px", lineHeight: 1.6 }}
              >
                Let&apos;s discuss how we can accelerate your next project with&nbsp;AI-powered solutions.
              </p>
            </div>

            {/* Right: CTAs */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/#contact" className="footer-cta-primary">
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#contact" className="footer-cta-secondary">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ═══ MAIN LINK GRID ═══════════════════════════════════════════════ */}
        {/* gradient divider between CTA and links */}
        <div
          aria-hidden="true"
          style={{
            height: 1,
            margin: "0 24px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          }}
        />
        <div className={`${INNER} py-12 lg:py-16`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] gap-y-14 gap-x-6 sm:gap-x-10 lg:gap-x-14">

            {/* ── Col 1: Brand ─────────────────────────────────────────────── */}
            <motion.div className="col-span-2 sm:col-span-1 flex flex-col gap-5" {...anim(0.08)}>
              {/* Logo */}
              <Link
                href="/"
                aria-label="ASAGUS home"
                className="inline-flex items-center gap-2.5"
                style={{ textDecoration: "none" }}
              >
                <Image
                  src="/logo.png"
                  alt="ASAGUS logo"
                  width={24}
                  height={32}
                  style={{ objectFit: "contain", transform: "translateY(-1px)" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-azonix), sans-serif",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "0.08em",
                  }}
                >
                  ASAGUS
                </span>
              </Link>

              {/* Tagline */}
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.8125rem",
                  lineHeight: 1.75,
                  maxWidth: "300px",
                  fontFamily: "var(--font-roboto), system-ui, sans-serif",
                }}
              >
                Building intelligent solutions at the intersection of AI, engineering, and design.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-[18px]">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social"
                  >
                    <s.icon className="w-[18px] h-[18px]" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* ── Col 2: Services ──────────────────────────────────────────── */}
            <motion.div {...anim(0.12)}>
              <p className="footer-nav-heading">
                {footerLinks.services.title}
              </p>
              <ul className="flex flex-col gap-[0.72rem]">
                {footerLinks.services.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 3: Company ───────────────────────────────────────────── */}
            <motion.div {...anim(0.16)}>
              <p className="footer-nav-heading">
                {footerLinks.company.title}
              </p>
              <ul className="flex flex-col gap-[0.72rem]">
                {footerLinks.company.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 4: Resources ─────────────────────────────────────────── */}
            <motion.div {...anim(0.20)}>
              <p className="footer-nav-heading">
                {footerLinks.resources.title}
              </p>
              <ul className="flex flex-col gap-[0.72rem]">
                {footerLinks.resources.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 5: Connect ───────────────────────────────────────────── */}
            <motion.div {...anim(0.24)}>
              <p className="footer-nav-heading">
                {footerLinks.connect.title}
              </p>
              <ul className="flex flex-col gap-[0.72rem]">
                {footerLinks.connect.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} className="footer-link" target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="footer-link">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* ═══ BOTTOM BAR ═══════════════════════════════════════════════════ */}
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)",
          }}
        />
        <div>
          <motion.div
            className={`${INNER} flex flex-col sm:flex-row items-center justify-between gap-3 py-5 lg:py-6`}
            {...anim(0.28)}
            suppressHydrationWarning
          >
            {/* Copyright */}
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.76rem", letterSpacing: "0.01em" }}>
              &copy; {currentYear} ASAGUS. All rights reserved.
            </p>

            {/* Legal links */}
            <div className="flex items-center">
              {legalLinks.map((l, i) => (
                <span key={l.label} className="flex items-center">
                  <Link href={l.href} className="footer-legal-link">{l.label}</Link>
                  {i < legalLinks.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem", margin: "0 0.7rem" }}>
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

      </footer>
    </>
  )
}

export default Footer
