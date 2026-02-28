import type { Metadata } from 'next'
import { fetchProject } from '@/lib/projects-api'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await fetchProject(params.slug)
  
  if (!project || !project.published) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.metaTitle || project.title} - Case Study`,
    description: project.metaDescription || project.description,
    openGraph: {
      title: project.metaTitle || project.title,
      description: project.metaDescription || project.description,
      type: 'article',
      images: project.heroImage ? [{ url: project.heroImage }] : undefined,
    },
  }
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
