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
  Sparkles,
  Shield,
  Timer,
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
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

// ─── Step 1 — Choose meeting type ─────────────────────────────────────────────
function StepMeetingType({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          WHAT BRINGS
          <span className="block bg-gradient-to-r from-[#1D4DF1] via-blue-400 to-purple-500 bg-clip-text text-transparent">
            YOU HERE?
          </span>
        </h2>
        <p className="text-white/50 text-sm">Pick the type of call that fits best — we'll prepare accordingly.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-3">
        {MEETING_TYPES.map((mt) => {
          const Icon = mt.icon
          const isActive = selected === mt.id
          return (
            <motion.button
              key={mt.id}
              onClick={() => onSelect(mt.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative text-left rounded-2xl border p-5 transition-all duration-200 overflow-hidden group"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${mt.accent}18, ${mt.accent}08)`
                  : "rgba(255,255,255,0.03)",
                borderColor: isActive ? mt.accent : "rgba(255,255,255,0.1)",
                boxShadow: isActive ? `0 0 24px ${mt.accent}30` : "none",
              }}
            >
              {/* Glow */}
              {isActive && (
                <motion.div
                  layoutId="meeting-glow"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 50%, ${mt.accent}15, transparent 70%)` }}
                />
              )}
              <div className="relative flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: isActive ? `${mt.accent}25` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isActive ? mt.accent : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span style={{ color: isActive ? mt.accent : "rgba(255,255,255,0.4)" }}><Icon className="w-4 h-4" /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{mt.label}</span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: isActive ? `${mt.accent}25` : "rgba(255,255,255,0.06)",
                        color: isActive ? mt.accent : "rgba(255,255,255,0.35)",
                      }}
                    >
                      {mt.duration}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{mt.description}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

// ─── Step 2 — Calendar & time slot ───────────────────────────────────────────
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
  const today    = new Date()
  const [viewYear,  setViewYear]  = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [slots,     setSlots]     = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ]

  const isDisabled = (d: Date) => {
    const dow = d.getDay()
    const stripped = new Date(d); stripped.setHours(0,0,0,0)
    const todayStripped = new Date(today); todayStripped.setHours(0,0,0,0)
    return dow === 0 || dow === 6 || stripped < todayStripped
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  useEffect(() => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setSlots([])
    fetch(`/api/booking?date=${toISODate(selectedDate)}`)
      .then(r => r.json())
      .then(d => setSlots(d.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [selectedDate])

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={itemVariants} className="space-y-1">
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          PICK YOUR
          <span className="block bg-gradient-to-r from-[#1D4DF1] via-blue-400 to-purple-500 bg-clip-text text-transparent">
            DATE & TIME
          </span>
        </h2>
        <p className="text-white/45 text-sm">Mon – Fri · All times UTC</p>
      </motion.div>

      {/* Two-column: calendar left, time slots right */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-[1fr_200px] gap-4">

        {/* ── Calendar ── */}
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {/* Month header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/08">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-white tracking-wide">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-white/20 tracking-widest uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5 px-3 pb-3">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`e-${idx}`} />
              const disabled = isDisabled(cell)
              const isSelected = selectedDate ? isSameDay(cell, selectedDate) : false
              const isToday    = isSameDay(cell, today)
              return (
                <motion.button
                  key={cell.toISOString()}
                  disabled={disabled}
                  onClick={() => { onDateChange(cell); onTimeChange("") }}
                  whileHover={disabled ? {} : { scale: 1.15 }}
                  whileTap={disabled ? {} : { scale: 0.9 }}
                  className="relative mx-auto flex items-center justify-center w-9 h-9 rounded-xl text-sm transition-all duration-100 outline-none select-none"
                  style={
                    isSelected
                      ? { background: "#1D4DF1", color: "#fff", fontWeight: 700, boxShadow: "0 0 18px rgba(29,77,241,0.6)" }
                      : isToday
                      ? { background: "rgba(29,77,241,0.18)", color: "#4F7EF7", fontWeight: 600, border: "1px solid rgba(29,77,241,0.45)" }
                      : disabled
                      ? { color: "rgba(255,255,255,0.13)", cursor: "not-allowed" }
                      : { color: "rgba(255,255,255,0.7)" }
                  }
                >
                  {cell.getDate()}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Time slots ── */}
        <div
          className="rounded-2xl border border-white/10 overflow-hidden flex flex-col"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/08">
            <Clock className="w-3.5 h-3.5 text-[#1D4DF1] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/45">
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select date"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3" style={{ maxHeight: 300 }}>
            <AnimatePresence mode="wait">
              {!selectedDate ? (
                <motion.div
                  key="no-date"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full py-8 gap-2"
                >
                  <Calendar className="w-7 h-7 text-white/15" />
                  <p className="text-xs text-white/25 text-center leading-relaxed">Pick a date<br/>to see slots</p>
                </motion.div>
              ) : loadingSlots ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                  {Array(7).fill(0).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-10 w-full rounded-xl"
                      animate={{ opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.08 }}
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    />
                  ))}
                </motion.div>
              ) : slots.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 gap-2">
                  <p className="text-xs text-white/25 text-center">No slots available</p>
                </motion.div>
              ) : (
                <motion.div
                  key={toISODate(selectedDate)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-1.5"
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
                        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left"
                        style={
                          active
                            ? { background: "#1D4DF1", color: "#fff", boxShadow: "0 0 14px rgba(29,77,241,0.45)", fontWeight: 600 }
                            : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.08)" }
                        }
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

// ─── Step 3 — Your details ────────────────────────────────────────────────────
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
    { key: "name"  as const, label: "Full Name",    type: "text",  icon: User,          placeholder: "Jane Smith" },
    { key: "email" as const, label: "Email Address", type: "email", icon: Mail,          placeholder: "you@company.com" },
    { key: "phone" as const, label: "Phone (optional)", type: "tel", icon: Phone,        placeholder: "+1 800 123 4567" },
  ]

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-1">
        <h2 className="font-display text-3xl sm:text-4xl text-white">
          ALMOST
          <span className="block bg-gradient-to-r from-[#1D4DF1] via-blue-400 to-purple-500 bg-clip-text text-transparent">
            THERE
          </span>
        </h2>
        <p className="text-white/50 text-sm">We'll send a confirmation and calendar invite to your email.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-white/45">{label}</label>
            <div className="relative">
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input
                type={type}
                value={form[key]}
                onChange={e => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/04 border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 focus:ring-2"
                style={{
                  borderColor: errors[key] ? "#ef4444" : "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.04)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#1D4DF1")}
                onBlur={e => (e.currentTarget.style.borderColor = errors[key] ? "#ef4444" : "rgba(255,255,255,0.1)")}
              />
            </div>
            {errors[key] && <p className="text-xs text-red-400">{errors[key]}</p>}
          </div>
        ))}

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/45">Notes (optional)</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-white/25 pointer-events-none" />
            <textarea
              rows={3}
              value={form.notes}
              onChange={e => onChange("notes", e.target.value)}
              placeholder="Anything specific you'd like to discuss or share…"
              className="w-full bg-white/04 border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 resize-none focus:ring-2"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "#1D4DF1")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Step 4 — Confirmation ────────────────────────────────────────────────────
function StepConfirmation({
  meetingType,
  date,
  time,
  form,
  ref: bookingRef,
}: {
  meetingType: MeetingType
  date: Date
  time: string
  form: BookingForm
  ref: string
}) {
  const Icon = meetingType.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 24 }}
      className="flex flex-col items-center text-center space-y-8 py-4"
    >
      {/* Check animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(29,77,241,0.3), rgba(29,77,241,0.05))",
            border: "2px solid rgba(29,77,241,0.5)",
            boxShadow: "0 0 48px rgba(29,77,241,0.4)",
          }}
        >
          <CheckCircle2 className="w-12 h-12 text-[#1D4DF1]" />
        </div>
        {/* Rings */}
        {[1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-full border border-[#1D4DF1]/20"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1 + ring * 0.4, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: ring * 0.4, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      <div className="space-y-2">
        <h2 className="font-display text-3xl text-white">YOU'RE BOOKED!</h2>
        <p className="text-white/50 text-sm">
          A confirmation email is headed to <span className="text-white">{form.email}</span>
        </p>
      </div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: "rgba(29,77,241,0.06)" }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-white/08"
          style={{ background: `${meetingType.accent}18` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${meetingType.accent}30`, border: `1px solid ${meetingType.accent}50` }}
          >
            <span style={{ color: meetingType.accent }}><Icon className="w-4 h-4" /></span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{meetingType.label}</p>
            <p className="text-xs text-white/40">{meetingType.duration}</p>
          </div>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-white/30">
            {bookingRef}
          </span>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 gap-3">
          {[
            { label: "Date",  value: formatDateDisplay(date) },
            { label: "Time",  value: `${formatTime12(time)} UTC` },
            { label: "Name",  value: form.name },
            { label: "Email", value: form.email },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">{label}</p>
              <p className="text-sm text-white/80 break-all">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-xs text-white/30 max-w-xs">
        Need to reschedule? Reply to the confirmation email and we'll sort it out within one business day.
      </p>
    </motion.div>
  )
}

// ─── Main BookingPage Component ───────────────────────────────────────────────
export default function BookingPage() {
  const [step,          setStep]         = useState(0)
  const [direction,     setDirection]    = useState(1)
  const [meetingTypeId, setMeetingTypeId]= useState("")
  const [selectedDate,  setSelectedDate] = useState<Date | null>(null)
  const [selectedTime,  setSelectedTime] = useState("")
  const [form,          setForm]         = useState<BookingForm>({ name: "", email: "", phone: "", notes: "" })
  const [formErrors,    setFormErrors]   = useState<Partial<BookingForm>>({})
  const [submitting,    setSubmitting]   = useState(false)
  const [bookingRef,    setBookingRef]   = useState("")
  const prefersReduced = useReducedMotion()

  const meetingType = MEETING_TYPES.find(m => m.id === meetingTypeId)

  const TOTAL_STEPS = 3 // 0,1,2 + success (3)

  const canNext = useCallback(() => {
    if (step === 0) return meetingTypeId !== ""
    if (step === 1) return selectedDate !== null && selectedTime !== ""
    if (step === 2) return form.name !== "" && form.email !== ""
    return false
  }, [step, meetingTypeId, selectedDate, selectedTime, form])

  const validateStep2 = () => {
    const errs: Partial<BookingForm> = {}
    if (!form.name.trim())  errs.name  = "Full name is required"
    if (!form.email.trim()) errs.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address"
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goNext = async () => {
    if (step === 2) {
      if (!validateStep2()) return
      // Submit
      setSubmitting(true)
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name:        form.name,
            email:       form.email,
            phone:       form.phone,
            notes:       form.notes,
            meetingType: meetingType?.label ?? meetingTypeId,
            date:        toISODate(selectedDate!),
            time:        selectedTime,
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
    setStep(s => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep(s => s - 1)
  }

  const stepLabel = ["Meeting type", "Date & time", "Your details"]

  return (
    <>
      <main
        className="relative min-h-screen text-white overflow-hidden"
        style={{ background: "#000" }}
      >
        {/* ── Background effects ──────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)
              `,
              backgroundSize: "72px 72px",
            }}
          />
          {/* Blue orb */}
          <motion.div
            animate={prefersReduced ? {} : {
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute"
            style={{
              top: "10%", left: "55%",
              width: 600, height: 600,
              background: "radial-gradient(circle, rgba(29,77,241,0.18), transparent 65%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Purple orb */}
          <motion.div
            animate={prefersReduced ? {} : {
              x: [0, -30, 20, 0],
              y: [0, 25, -15, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute"
            style={{
              bottom: "15%", right: "20%",
              width: 400, height: 400,
              background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 lg:py-32">
          {/* ── Section label ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center text-center mb-14 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/08 border border-white/12">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[#1D4DF1]"
              />
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/60">
                Book a Call
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-none tracking-tight">
              <span className="block text-white mb-1">LET'S TALK</span>
              <span className="block bg-gradient-to-r from-[#1D4DF1] via-blue-400 to-purple-500 bg-clip-text text-transparent">
                STRATEGY
              </span>
            </h1>
            <p className="text-white/50 max-w-md text-base">
              No forms, no endless email threads. Pick a time, tell us what you need, and let's build something remarkable.
            </p>
          </motion.div>

          {/* ── Wizard card ───────────────────────────────────────────────── */}
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div
                className="rounded-3xl border border-white/10 overflow-hidden"
                style={{
                  background: "rgba(10,10,18,0.85)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  boxShadow: "0 0 0 1px rgba(29,77,241,0.12), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Progress bar */}
                {step < 3 && (
                  <div className="px-8 pt-7 pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <StepDots current={step} total={3} />
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">
                        Step {step + 1} of 3 &mdash; {stepLabel[step]}
                      </span>
                    </div>
                    <div className="h-[1px]" style={{ background: "linear-gradient(90deg, rgba(29,77,241,0.4), rgba(255,255,255,0.05) 80%)" }} />
                  </div>
                )}

                {/* Step content */}
                <div className="px-8 py-7 min-h-[480px]">
                  <AnimatePresence custom={direction} mode="wait">
                    {step === 0 && (
                      <motion.div key="step-0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        <StepMeetingType
                          selected={meetingTypeId}
                          onSelect={setMeetingTypeId}
                        />
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
                            setForm(f => ({ ...f, [key]: value }))
                            setFormErrors(e => { const n = { ...e }; delete n[key]; return n })
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
                          ref={bookingRef}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation footer */}
                {step < 3 && (
                  <div
                    className="px-8 pb-7 flex items-center justify-between gap-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "20px" }}
                  >
                    {step > 0 ? (
                      <motion.button
                        onClick={goBack}
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-sm font-medium transition-colors"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                      >
                        <ArrowLeft className="w-4 h-4" />
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
                      className="relative flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm font-bold tracking-wide overflow-hidden transition-all duration-200"
                      style={
                        canNext() && !submitting
                          ? {
                              background: "linear-gradient(135deg, #1D4DF1 0%, #3B6EF8 100%)",
                              color: "#fff",
                              boxShadow: "0 0 0 1px rgba(29,77,241,0.5), 0 8px 24px rgba(29,77,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
                            }
                          : {
                              background: "rgba(255,255,255,0.06)",
                              color: "rgba(255,255,255,0.2)",
                              cursor: "not-allowed",
                              boxShadow: "none",
                            }
                      }
                    >
                      {canNext() && !submitting && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 100%)" }}
                        />
                      )}
                      <span className="relative">
                        {submitting ? (
                          <span className="flex items-center gap-2.5">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full"
                            />
                            Confirming…
                          </span>
                        ) : step === 2 ? (
                          <span className="flex items-center gap-2.5">Confirm Booking <CheckCircle2 className="w-4 h-4" /></span>
                        ) : (
                          <span className="flex items-center gap-2.5">Continue <ArrowRight className="w-4 h-4" /></span>
                        )}
                      </span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
