"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

// ─── Timeline data ────────────────────────────────────────────────────────────
const milestones = [
  {
    year: "2024",
    quarter: "Q1",
    title: "The Spark",
    description:
      "ASAGUS was born from a single question: why does cutting-edge AI remain locked behind enterprise walls? A small team of engineers, designers, and researchers set out to democratise intelligent software.",
    tags: ["Founded", "Vision", "Team of 5"],
    side: "right",
    accent: "#1D4DF1",
  },
  {
    year: "2024",
    quarter: "Q2",
    title: "First Products Ship",
    description:
      "We launched our first AI-assisted web platform for a logistics client, compressing a 6-month roadmap into 11 weeks. Proof that move-fast and build-right aren't opposites.",
    tags: ["Product Launch", "AI Integration", "Logistics"],
    side: "left",
    accent: "#7C3AED",
  },
  {
    year: "2024",
    quarter: "Q3",
    title: "R&D Lab Opens",
    description:
      "Our dedicated Research & Development lab went live — a space where machine-learning experiments, open-source tooling, and product innovation happen simultaneously, not sequentially.",
    tags: ["R&D", "Open Source", "ML Research"],
    side: "right",
    accent: "#0EA5E9",
  },
  {
    year: "2024",
    quarter: "Q4",
    title: "10+ Enterprise Clients",
    description:
      "By year's end we had delivered scalable solutions across fintech, healthcare, and e-commerce verticals — a portfolio of 10+ enterprise clients and zero missed deadlines.",
    tags: ["10+ Clients", "Enterprise", "Scale"],
    side: "left",
    accent: "#10B981",
  },
  {
    year: "2025",
    quarter: "Q1",
    title: "Team of 20",
    description:
      "We grew to 20 full-time specialists: AI engineers, full-stack developers, UX researchers, and product strategists. Remote-first, globally distributed, relentlessly aligned.",
    tags: ["20 People", "Remote-first", "Global"],
    side: "right",
    accent: "#F59E0B",
  },
  {
    year: "2025",
    quarter: "Q2",
    title: "ASAGUS Intelligence Platform",
    description:
      "We unveiled our proprietary Intelligence Platform — a modular AI layer that accelerates time-to-production for custom ML models, cutting average deployment time by 70%.",
    tags: ["Platform", "ML Ops", "70% Faster"],
    side: "left",
    accent: "#EC4899",
  },
  {
    year: "2025",
    quarter: "Q4",
    title: "30+ Projects Delivered",
    description:
      "Thirty-plus production-grade applications shipped across 12 countries. From real-time dashboards in São Paulo to computer-vision pipelines in Seoul — ASAGUS is everywhere intelligence matters.",
    tags: ["30+ Projects", "12 Countries", "Global Impact"],
    side: "right",
    accent: "#1D4DF1",
  },
  {
    year: "2026",
    quarter: "Now",
    title: "Building the Next Chapter",
    description:
      "We're doubling down on autonomous AI agents, edge-native applications, and human-centred design. The best is always the next thing we build.",
    tags: ["AI Agents", "Edge AI", "Future"],
    side: "left",
    accent: "#7C3AED",
  },
]

