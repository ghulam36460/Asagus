import { notFound } from 'next/navigation'
import { ProjectPageClient } from '../../../components/project-page-client'
import { fetchProject } from '@/lib/projects-api'

export const revalidate = 60

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await fetchProject(params.slug)

  if (!project || !project.published) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
