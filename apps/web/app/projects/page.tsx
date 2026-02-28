import { PortfolioFilter } from '@/components/portfolio-filter'
import { Footer } from '@/components/footer'
import type { Metadata } from 'next'
import { fetchProjects } from '@/lib/projects-api'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Projects - ASAGUS',
  description: 'Explore our complete portfolio of web development, mobile apps, brand design, and digital marketing projects.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects - ASAGUS',
    description: 'Explore our complete portfolio of web development, mobile apps, brand design, and digital marketing projects.',
    url: 'https://asagus.com/projects',
    type: 'website',
  },
}

export default async function ProjectsPage() {
  const projects = await fetchProjects({ 
    published: true, 
    limit: 200, 
    sortBy: 'createdAt', 
    sortOrder: 'desc' 
  })

  return (
    <>
      <PortfolioFilter initialProjects={projects} />
      <Footer />
    </>
  )
}
