"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Zap,
  Globe,
  Cpu,
  Layers,
  Rocket,
} from "lucide-react"
import { Footer } from "@/components/footer"

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════════ */
interface MeetingType {
  id: string
  label: string
  description: string
  duration: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  accentRgb: string
}

interface BookingForm {
  name: string
  email: string
  phone: string
  notes: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const MEETING_TYPES: MeetingType[] = [
  {
    id: "discovery",
    label: "Discovery Call",
    description: "First conversation about your project idea, challenges, and goals.",
    duration: "30 min",
    icon: Rocket,
    accent: "#1D4DF1",
    accentRgb: "29,77,241",
  },
  {
    id: "strategy",
    label: "Strategy Session",
    description: "Deep-dive into architecture, tech stack, and product roadmap.",
    duration: "60 min",
    icon: Layers,
    accent: "#7C3AED",
    accentRgb: "124,58,237",
  },
  {
    id: "ai-consultation",
    label: "AI Consultation",
    description: "Explore how AI and machine learning can transform your business.",
    duration: "45 min",
    icon: Cpu,
    accent: "#0EA5E9",
    accentRgb: "14,165,233",
  },
  {
    id: "web-review",
    label: "Web / App Review",
    description: "Live review of your existing product with actionable improvement tips.",
    duration: "45 min",
    icon: Globe,
    accent: "#10B981",
    accentRgb: "16,185,129",
  },
  {
    id: "quick-chat",
    label: "Quick Chat",
    description: "A fast 15-minute intro — ask anything, no agenda required.",
    duration: "15 min",
    icon: Zap,
    accent: "#F59E0B",
    accentRgb: "245,158,11",
  },
]

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const STEP_LABELS = ["Meeting type", "Date & time", "Your details"]

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDateDisplay(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function toISODate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatTime12(time24: string) {
  const [hStr, mStr] = time24.split(":")
  const h = parseInt(hStr, 10)
  const suffix = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${mStr} ${suffix}`
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.8 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP DOTS — Progress indicator
   ═══════════════════════════════════════════════════════════════════════════════ */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 28 : 8,
            backgroundColor: i <= current ? "#1D4DF1" : "rgba(255,255,255,0.15)",
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{ height: 8, borderRadius: 9999 }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP 1 — Choose meeting type
   Inspired by: Linear card selection, Scale AI dark premium feel
   ═══════════════════════════════════════════════════════════════════════════════ */
function StepMeetingType({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
          }}
        >
          WHAT BRINGS
        </h2>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            background: "linear-gradient(90deg, #1D4DF1, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          YOU HERE?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
          Pick the type of call that fits best — we&apos;ll prepare accordingly.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {MEETING_TYPES.map((mt) => {
          const Icon = mt.icon
          const isActive = selected === mt.id
          return (
            <motion.button
              key={mt.id}
              onClick={() => onSelect(mt.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: "relative",
                textAlign: "left",
                borderRadius: 16,
                border: `1px solid ${isActive ? mt.accent : "rgba(255,255,255,0.1)"}`,
                padding: 20,
                overflow: "hidden",
                cursor: "pointer",
                background: isActive
                  ? `linear-gradient(135deg, ${mt.accent}18, ${mt.accent}08)`
                  : "rgba(255,255,255,0.03)",
                boxShadow: isActive ? `0 0 24px ${mt.accent}30` : "none",
                width: "100%",
                outline: "none",
              }}
            >
              {/* Glow layer for active state */}
              {isActive && (
                <motion.div
                  layoutId="meeting-glow"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: `radial-gradient(circle at 30% 50%, ${mt.accent}15, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
              )}

              <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isActive ? `${mt.accent}25` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isActive ? mt.accent : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? mt.accent : "rgba(255,255,255,0.4)" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{mt.label}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "2px 8px",
                        borderRadius: 9999,
                        flexShrink: 0,
                        background: isActive ? `${mt.accent}25` : "rgba(255,255,255,0.06)",
                        color: isActive ? mt.accent : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {mt.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, margin: 0 }}>
                    {mt.description}
                  </p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP 2 — Calendar & time slot
   Inspired by: Cal.com 7-column grid, Vercel clean dark panels
   ═══════════════════════════════════════════════════════════════════════════════ */
function StepDateTime({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: {
  selectedDate: Date | null
  selectedTime: string
  onDateChange: (d: Date) => void
  onTimeChange: (t: string) => void
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ]

  const isDisabled = (d: Date) => {
    const dow = d.getDay()
    const stripped = new Date(d)
    stripped.setHours(0, 0, 0, 0)
    const todayStripped = new Date(today)
    todayStripped.setHours(0, 0, 0, 0)
    return dow === 0 || dow === 6 || stripped < todayStripped
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setSlots([])
    fetch(`/api/booking?date=${toISODate(selectedDate)}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
          }}
        >
          PICK YOUR
        </h2>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            background: "linear-gradient(90deg, #1D4DF1, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          DATE &amp; TIME
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 4, lineHeight: 1.6 }}>
          Mon – Fri · All times UTC
        </p>
      </motion.div>

      {/* Two-column: calendar + time slots */}
      <motion.div
        variants={itemVariants}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 200px",
          gap: 16,
        }}
      >
        {/* ── Calendar ── */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          {/* Month header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.4)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Day labels — FIXED: was DAYS, now WEEK_DAYS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              padding: "12px 12px 4px",
            }}
          >
            {WEEK_DAYS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "4px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              rowGap: 2,
              padding: "0 12px 12px",
            }}
          >
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} />
              const disabled = isDisabled(cell)
              const isSelected = selectedDate ? isSameDay(cell, selectedDate) : false
              const isToday = isSameDay(cell, today)
              return (
                <motion.button
                  key={cell.toISOString()}
                  disabled={disabled}
                  onClick={() => { onDateChange(cell); onTimeChange("") }}
                  whileHover={disabled ? {} : { scale: 1.15 }}
                  whileTap={disabled ? {} : { scale: 0.9 }}
                  style={{
                    position: "relative",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    fontSize: 14,
                    outline: "none",
                    border: isToday && !isSelected ? "1px solid rgba(29,77,241,0.45)" : "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    ...(isSelected
                      ? { background: "#1D4DF1", color: "#fff", fontWeight: 700, boxShadow: "0 0 18px rgba(29,77,241,0.6)" }
                      : isToday
                      ? { background: "rgba(29,77,241,0.18)", color: "#4F7EF7", fontWeight: 600 }
                      : disabled
                      ? { color: "rgba(255,255,255,0.13)", background: "transparent" }
                      : { color: "rgba(255,255,255,0.7)", background: "transparent" }),
                  }}
                >
                  {cell.getDate()}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Time slots ── */}
        <div
          style={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Clock style={{ width: 14, height: 14, color: "#1D4DF1", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)" }}>
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "Select date"}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, maxHeight: 300 }}>
            <AnimatePresence mode="wait">
              {!selectedDate ? (
                <motion.div
                  key="no-date"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "32px 0", gap: 8 }}
                >
                  <Calendar style={{ width: 28, height: 28, color: "rgba(255,255,255,0.15)" }} />
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", lineHeight: 1.5 }}>
                    Pick a date<br />to see slots
                  </p>
                </motion.div>
              ) : loadingSlots ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.1, 0.25, 0.1] }}
                        transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.08 }}
                        style={{ height: 40, width: "100%", borderRadius: 12, background: "rgba(255,255,255,0.07)" }}
                      />
                    ))}
                </motion.div>
              ) : slots.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", gap: 8 }}
                >
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>No slots available</p>
                </motion.div>
              ) : (
                <motion.div
                  key={toISODate(selectedDate)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {slots.map((slot, i) => {
                    const active = selectedTime === slot
                    return (
                      <motion.button
                        key={slot}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => onTimeChange(slot)}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 12,
                          fontSize: 14,
                          fontWeight: active ? 600 : 500,
                          textAlign: "left",
                          cursor: "pointer",
                          outline: "none",
                          border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                          ...(active
                            ? { background: "#1D4DF1", color: "#fff", boxShadow: "0 0 14px rgba(29,77,241,0.45)" }
                            : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)" }),
                        }}
                      >
                        {formatTime12(slot)}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP 3 — Your details
   Inspired by: Stripe's clean form fields, OpenAI's minimal approach
   ═══════════════════════════════════════════════════════════════════════════════ */
function StepDetails({
  form,
  onChange,
  errors,
}: {
  form: BookingForm
  onChange: (key: keyof BookingForm, value: string) => void
  errors: Partial<BookingForm>
}) {
  const fields = [
    { key: "name" as const, label: "Full Name", type: "text", icon: User, placeholder: "Jane Smith" },
    { key: "email" as const, label: "Email Address", type: "email", icon: Mail, placeholder: "you@company.com" },
    { key: "phone" as const, label: "Phone (optional)", type: "tel", icon: Phone, placeholder: "+1 800 123 4567" },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants} style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
          }}
        >
          ALMOST
        </h2>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
            background: "linear-gradient(90deg, #1D4DF1, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          THERE
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>
          We&apos;ll send a confirmation and calendar invite to your email.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
          <div key={key}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.45)",
                marginBottom: 6,
              }}
            >
              {label}
            </label>
            <div style={{ position: "relative" }}>
              <Icon
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "rgba(255,255,255,0.25)",
                  pointerEvents: "none",
                }}
              />
              <input
                type={type}
                value={form[key]}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${errors[key] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12,
                  paddingLeft: 44,
                  paddingRight: 16,
                  paddingTop: 14,
                  paddingBottom: 14,
                  fontSize: 14,
                  color: "#fff",
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#1D4DF1"
                  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(29,77,241,0.2)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors[key] ? "#ef4444" : "rgba(255,255,255,0.1)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              />
            </div>
            {errors[key] && (
              <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors[key]}</p>
            )}
          </div>
        ))}

        {/* Notes */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.45)",
              marginBottom: 6,
            }}
          >
            Notes (optional)
          </label>
          <div style={{ position: "relative" }}>
            <MessageSquare
              style={{
                position: "absolute",
                left: 16,
                top: 16,
                width: 16,
                height: 16,
                color: "rgba(255,255,255,0.25)",
                pointerEvents: "none",
              }}
            />
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Anything specific you'd like to discuss or share…"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                paddingLeft: 44,
                paddingRight: 16,
                paddingTop: 14,
                paddingBottom: 14,
                fontSize: 14,
                color: "#fff",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#1D4DF1"
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(29,77,241,0.2)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
                e.currentTarget.style.boxShadow = "none"
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   STEP 4 — Confirmation
   Inspired by: Stripe's clean confirmation, Vercel's success states
   ═══════════════════════════════════════════════════════════════════════════════ */
function StepConfirmation({
  meetingType,
  date,
  time,
  form,
  bookingRef,
}: {
  meetingType: MeetingType
  date: Date
  time: string
  form: BookingForm
  bookingRef: string
}) {
  const Icon = meetingType.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32, padding: "16px 0" }}
    >
      {/* Check animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        style={{ position: "relative" }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle, rgba(29,77,241,0.3), rgba(29,77,241,0.05))",
            border: "2px solid rgba(29,77,241,0.5)",
            boxShadow: "0 0 48px rgba(29,77,241,0.4)",
          }}
        >
          <CheckCircle2 style={{ width: 48, height: 48, color: "#1D4DF1" }} />
        </div>
        {/* Rings */}
        {[1, 2].map((ring) => (
          <motion.div
            key={ring}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(29,77,241,0.2)",
            }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1 + ring * 0.4, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: ring * 0.4, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      <div>
        <h2
          style={{
            fontFamily: "var(--font-azonix), sans-serif",
            fontSize: "1.875rem",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            margin: 0,
          }}
        >
          YOU&apos;RE BOOKED!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
          A confirmation email is headed to <span style={{ color: "#fff" }}>{form.email}</span>
        </p>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          background: "rgba(29,77,241,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: `${meetingType.accent}18`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${meetingType.accent}30`,
              border: `1px solid ${meetingType.accent}50`,
            }}
          >
            <Icon style={{ width: 16, height: 16, color: meetingType.accent }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{meetingType.label}</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>{meetingType.duration}</p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {bookingRef}
          </span>
        </div>
        <div
          style={{
            padding: "16px 20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[
            { label: "Date", value: formatDateDisplay(date) },
            { label: "Time", value: `${formatTime12(time)} UTC` },
            { label: "Name", value: form.name },
            { label: "Email", value: form.email },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "rgba(255,255,255,0.3)", margin: 0, marginBottom: 2 }}>
                {label}
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, wordBreak: "break-all" }}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", maxWidth: 320 }}>
        Need to reschedule? Reply to the confirmation email and we&apos;ll sort it out within one business day.
      </p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN — BookingPage
   Inspired by: Scale AI dark premium canvas, Stripe multi-step wizard,
                Vercel glass card, Apple restrained typography
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [meetingTypeId, setMeetingTypeId] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [form, setForm] = useState<BookingForm>({ name: "", email: "", phone: "", notes: "" })
  const [formErrors, setFormErrors] = useState<Partial<BookingForm>>({})
  const [submitting, setSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState("")
  const prefersReduced = useReducedMotion()

  const meetingType = MEETING_TYPES.find((m) => m.id === meetingTypeId)

  const canNext = useCallback(() => {
    if (step === 0) return meetingTypeId !== ""
    if (step === 1) return selectedDate !== null && selectedTime !== ""
    if (step === 2) return form.name !== "" && form.email !== ""
    return false
  }, [step, meetingTypeId, selectedDate, selectedTime, form])

  const validateStep2 = () => {
    const errs: Partial<BookingForm> = {}
    if (!form.name.trim()) errs.name = "Full name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goNext = async () => {
    if (step === 2) {
      if (!validateStep2()) return
      setSubmitting(true)
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            notes: form.notes,
            meetingType: meetingType?.label ?? meetingTypeId,
            date: toISODate(selectedDate!),
            time: selectedTime,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Booking failed")
        setBookingRef(data.ref ?? "")
        setDirection(1)
        setStep(3)
      } catch (err) {
        setFormErrors({ email: err instanceof Error ? err.message : "Something went wrong" })
      } finally {
        setSubmitting(false)
      }
      return
    }
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  return (
    <>
      {/*
        data-booking-page:
        This attribute activates the CSS isolation rules in globals.css,
        resetting all global transitions, heading fonts, and link hover
        states so nothing leaks into this component.

        ALL styles below use inline style objects — zero Tailwind utility
        classes that could collide with global rules.
      */}
      <main
        data-booking-page=""
        style={{
          position: "relative",
          minHeight: "100vh",
          color: "#fff",
          overflow: "hidden",
          background: "#000",
          fontFamily: "var(--font-roboto), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* ── Background effects ── */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Subtle grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.035,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)
              `,
              backgroundSize: "72px 72px",
            }}
          />
          {/* Blue orb */}
          <motion.div
            animate={
              prefersReduced
                ? {}
                : { x: [0, 40, -20, 0], y: [0, -30, 20, 0] }
            }
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "10%",
              left: "55%",
              width: 600,
              height: 600,
              background: "radial-gradient(circle, rgba(29,77,241,0.18), transparent 65%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Purple orb */}
          <motion.div
            animate={
              prefersReduced
                ? {}
                : { x: [0, -30, 20, 0], y: [0, 25, -15, 0] }
            }
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{
              position: "absolute",
              bottom: "15%",
              right: "20%",
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1152,
            margin: "0 auto",
            padding: "112px 16px 64px",
          }}
        >
          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              marginBottom: 56,
              gap: 16,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 20px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D4DF1" }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5em",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Book a Call
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-azonix), sans-serif",
                fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              <span style={{ display: "block", color: "#fff", marginBottom: 4 }}>LET&apos;S TALK</span>
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(90deg, #1D4DF1, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                STRATEGY
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 448, fontSize: 16, lineHeight: 1.6, margin: 0 }}>
              No forms, no endless email threads. Pick a time, tell us what you need, and let&apos;s build something remarkable.
            </p>
          </motion.div>

          {/* ── Wizard card ── */}
          <div style={{ maxWidth: 896, margin: "0 auto", width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                  background: "rgba(10,10,18,0.85)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 0 0 1px rgba(29,77,241,0.12), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Progress bar */}
                {step < 3 && (
                  <div style={{ padding: "28px 32px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <StepDots current={step} total={3} />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          color: "rgba(255,255,255,0.3)",
                        }}
                      >
                        Step {step + 1} of 3 &mdash; {STEP_LABELS[step]}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 1,
                        background: "linear-gradient(90deg, rgba(29,77,241,0.4), rgba(255,255,255,0.05) 80%)",
                      }}
                    />
                  </div>
                )}

                {/* Step content */}
                <div style={{ padding: "28px 32px", minHeight: 480 }}>
                  <AnimatePresence custom={direction} mode="wait">
                    {step === 0 && (
                      <motion.div key="step-0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <StepMeetingType selected={meetingTypeId} onSelect={setMeetingTypeId} />
                      </motion.div>
                    )}
                    {step === 1 && (
                      <motion.div key="step-1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <StepDateTime
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onDateChange={setSelectedDate}
                          onTimeChange={setSelectedTime}
                        />
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div key="step-2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <StepDetails
                          form={form}
                          onChange={(key, value) => {
                            setForm((f) => ({ ...f, [key]: value }))
                            setFormErrors((e) => {
                              const n = { ...e }
                              delete n[key]
                              return n
                            })
                          }}
                          errors={formErrors}
                        />
                      </motion.div>
                    )}
                    {step === 3 && meetingType && selectedDate && (
                      <motion.div key="step-3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <StepConfirmation
                          meetingType={meetingType}
                          date={selectedDate}
                          time={selectedTime}
                          form={form}
                          bookingRef={bookingRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation footer */}
                {step < 3 && (
                  <div
                    style={{
                      padding: "20px 32px 28px",
                      borderTop: "1px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    {step > 0 ? (
                      <motion.button
                        onClick={goBack}
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 14,
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.35)",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          outline: "none",
                          fontFamily: "inherit",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                      >
                        <ArrowLeft style={{ width: 16, height: 16 }} />
                        Back
                      </motion.button>
                    ) : (
                      <div />
                    )}

                    <motion.button
                      onClick={goNext}
                      disabled={!canNext() || submitting}
                      whileHover={canNext() && !submitting ? { scale: 1.02 } : {}}
                      whileTap={canNext() && !submitting ? { scale: 0.97 } : {}}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 32px",
                        borderRadius: 16,
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        overflow: "hidden",
                        border: "none",
                        cursor: canNext() && !submitting ? "pointer" : "not-allowed",
                        outline: "none",
                        fontFamily: "inherit",
                        ...(canNext() && !submitting
                          ? {
                              background: "linear-gradient(135deg, #1D4DF1 0%, #3B6EF8 100%)",
                              color: "#fff",
                              boxShadow: "0 0 0 1px rgba(29,77,241,0.5), 0 8px 24px rgba(29,77,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.2)",
                              boxShadow: "none",
                            }),
                      }}
                    >
                      {canNext() && !submitting && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 100%)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid rgba(255,255,255,0.25)",
                                borderTopColor: "#fff",
                                borderRadius: "50%",
                              }}
                            />
                            Confirming…
                          </>
                        ) : step === 2 ? (
                          <>
                            Confirm Booking
                            <CheckCircle2 style={{ width: 16, height: 16 }} />
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight style={{ width: 16, height: 16 }} />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Trust signals — Scale AI inspired ── */}
          {step < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                marginTop: 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { icon: "🔒", text: "End-to-End Encrypted" },
                  { icon: "⚡", text: "Instant Calendar Sync" },
                  { icon: "🌍", text: "All Timezones Supported" },
                ].map(({ icon, text }) => (
                  <span
                    key={text}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.3)",
                      padding: "6px 14px",
                      borderRadius: 9999,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{icon}</span>
                    {text}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
