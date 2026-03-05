import type { Metadata } from "next"
import BookingPage from "@/components/booking-page"

export const metadata: Metadata = {
  title: "Book a Call - ASAGUS",
  description:
    "Schedule a discovery call, strategy session, or AI consultation with the ASAGUS team. No forms, no friction — just pick a time and let's talk.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Book a Call — ASAGUS",
    description:
      "Reserve your slot with an ASAGUS expert. Whether you're exploring AI, building a product, or scaling your team — we're here to help.",
    url: "https://asagus.com/contact",
    type: "website",
  },
}

export default function ContactPage() {
  return <BookingPage />
}
