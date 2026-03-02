/**
 * Services API — fetches service data from the backend.
 * Falls back to static seed data when API is unreachable.
 */

export interface ServiceRecord {
  id: string
  title: string
  slug: string
  subtitle?: string
  description: string
  icon?: string
  features: string[]
  deliverables: string[]
  isActive: boolean
  featured: boolean
  orderIndex: number
  // Card visual
  cardType: string        // "hero" | "standard"
  accentColor: string     // hex
  categoryLabel?: string
  imageUrl?: string
  ctaLabel: string
  ctaHref: string
  // SEO
  metaTitle?: string
  metaDescription?: string
  createdAt?: string
  updatedAt?: string
}

interface ServiceListResponse {
  success: boolean
  data?: ServiceRecord[]
  error?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

// ── Fallback static data (used when API is unreachable) ─────────────────────
const FALLBACK_SERVICES: ServiceRecord[] = [
  {
    id: 'fb-ai',
    title: 'Intelligent AI Systems That Learn',
    slug: 'ai-machine-learning',
    subtitle: 'Custom models trained on your data',
    description:
      'We build custom LLM integrations, computer vision pipelines, NLP models, and autonomous AI agents — trained on your data, deployed in your infrastructure.',
    icon: 'Brain',
    features: ['Custom LLMs', 'Computer Vision', 'NLP Models', 'AI Agents', 'MLOps Pipelines'],
    deliverables: [],
    isActive: true,
    featured: true,
    orderIndex: 0,
    cardType: 'hero',
    accentColor: '#3b82f6',
    categoryLabel: 'AI & Machine Learning',
    ctaLabel: 'Explore AI Services',
    ctaHref: '#contact',
  },
  {
    id: 'fb-web',
    title: 'Full-Stack Products Built to Scale',
    slug: 'web-mobile-development',
    subtitle: 'Enterprise-grade web & mobile apps',
    description:
      'Next.js, React, and TypeScript web applications with enterprise-grade performance. React Native and Flutter mobile apps. Beautiful interfaces backed by solid architecture.',
    icon: 'Code2',
    features: ['Next.js & React', 'React Native', 'Flutter', 'TypeScript', 'API Design'],
    deliverables: [],
    isActive: true,
    featured: true,
    orderIndex: 1,
    cardType: 'hero',
    accentColor: '#a78bfa',
    categoryLabel: 'Web & Mobile Development',
    ctaLabel: 'Explore Dev Services',
    ctaHref: '#contact',
  },
  {
    id: 'fb-data',
    title: 'Data Pipelines & Workflow Automation',
    slug: 'automation-data',
    description:
      'End-to-end data engineering, ETL pipelines, real-time analytics dashboards, and intelligent workflow automation that removes manual bottlenecks.',
    icon: 'Database',
    features: ['ETL Pipelines', 'Real-time Analytics', 'Workflow Automation'],
    deliverables: [],
    isActive: true,
    featured: false,
    orderIndex: 2,
    cardType: 'standard',
    accentColor: '#34d399',
    categoryLabel: 'Automation & Data',
    ctaLabel: 'Learn more',
    ctaHref: '#contact',
  },
  {
    id: 'fb-enterprise',
    title: 'Custom Enterprise Solutions',
    slug: 'enterprise-software',
    description:
      'Bespoke CRM, ERP, and internal tooling built for scale. Microservices architecture, cloud-native deployment, SSO, and RBAC from day one.',
    icon: 'Cog',
    features: ['CRM & ERP', 'Microservices', 'Cloud-Native', 'SSO & RBAC'],
    deliverables: [],
    isActive: true,
    featured: false,
    orderIndex: 3,
    cardType: 'standard',
    accentColor: '#fb923c',
    categoryLabel: 'Enterprise Software',
    ctaLabel: 'Learn more',
    ctaHref: '#contact',
  },
  {
    id: 'fb-security',
    title: 'Security-First Development',
    slug: 'cybersecurity',
    description:
      'Penetration testing, secure code reviews, OWASP compliance, and end-to-end encryption built into every layer of your application from the ground up.',
    icon: 'ShieldCheck',
    features: ['Pen Testing', 'Secure Code Review', 'OWASP Compliance', 'E2E Encryption'],
    deliverables: [],
    isActive: true,
    featured: false,
    orderIndex: 4,
    cardType: 'standard',
    accentColor: '#f472b6',
    categoryLabel: 'Cybersecurity',
    ctaLabel: 'Learn more',
    ctaHref: '#contact',
  },
]

export async function fetchServices(params: {
  active?: boolean
  featured?: boolean
} = {}): Promise<ServiceRecord[]> {
  const searchParams = new URLSearchParams()
  if (params.active !== undefined) searchParams.set('active', String(params.active))

  const url = `${API_BASE}/services${searchParams.toString() ? `?${searchParams}` : ''}`

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.warn('[services-api] API returned', response.status, '- using fallback data')
      return FALLBACK_SERVICES
    }

    const payload = (await response.json()) as ServiceListResponse
    if (!payload.success || !Array.isArray(payload.data) || payload.data.length === 0) {
      return FALLBACK_SERVICES
    }

    return payload.data
  } catch {
    console.warn('[services-api] API unreachable - using fallback data')
    return FALLBACK_SERVICES
  }
}
