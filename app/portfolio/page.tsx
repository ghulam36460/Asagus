import { PortfolioFilter } from '@/components/portfolio-filter'
import { ThemeToggle } from '@/components/theme-toggle'
import { ScrollProgress } from '@/components/scroll-progress'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio - ASAGUS',
  description: 'Explore our complete portfolio of web development, mobile apps, brand design, and digital marketing projects.',
}

export default function PortfolioPage() {
  return (
    <main className="relative min-h-screen">
      <ScrollProgress />
      <ThemeToggle />
      <PortfolioFilter />
      <Footer />
    </main>
  )
}
