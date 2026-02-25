export interface CardEntry {
  id: string
  title: string
  description: string
  imageUrl: string | null
  category: string
  tech: string[]
  link?: string
  createdAt: string
}

/**
 * Static fallback — mirrors the real projects data.
 * Used when /api/cards is unavailable.
 */
export const staticCards: CardEntry[] = [
  {
    id: '01',
    title: 'LOGBOG',
    description:
      'Full-stack blogging platform with rich-text editing, JWT auth, and a fully responsive UI. 5 000+ users and 10 000+ published posts live in production.',
    imageUrl: '/images/logbog.png',
    category: 'Web Development',
    tech: ['React', 'Node.js', 'MongoDB'],
    link: '/projects/logbog',
    createdAt: '2024-10-15T00:00:00.000Z',
  },
  {
    id: '02',
    title: 'AI Vocal Expert',
    description:
      'Real-time voice assistant with speech-to-text transcription, OpenAI-powered responses, and biometric face authentication at 99.5 % accuracy.',
    imageUrl: '/images/vocalexpert.png',
    category: 'AI & Machine Learning',
    tech: ['Python', 'TensorFlow', 'OpenAI'],
    link: '/projects/ai-vocal-expert',
    createdAt: '2024-09-20T00:00:00.000Z',
  },
  {
    id: '03',
    title: 'GS Dashboard',
    description:
      'Enterprise CRM dashboard with sales pipeline, automated workflows, and real-time analytics. Cut customer response time by 60 % within Q1.',
    imageUrl: '/images/gs.png',
    category: 'Web Development',
    tech: ['React', 'TypeScript', 'PostgreSQL'],
    link: '/projects/gs-dashboard',
    createdAt: '2024-08-25T00:00:00.000Z',
  },
  {
    id: '04',
    title: 'Brand Redesign',
    description:
      'End-to-end brand identity overhaul — logo system, color palette, and design guidelines. Resulted in a 120 % uplift in web traffic post-launch.',
    imageUrl: '/images/carosal-3.jpg',
    category: 'Brand Design',
    tech: ['Figma', 'Adobe Suite'],
    link: '/projects/brand-identity-redesign',
    createdAt: '2024-07-10T00:00:00.000Z',
  },
  {
    id: '05',
    title: 'Grilli',
    description:
      'Premium restaurant website with custom reservation system and CMS-driven menus. Mobile conversion improved 120 % in the first 30 days.',
    imageUrl: '/images/grilli.png',
    category: 'Web Development',
    tech: ['Next.js', 'Framer Motion', 'Sanity'],
    link: '/projects/grilli-restaurant',
    createdAt: '2024-07-25T00:00:00.000Z',
  },
  {
    id: '06',
    title: 'FitLife Pro',
    description:
      'Cross-platform fitness app with offline-first architecture, HealthKit sync, and gamified challenges. Rated 4.8 / 5 with 50 K+ active users.',
    imageUrl: null,
    category: 'Mobile Development',
    tech: ['React Native', 'Firebase', 'Redux'],
    link: '/projects/mobile-fitness-app',
    createdAt: '2024-06-05T00:00:00.000Z',
  },
]
