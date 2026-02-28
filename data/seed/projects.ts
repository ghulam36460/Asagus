// Project data structure
export interface Project {
  slug: string
  title: string
  category: string
  technologies: string[]
  description: string
  fullDescription: string
  challenge: string
  solution: string
  results: {
    metric: string
    value: string
  }[]
  images: {
    hero: string
    gallery: string[]
  }
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
  date: string
  featured: boolean
  externalLink?: string
}

export const projects: Project[] = [
  {
    slug: 'logbog',
    title: 'LOGBOG',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'],
    description: 'React app in which authenticated users can post their blogs. A wide dynamic blogging app.',
    fullDescription: 'Built a full-stack blogging web application with a complete frontend, backend, and database architecture. The platform allows users to securely register and authenticate, create personal profiles, and publish high-quality blog content through an intuitive and visually appealing interface.\n\nThe application supports creating, editing, updating, and deleting blog posts, giving users full control over their content. A rich text editor enables well-formatted, engaging posts, while a responsive and modern UI ensures an excellent reading and writing experience across desktops, tablets, and mobile devices.\n\nOn the backend, a robust server and database system manage user authentication, blog data, comments, and permissions, ensuring security, scalability, and smooth performance. The platform also includes features such as commenting, content management, and real-time updates, making it a complete and production-ready blogging solution.\n\nThis project demonstrates strong expertise in full-stack web development, combining clean UI design, efficient backend logic, and reliable database management to deliver a seamless and beautiful user experience.',
    challenge: 'The client needed a user-friendly blogging platform that allows multiple users to contribute content while maintaining security and providing an engaging reading experience for visitors.',
    solution: 'Implemented a full-stack solution with React for the frontend, Node.js and Express for the backend API, and MongoDB for data storage. Added authentication using JWT tokens and implemented a rich text editor for content creation.',
    results: [
      { metric: 'Active Users', value: '5,000+' },
      { metric: 'Blog Posts', value: '10,000+' },
      { metric: 'Daily Visitors', value: '50,000+' },
      { metric: 'Engagement Rate', value: '85%' }
    ],
    images: {
      hero: '/images/logbog.png',
      gallery: [
        '/images/logbog.png',
        '/projects/logbog-2.jpg',
        '/projects/logbog-3.jpg',
        '/projects/logbog-4.jpg'
      ]
    },
    testimonial: {
      quote: 'LOGBOG transformed how our community shares ideas. The platform is intuitive and powerful.',
      author: 'Alex Rivera',
      role: 'Community Manager',
      company: 'TechWrite'
    },
    date: '2024-10-15',
    featured: true,
    externalLink: 'https://logbog.vercel.app/'
  },
  {
    slug: 'ai-vocal-expert',
    title: 'AI Vocal Expert',
    category: 'AI & Machine Learning',
    technologies: ['Python', 'TensorFlow', 'OpenAI', 'Face Recognition', 'Speech Recognition'],
    description: 'An AI vocal expert that can transcribe vocals and respond with face authentication for secure access.',
    fullDescription: 'Developed an advanced AI-powered vocal assistant that combines speech recognition, natural language processing, and facial authentication. The system can transcribe conversations in real-time, provide intelligent responses, and ensures secure access through biometric face recognition technology.',
    challenge: 'Create a secure, intelligent voice assistant that could accurately transcribe speech, understand context, and verify user identity through facial recognition while maintaining privacy and security standards.',
    solution: 'Integrated cutting-edge AI models for speech-to-text transcription, implemented OpenAI for intelligent responses, and used advanced facial recognition algorithms for biometric authentication. Built a secure pipeline that processes voice and video data in real-time.',
    results: [
      { metric: 'Transcription Accuracy', value: '98%' },
      { metric: 'Response Time', value: '<2s' },
      { metric: 'Face Recognition Accuracy', value: '99.5%' },
      { metric: 'User Satisfaction', value: '95%' }
    ],
    images: {
      hero: '/images/vocalexpert.png',
      gallery: [
        '/images/vocalexpert.png',
        '/projects/vocal-2.jpg',
        '/projects/vocal-3.jpg',
        '/projects/vocal-4.jpg'
      ]
    },
    testimonial: {
      quote: 'The AI Vocal Expert revolutionized our customer service. The accuracy and security features are outstanding.',
      author: 'David Martinez',
      role: 'CTO',
      company: 'VoiceTech Solutions'
    },
    date: '2024-09-20',
    featured: true
  },
  {
    slug: 'gs-dashboard',
    title: 'GS Dashboard',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redux'],
    description: 'A complete CRM dashboard system with complex data management, analytics, and automation features.',
    fullDescription: 'Developed a comprehensive CRM dashboard system that streamlines customer relationship management with advanced features. The platform includes customer tracking, sales pipeline management, automated workflows, detailed analytics, and real-time reporting capabilities for enterprise-level operations.',
    challenge: 'The client needed a powerful yet intuitive CRM system that could handle complex business processes, manage large volumes of customer data, and provide actionable insights while being easy to use for their sales and support teams.',
    solution: 'Built a robust full-stack application with React and TypeScript for a responsive frontend, Node.js backend for efficient data processing, and PostgreSQL for reliable data storage. Implemented Redux for state management, custom analytics engine, and automated workflow system.',
    results: [
      { metric: 'Sales Efficiency', value: '+75%' },
      { metric: 'Customer Response Time', value: '-60%' },
      { metric: 'Data Processing Speed', value: '8x faster' },
      { metric: 'User Adoption Rate', value: '92%' }
    ],
    images: {
      hero: '/images/gs.png',
      gallery: [
        '/images/gs.png',
        '/projects/gs-2.jpg',
        '/projects/gs-3.jpg',
        '/projects/gs-4.jpg'
      ]
    },
    testimonial: {
      quote: 'GS Dashboard revolutionized our sales process. The automation and insights have been game-changing for our business.',
      author: 'Jennifer Williams',
      role: 'VP of Sales',
      company: 'Global Solutions Inc'
    },
    date: '2024-08-25',
    featured: true
  },
  {
    slug: 'brand-identity-redesign',
    title: 'Complete Brand Identity Redesign',
    category: 'Brand Design',
    technologies: ['Figma', 'Adobe Suite', 'Brand Strategy'],
    description: 'Comprehensive brand refresh including logo, color palette, and brand guidelines.',
    fullDescription: 'Led a complete brand transformation for a growing tech startup. Created a modern, memorable brand identity that reflects their innovative spirit and appeals to their target audience. Delivered comprehensive brand guidelines, logo variations, and marketing collateral.',
    challenge: 'The company had outgrown their original brand identity and needed a refresh that would position them as industry leaders while maintaining some brand recognition. They needed a cohesive system that could scale across digital and print media.',
    solution: 'Conducted extensive brand workshops, competitor analysis, and customer research. Developed a bold new visual identity with a versatile logo system, vibrant color palette, and custom typography. Created detailed brand guidelines to ensure consistency across all touchpoints.',
    results: [
      { metric: 'Brand Recognition', value: '+65%' },
      { metric: 'Social Media Engagement', value: '+90%' },
      { metric: 'Website Traffic', value: '+120%' },
      { metric: 'Lead Quality Score', value: '+40%' }
    ],
    images: {
      hero: '/images/carosal-3.jpg',
      gallery: [
        '/projects/brand-1.jpg',
        '/projects/brand-2.jpg',
        '/projects/brand-3.jpg',
        '/projects/brand-4.jpg',
        '/projects/brand-5.jpg'
      ]
    },
    testimonial: {
      quote: 'Our new brand identity has exceeded all expectations. We\'ve seen tremendous growth since the launch.',
      author: 'Emily Rodriguez',
      role: 'CMO',
      company: 'TechVision'
    },
    date: '2024-07-10',
    featured: true
  },
  {
    slug: 'grilli-restaurant',
    title: 'Grilli',
    category: 'Web Development',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS'],
    description: 'A great restaurant website with elegant design, online reservations, and dynamic menu management.',
    fullDescription: 'Crafted an exceptional restaurant website for Grilli that captures the essence of fine dining. Features include an elegant, responsive design, online reservation system, dynamic menu management, gallery showcase, and seamless user experience that drives customer engagement and bookings.',
    challenge: 'The restaurant needed a sophisticated online presence that reflected their premium dining experience while making it easy for customers to view menus, make reservations, and learn about special events.',
    solution: 'Developed a stunning website using Next.js with smooth animations via Framer Motion. Integrated Sanity CMS for easy menu updates, implemented a custom reservation system, and optimized for mobile users who are often browsing on-the-go.',
    results: [
      { metric: 'Online Reservations', value: '+85%' },
      { metric: 'Website Traffic', value: '+150%' },
      { metric: 'Mobile Conversion', value: '+120%' },
      { metric: 'Customer Satisfaction', value: '96%' }
    ],
    images: {
      hero: '/images/grilli.png',
      gallery: [
        '/images/grilli.png',
        '/projects/grilli-2.jpg',
        '/projects/grilli-3.jpg',
        '/projects/grilli-4.jpg'
      ]
    },
    testimonial: {
      quote: 'The new website has transformed how customers discover and book our restaurant. It perfectly captures our brand.',
      author: 'Marco Giovanni',
      role: 'Owner & Chef',
      company: 'Grilli Restaurant'
    },
    date: '2024-07-25',
    featured: true,
    externalLink: 'https://grilli-master-one.vercel.app/'
  },
  {
    slug: 'mobile-fitness-app',
    title: 'Fitness Tracking Mobile App',
    category: 'Mobile Development',
    technologies: ['React Native', 'Firebase', 'HealthKit', 'Redux'],
    description: 'Cross-platform fitness app with workout tracking, nutrition logging, and social features.',
    fullDescription: 'Designed and developed a comprehensive fitness application that helps users track workouts, monitor nutrition, and connect with fitness communities. Integrated with device health APIs for automatic activity tracking and provided personalized workout recommendations.',
    challenge: 'Creating a unified experience across iOS and Android while integrating with platform-specific health APIs. The app needed to work offline, sync data seamlessly, and provide real-time workout tracking without draining battery life.',
    solution: 'Used React Native for cross-platform development with native modules for health integrations. Implemented efficient data sync with Firebase, offline-first architecture, and optimized background processes. Added gamification features to boost user engagement.',
    results: [
      { metric: 'Active Users', value: '50K+' },
      { metric: 'Daily Engagement', value: '25 min avg' },
      { metric: 'App Store Rating', value: '4.8/5' },
      { metric: 'User Retention (30 days)', value: '75%' }
    ],
    images: {
      hero: '/projects/fitness-hero.jpg',
      gallery: [
        '/projects/fitness-1.jpg',
        '/projects/fitness-2.jpg',
        '/projects/fitness-3.jpg'
      ]
    },
    testimonial: {
      quote: 'The app has transformed how our members engage with fitness. Retention is at an all-time high.',
      author: 'David Park',
      role: 'Founder',
      company: 'FitLife Pro'
    },
    date: '2024-06-05',
    featured: false
  }
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured)
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(project => project.category === category)
}

export const projectCategories = [
  'All',
  'Web Development',
  'Mobile Development',
  'Brand Design',
  'Digital Marketing'
]
