import type { Metadata } from "next"
import { AboutTimeline } from "@/components/about-timeline"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Us - ASAGUS",
  description:
    "Learn how ASAGUS went from a bold idea in 2024 to a global AI & software partner — our story, our values, and the milestones that shaped us.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us - ASAGUS",
    description:
      "From founding in 2024 to 30+ projects across 12 countries — discover the story and values behind ASAGUS.",
    url: "https://asagus.com/about",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutTimeline />
      <Footer />
    </>
  )
}