const values = [
  {
    icon: "⚡",
    title: "Velocity with Craft",
    description: "We ship fast — but never at the cost of quality. Every line of code is written with intention.",
    accent: "#1D4DF1",
  },
  {
    icon: "🧠",
    title: "Intelligent by Default",
    description: "AI isn't a feature we bolt on. It's the foundation every product is built from.",
    accent: "#7C3AED",
  },
  {
    icon: "🌐",
    title: "Globally Minded",
    description: "Distributed team. Diverse perspectives. Products that work everywhere for everyone.",
    accent: "#0EA5E9",
  },
  {
    icon: "🔒",
    title: "Security First",
    description: "Privacy, compliance, and resilience are non-negotiable — engineered in from day one.",
    accent: "#10B981",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px", amount: threshold })
  return { ref, inView }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TimelineCard({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0]
  index: number
}) {
  const { ref, inView } = useReveal()
  const prefersReduced = useReducedMotion()
  const isLeft = milestone.side === "left"

  return (
    <div
      ref={ref}
      className="timeline-row"
    >
      {/* Left content or spacer */}
      <div className="timeline-left">
        {isLeft ? (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: "420px", width: "100%" }}
          >
            <CardContent milestone={milestone} />
          </motion.div>
        ) : null}
      </div>

      {/* Center dot */}
      <div className="timeline-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        <motion.div
          initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05, type: "spring", stiffness: 200, damping: 15 }}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${milestone.accent}cc, ${milestone.accent}44)`,
            border: `2px solid ${milestone.accent}`,
            boxShadow: `0 0 20px ${milestone.accent}66, 0 0 40px ${milestone.accent}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={prefersReduced ? {} : { scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#fff",
              boxShadow: `0 0 8px ${milestone.accent}`,
            }}
          />
        </motion.div>

        {/* Year badge */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{
            marginTop: "0.5rem",
            padding: "2px 10px",
            borderRadius: "999px",
            background: `${milestone.accent}22`,
            border: `1px solid ${milestone.accent}55`,
            fontSize: "0.7rem",
            fontFamily: "var(--font-azonix), sans-serif",
            color: milestone.accent,
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}
        >
          {milestone.year} {milestone.quarter}
        </motion.div>
      </div>

      {/* Right content — on mobile, ALL cards show here */}
      <div className="timeline-right">
        {(!isLeft || true) ? (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: isLeft ? -30 : 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ maxWidth: "420px", width: "100%", display: isLeft ? "none" : "block" }}
            className={isLeft ? "timeline-mobile-show" : ""}
          >
            {!isLeft && <CardContent milestone={milestone} />}
          </motion.div>
        ) : null}
        {isLeft && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="timeline-mobile-show"
            style={{ maxWidth: "420px", width: "100%", display: "none" }}
          >
            <CardContent milestone={milestone} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

function CardContent({ milestone }: { milestone: (typeof milestones)[0] }) {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -4,
              boxShadow: `0 16px 48px ${milestone.accent}22, 0 0 0 1px ${milestone.accent}44`,
            }
      }
      style={{
        padding: "1.75rem 2rem",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${milestone.accent}33`,
        backdropFilter: "blur(16px)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle glow bg */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top left, ${milestone.accent}11 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <h3
        style={{
          fontFamily: "var(--font-azonix), sans-serif",
          fontSize: "1.1rem",
          color: "#fff",
          marginBottom: "0.75rem",
          position: "relative",
        }}
      >
        {milestone.title}
      </h3>
      <p
        style={{
          color: "rgba(255,255,255,0.62)",
          fontSize: "0.9rem",
          lineHeight: 1.7,
          marginBottom: "1rem",
          fontFamily: "var(--font-roboto), sans-serif",
          position: "relative",
        }}
      >
        {milestone.description}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", position: "relative" }}>
        {milestone.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "3px 10px",
              borderRadius: "999px",
              background: `${milestone.accent}18`,
              border: `1px solid ${milestone.accent}44`,
              fontSize: "0.72rem",
              color: milestone.accent,
              fontFamily: "var(--font-roboto), sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function ValueCard({ val, index }: { val: (typeof values)[0]; index: number }) {
  const { ref, inView } = useReveal()
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={prefersReduced ? {} : { y: -6, borderColor: `${val.accent}66` }}
      style={{
        flex: "1 1 220px",
        padding: "2rem 1.75rem",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
        transition: "border-color 0.3s, transform 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top left, ${val.accent}0d 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{val.icon}</div>
      <h4
        style={{
          fontFamily: "var(--font-azonix), sans-serif",
          fontSize: "0.95rem",
          color: "#fff",
          marginBottom: "0.6rem",
          letterSpacing: "0.02em",
        }}
      >
        {val.title}
      </h4>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.7, fontFamily: "var(--font-roboto), sans-serif" }}>
        {val.description}
      </p>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AboutTimeline() {
  const prefersReduced = useReducedMotion()

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050510",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .timeline-row {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          align-items: center;
          margin-bottom: 4rem;
          position: relative;
        }
        .timeline-left  { display: flex; justify-content: flex-end; padding-right: 2rem; }
        .timeline-right { padding-left: 2rem; }
        @media (max-width: 700px) {
          .timeline-row {
            grid-template-columns: 44px 1fr !important;
          }
          .timeline-left  { display: none !important; }
          .timeline-right { padding-left: 1.25rem; }
          .timeline-mobile-show { display: block !important; }
          .timeline-center { padding: 0; }
        }
      `}</style>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 1.5rem 6rem",
          overflow: "hidden",
        }}
      >
        {/* Animated orb background */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <motion.div
            animate={prefersReduced ? {} : { scale: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #1D4DF144 0%, #7C3AED22 50%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={prefersReduced ? {} : { scale: [1, 1.12, 1], opacity: [0.12, 0.22, 0.12] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{
              position: "absolute",
              bottom: "10%",
              left: "20%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #0EA5E933 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <motion.div
            animate={prefersReduced ? {} : { scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }}
            style={{
              position: "absolute",
              top: "30%",
              right: "15%",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background: "radial-gradient(circle, #EC489933 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          {/* Grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ position: "relative", maxWidth: "800px" }}
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "999px",
              background: "rgba(29,77,241,0.12)",
              border: "1px solid rgba(29,77,241,0.35)",
              fontSize: "0.78rem",
              color: "#7B9EFF",
              fontFamily: "var(--font-roboto), sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Our Story
          </motion.div>

          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: "var(--font-azonix), sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            We Build What
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #1D4DF1 0%, #7C3AED 50%, #0EA5E9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Matters Most
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.75,
              fontFamily: "var(--font-roboto), sans-serif",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            ASAGUS is a software company born in 2024 with one ambition: make intelligent, beautiful technology available to every business that dares to dream bigger.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            animate={prefersReduced ? {} : { y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              marginTop: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.3)",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "var(--font-roboto), sans-serif",
            }}
          >
            <span>Scroll to explore</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden>
              <rect x="0.5" y="0.5" width="15" height="23" rx="7.5" stroke="currentColor" strokeOpacity="0.4" />
              <motion.rect
                x="6.5"
                y="4"
                width="3"
                height="6"
                rx="1.5"
                fill="currentColor"
                animate={prefersReduced ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Timeline ────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem 6rem",
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <SectionHeading
          label="Timeline"
          title="From Idea to Impact"
          subtitle="Every milestone is a chapter in our story. Here's how ASAGUS went from a bold idea to a global technology partner."
        />

        {/* Vertical track */}
        <div style={{ position: "relative", marginTop: "4rem" }}>
          {/* Center line */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "1px",
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom, transparent 0%, rgba(29,77,241,0.35) 10%, rgba(124,58,237,0.35) 50%, rgba(14,165,233,0.35) 90%, transparent 100%)",
              zIndex: 0,
            }}
          />
          {/* Moving glow */}
          <motion.div
            aria-hidden
            animate={prefersReduced ? {} : { top: ["0%", "100%", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              width: "3px",
              height: "80px",
              background: "linear-gradient(to bottom, transparent, #1D4DF1, #7C3AED, transparent)",
              filter: "blur(2px)",
              borderRadius: "2px",
              zIndex: 1,
            }}
          />

          {milestones.map((m, i) => (
            <TimelineCard key={`${m.year}-${m.quarter}`} milestone={m} index={i} />
          ))}
        </div>
      </section>

      {/* ── Core values ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem 6rem",
          background: "rgba(255,255,255,0.015)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeading
            label="Our Values"
            title="Principles We Code By"
            subtitle="These aren't posters on a wall. They're the decisions we make every day."
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.25rem",
              justifyContent: "center",
              marginTop: "3.5rem",
            }}
          >
            {values.map((v, i) => (
              <ValueCard key={v.title} val={v} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string
  title: string
  subtitle: string
}) {
  const { ref, inView } = useReveal()
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "4px 14px",
          borderRadius: "999px",
          background: "rgba(29,77,241,0.1)",
          border: "1px solid rgba(29,77,241,0.3)",
          fontSize: "0.72rem",
          color: "#7B9EFF",
          fontFamily: "var(--font-roboto), sans-serif",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: "1.2rem",
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-azonix), sans-serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          color: "#fff",
          lineHeight: 1.15,
          marginBottom: "1rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "rgba(255,255,255,0.52)",
          fontSize: "1rem",
          lineHeight: 1.75,
          fontFamily: "var(--font-roboto), sans-serif",
        }}
      >
        {subtitle}
      </p>
    </motion.div>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, inView } = useReveal()
  const prefersReduced = useReducedMotion()

  return (
    <section style={{ padding: "6rem 1.5rem 8rem" }}>
      <motion.div
        ref={ref}
        initial={prefersReduced ? false : { opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          textAlign: "center",
          padding: "4rem 2.5rem",
          borderRadius: "28px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(29,77,241,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center top, rgba(29,77,241,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: "0.78rem",
            color: "#7B9EFF",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "var(--font-roboto), sans-serif",
            marginBottom: "1.2rem",
          }}
        >
          Ready to build?
        </div>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "1.25rem",
            letterSpacing: "-0.01em",
          }}
        >
          Let&#8217;s create something
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #1D4DF1 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            extraordinary together
          </span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.52)",
            fontSize: "1rem",
            lineHeight: 1.7,
            fontFamily: "var(--font-roboto), sans-serif",
            marginBottom: "2.5rem",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Whether you need a cutting-edge AI system or a polished digital product, we have the team and the track record to deliver.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <motion.a
            href="/contact"
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "13px 28px",
              borderRadius: "9999px",
              background: "#1D4DF1",
              color: "#fff",
              fontSize: "0.9rem",
              fontFamily: "var(--font-roboto), sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(29,77,241,0.4)",
              transition: "box-shadow 0.3s",
            }}
          >
            Start a Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <motion.a
            href="/projects"
            whileHover={prefersReduced ? {} : { scale: 1.03 }}
            whileTap={prefersReduced ? {} : { scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "13px 28px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.9rem",
              fontFamily: "var(--font-roboto), sans-serif",
              fontWeight: 400,
              textDecoration: "none",
              transition: "border-color 0.3s, background 0.3s",
            }}
          >
            View Our Work
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}
