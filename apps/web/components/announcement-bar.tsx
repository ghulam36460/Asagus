"use client"

import { X } from "lucide-react"

const ANNOUNCEMENT_TEXT = "We are now accepting new project inquiries for 2026."
const CTA_TEXT = "Book a call →"

interface AnnouncementBarProps {
  visible: boolean
  onDismiss: () => void
}

export function AnnouncementBar({ visible, onDismiss }: AnnouncementBarProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: "relative",
        left: 0,
        right: 0,
        zIndex: 1200,
        height: "44px",
        background: "rgba(20,14,40,0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 48px",
      }}
      role="banner"
      aria-label="Announcement"
    >
      {/* Centered content */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "var(--font-roboto), sans-serif",
      }}>
        {/* Icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>

        {/* Text */}
        <span style={{
          fontSize: "0.82rem",
          color: "rgba(255,255,255,0.8)",
          fontWeight: 400,
          letterSpacing: "0.01em",
        }}>
          {ANNOUNCEMENT_TEXT}
        </span>

        {/* CTA */}
        <a
          href="#contact"
          style={{
            fontSize: "0.82rem",
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
          }}
        >
          {CTA_TEXT}
        </a>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        style={{
          all: "unset",
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "rgba(255,255,255,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
