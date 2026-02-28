export interface ProjectRecord {
  id: string
  title: string
  slug: string
  description: string
  fullDescription?: string
  category: string
  clientName?: string
  industry?: string
  technologies: string[]
  heroImage?: string
  galleryImages: string[]
  challenge?: string
  solution?: string
  projectUrl?: string
  githubUrl?: string
  year?: string
  duration?: string
  teamSize?: string
  featured: boolean
  published: boolean
  viewCount?: number
  orderIndex?: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
  metrics?: { metric: string; value: string }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
  createdAt?: string
  updatedAt?: string
}

interface ProjectListResponse {
  success: boolean
  data?: ProjectRecord[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  error?: string
}

interface ProjectResponse {
  success: boolean
  data?: ProjectRecord
  error?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return
    searchParams.set(key, String(value))
  })
  return searchParams.toString()
}

export async function fetchProjects(params: {
  published?: boolean
  featured?: boolean
  category?: string
  search?: string
  limit?: number
  page?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<ProjectRecord[]> {
  const query = buildQuery(params)
  const url = `${API_BASE}/projects${query ? `?${query}` : ''}`

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return []
    }

    const payload = (await response.json()) as ProjectListResponse
    if (!payload.success || !Array.isArray(payload.data)) {
      return []
    }

    return payload.data
  } catch {
    return []
  }
}

export async function fetchProject(slug: string): Promise<ProjectRecord | null> {
  if (!slug) return null

  try {
    const response = await fetch(`${API_BASE}/projects/${slug}`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as ProjectResponse
    if (!payload.success || !payload.data) {
      return null
    }

    return payload.data
  } catch {
    return null
  }
}
