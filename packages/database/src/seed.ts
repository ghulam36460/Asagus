import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load env from admin-panel root so DATABASE_URL is available
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // 1. Create Roles
  // ============================================
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "super_admin" },
      update: {},
      create: { name: "super_admin", description: "Full system access" },
    }),
    prisma.role.upsert({
      where: { name: "admin" },
      update: {},
      create: { name: "admin", description: "Most access, cannot manage system settings" },
    }),
    prisma.role.upsert({
      where: { name: "editor" },
      update: {},
      create: { name: "editor", description: "Content management only" },
    }),
    prisma.role.upsert({
      where: { name: "viewer" },
      update: {},
      create: { name: "viewer", description: "Read-only access" },
    }),
  ]);

  console.log("✅ Roles created:", roles.map((r) => r.name).join(", "));

  // ============================================
  // 2. Create Permissions
  // ============================================
  const resources = [
    "projects", "services", "testimonials", "faqs",
    "client_logos", "stats", "media", "users",
    "settings", "analytics", "contacts", "newsletter",
  ];
  const actions = ["create", "read", "update", "delete"];

  const permissions = [];
  for (const resource of resources) {
    for (const action of actions) {
      const perm = await prisma.permission.upsert({
        where: { resource_action: { resource, action } },
        update: {},
        create: { resource, action, description: `${action} ${resource}` },
      });
      permissions.push(perm);
    }
  }
  // Special permissions
  const specialPerms = [
    { resource: "projects", action: "publish", description: "Publish/unpublish projects" },
    { resource: "settings", action: "system", description: "Modify system settings" },
    { resource: "users", action: "assign_roles", description: "Assign roles to users" },
    { resource: "analytics", action: "export", description: "Export analytics reports" },
    { resource: "newsletter", action: "export", description: "Export newsletter subscribers" },
  ];
  for (const sp of specialPerms) {
    const perm = await prisma.permission.upsert({
      where: { resource_action: { resource: sp.resource, action: sp.action } },
      update: {},
      create: sp,
    });
    permissions.push(perm);
  }

  console.log(`✅ ${permissions.length} permissions created`);

  // ============================================
  // 3. Assign Permissions to Roles
  // ============================================
  const allPermIds = permissions.map((p) => p.id);
  const superAdminRole = roles[0];
  const adminRole = roles[1];
  const editorRole = roles[2];
  const viewerRole = roles[3];

  // Super Admin: all permissions
  for (const permId of allPermIds) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permId } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: permId },
    });
  }

  // Admin: all except system settings, assign roles, delete users
  const adminExclude = permissions
    .filter((p) =>
      (p.resource === "settings" && p.action === "system") ||
      (p.resource === "users" && p.action === "assign_roles") ||
      (p.resource === "users" && p.action === "delete")
    )
    .map((p) => p.id);

  for (const permId of allPermIds.filter((id) => !adminExclude.includes(id))) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permId } },
      update: {},
      create: { roleId: adminRole.id, permissionId: permId },
    });
  }

  // Editor: content CRUD (no delete except own), read analytics
  const editorPerms = permissions.filter((p) => {
    const contentResources = ["projects", "services", "testimonials", "faqs", "client_logos", "stats", "media"];
    if (contentResources.includes(p.resource) && ["create", "read", "update"].includes(p.action)) return true;
    if (p.resource === "projects" && p.action === "publish") return true;
    if (p.resource === "analytics" && p.action === "read") return true;
    if (p.resource === "analytics" && p.action === "export") return true;
    if (p.resource === "contacts" && ["read", "update"].includes(p.action)) return true;
    return false;
  });

  for (const perm of editorPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: editorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: editorRole.id, permissionId: perm.id },
    });
  }

  // Viewer: read-only on content & analytics
  const viewerPerms = permissions.filter((p) => {
    const viewResources = ["projects", "services", "testimonials", "faqs", "client_logos", "stats", "media", "analytics", "contacts"];
    return viewResources.includes(p.resource) && p.action === "read";
  });

  for (const perm of viewerPerms) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: viewerRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: viewerRole.id, permissionId: perm.id },
    });
  }

  console.log("✅ Role permissions assigned");

  // ============================================
  // 4. Create Super Admin User
  // ============================================
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@asagus.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@2026Secure!";
  const adminName = process.env.SUPER_ADMIN_NAME || "Super Admin";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: adminName,
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  });

  console.log(`✅ Super Admin created: ${adminEmail}`);

  // ============================================
  // 5. Seed Initial Settings
  // ============================================
  const settings = [
    { key: "site_name", value: JSON.stringify("ASAGUS"), group: "general", label: "Site Name", type: "string" },
    { key: "site_description", value: JSON.stringify("AI, Cybersecurity & Web Development Solutions"), group: "general", label: "Site Description", type: "string" },
    { key: "site_url", value: JSON.stringify("https://asagus.com"), group: "general", label: "Site URL", type: "string" },
    { key: "contact_email", value: JSON.stringify("contact@asagus.com"), group: "general", label: "Contact Email", type: "string" },
    { key: "social_github", value: JSON.stringify("https://github.com/asagus"), group: "social", label: "GitHub URL", type: "string" },
    { key: "social_linkedin", value: JSON.stringify(""), group: "social", label: "LinkedIn URL", type: "string" },
    { key: "social_twitter", value: JSON.stringify(""), group: "social", label: "Twitter URL", type: "string" },
    { key: "maintenance_mode", value: JSON.stringify(false), group: "general", label: "Maintenance Mode", type: "boolean" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Settings seeded");

  // ============================================
  // 6. Seed Technologies with Icons
  // ============================================
  const technologies = [
    // Frontend
    { name: "React", slug: "react", icon: "devicon-react-original", iconType: "devicon", color: "#61DAFB", category: "Frontend" },
    { name: "Next.js", slug: "nextjs", icon: "devicon-nextjs-original", iconType: "devicon", color: "#000000", category: "Frontend" },
    { name: "Vue.js", slug: "vuejs", icon: "devicon-vuejs-original", iconType: "devicon", color: "#4FC08D", category: "Frontend" },
    { name: "Angular", slug: "angular", icon: "devicon-angular-plain", iconType: "devicon", color: "#DD0031", category: "Frontend" },
    { name: "Svelte", slug: "svelte", icon: "devicon-svelte-plain", iconType: "devicon", color: "#FF3E00", category: "Frontend" },
    { name: "TypeScript", slug: "typescript", icon: "devicon-typescript-plain", iconType: "devicon", color: "#3178C6", category: "Frontend" },
    { name: "JavaScript", slug: "javascript", icon: "devicon-javascript-plain", iconType: "devicon", color: "#F7DF1E", category: "Frontend" },
    { name: "HTML5", slug: "html5", icon: "devicon-html5-plain", iconType: "devicon", color: "#E34F26", category: "Frontend" },
    { name: "CSS3", slug: "css3", icon: "devicon-css3-plain", iconType: "devicon", color: "#1572B6", category: "Frontend" },
    { name: "Tailwind CSS", slug: "tailwind", icon: "devicon-tailwindcss-plain", iconType: "devicon", color: "#06B6D4", category: "Frontend" },
    { name: "Redux", slug: "redux", icon: "devicon-redux-original", iconType: "devicon", color: "#764ABC", category: "Frontend" },
    
    // Backend
    { name: "Node.js", slug: "nodejs", icon: "devicon-nodejs-plain", iconType: "devicon", color: "#339933", category: "Backend" },
    { name: "Express", slug: "express", icon: "devicon-express-original", iconType: "devicon", color: "#000000", category: "Backend" },
    { name: "Python", slug: "python", icon: "devicon-python-plain", iconType: "devicon", color: "#3776AB", category: "Backend" },
    { name: "Django", slug: "django", icon: "devicon-django-plain", iconType: "devicon", color: "#092E20", category: "Backend" },
    { name: "Flask", slug: "flask", icon: "devicon-flask-original", iconType: "devicon", color: "#000000", category: "Backend" },
    { name: "FastAPI", slug: "fastapi", icon: "devicon-fastapi-plain", iconType: "devicon", color: "#009688", category: "Backend" },
    { name: "PHP", slug: "php", icon: "devicon-php-plain", iconType: "devicon", color: "#777BB4", category: "Backend" },
    { name: "Laravel", slug: "laravel", icon: "devicon-laravel-plain", iconType: "devicon", color: "#FF2D20", category: "Backend" },
    { name: "Ruby", slug: "ruby", icon: "devicon-ruby-plain", iconType: "devicon", color: "#CC342D", category: "Backend" },
    { name: "Ruby on Rails", slug: "rails", icon: "devicon-rails-plain", iconType: "devicon", color: "#CC0000", category: "Backend" },
    { name: "Go", slug: "go", icon: "devicon-go-original-wordmark", iconType: "devicon", color: "#00ADD8", category: "Backend" },
    { name: "Java", slug: "java", icon: "devicon-java-plain", iconType: "devicon", color: "#007396", category: "Backend" },
    { name: "Spring Boot", slug: "spring", icon: "devicon-spring-plain", iconType: "devicon", color: "#6DB33F", category: "Backend" },
    
    // Database
    { name: "PostgreSQL", slug: "postgresql", icon: "devicon-postgresql-plain", iconType: "devicon", color: "#4169E1", category: "Database" },
    { name: "MongoDB", slug: "mongodb", icon: "devicon-mongodb-plain", iconType: "devicon", color: "#47A248", category: "Database" },
    { name: "MySQL", slug: "mysql", icon: "devicon-mysql-plain", iconType: "devicon", color: "#4479A1", category: "Database" },
    { name: "Redis", slug: "redis", icon: "devicon-redis-plain", iconType: "devicon", color: "#DC382D", category: "Database" },
    { name: "SQLite", slug: "sqlite", icon: "devicon-sqlite-plain", iconType: "devicon", color: "#003B57", category: "Database" },
    { name: "Firebase", slug: "firebase", icon: "devicon-firebase-plain", iconType: "devicon", color: "#FFCA28", category: "Database" },
    { name: "Supabase", slug: "supabase", icon: "devicon-supabase-plain", iconType: "devicon", color: "#3ECF8E", category: "Database" },
    
    // Mobile
    { name: "React Native", slug: "react-native", icon: "devicon-react-original", iconType: "devicon", color: "#61DAFB", category: "Mobile" },
    { name: "Flutter", slug: "flutter", icon: "devicon-flutter-plain", iconType: "devicon", color: "#02569B", category: "Mobile" },
    { name: "Swift", slug: "swift", icon: "devicon-swift-plain", iconType: "devicon", color: "#FA7343", category: "Mobile" },
    { name: "Kotlin", slug: "kotlin", icon: "devicon-kotlin-plain", iconType: "devicon", color: "#7F52FF", category: "Mobile" },
    
    // DevOps & Cloud
    { name: "Docker", slug: "docker", icon: "devicon-docker-plain", iconType: "devicon", color: "#2496ED", category: "DevOps" },
    { name: "Kubernetes", slug: "kubernetes", icon: "devicon-kubernetes-plain", iconType: "devicon", color: "#326CE5", category: "DevOps" },
    { name: "AWS", slug: "aws", icon: "devicon-amazonwebservices-original", iconType: "devicon", color: "#FF9900", category: "Cloud" },
    { name: "Azure", slug: "azure", icon: "devicon-azure-plain", iconType: "devicon", color: "#0078D4", category: "Cloud" },
    { name: "Google Cloud", slug: "gcp", icon: "devicon-googlecloud-plain", iconType: "devicon", color: "#4285F4", category: "Cloud" },
    { name: "Vercel", slug: "vercel", icon: "devicon-vercel-original", iconType: "devicon", color: "#000000", category: "Cloud" },
    { name: "Nginx", slug: "nginx", icon: "devicon-nginx-original", iconType: "devicon", color: "#009639", category: "DevOps" },
    { name: "Jenkins", slug: "jenkins", icon: "devicon-jenkins-plain", iconType: "devicon", color: "#D24939", category: "DevOps" },
    { name: "GitHub Actions", slug: "github-actions", icon: "devicon-github-original", iconType: "devicon", color: "#2088FF", category: "DevOps" },
    
    // AI & ML
    { name: "TensorFlow", slug: "tensorflow", icon: "devicon-tensorflow-original", iconType: "devicon", color: "#FF6F00", category: "AI & ML" },
    { name: "PyTorch", slug: "pytorch", icon: "devicon-pytorch-original", iconType: "devicon", color: "#EE4C2C", category: "AI & ML" },
    { name: "OpenAI", slug: "openai", icon: "devicon-openai-plain", iconType: "devicon", color: "#412991", category: "AI & ML" },
    
    // Design & Other
    { name: "Figma", slug: "figma", icon: "devicon-figma-plain", iconType: "devicon", color: "#F24E1E", category: "Design" },
    { name: "Adobe Suite", slug: "adobe", icon: "devicon-photoshop-plain", iconType: "devicon", color: "#31A8FF", category: "Design" },
    { name: "Git", slug: "git", icon: "devicon-git-plain", iconType: "devicon", color: "#F05032", category: "Tools" },
    { name: "GraphQL", slug: "graphql", icon: "devicon-graphql-plain", iconType: "devicon", color: "#E10098", category: "Backend" },
    { name: "Prisma", slug: "prisma", icon: "devicon-prisma-original", iconType: "devicon", color: "#2D3748", category: "Backend" },
    { name: "Framer Motion", slug: "framer-motion", icon: "devicon-framermotion-original", iconType: "devicon", color: "#0055FF", category: "Frontend" },
    { name: "Sanity CMS", slug: "sanity", icon: "devicon-sanity-plain", iconType: "devicon", color: "#F03E2F", category: "Backend" },
    { name: "HealthKit", slug: "healthkit", icon: "devicon-apple-original", iconType: "devicon", color: "#000000", category: "Mobile" },
    { name: "Face Recognition", slug: "face-recognition", icon: "devicon-opencv-plain", iconType: "devicon", color: "#5C3EE8", category: "AI & ML" },
    { name: "Speech Recognition", slug: "speech-recognition", icon: "devicon-python-plain", iconType: "devicon", color: "#3776AB", category: "AI & ML" },
    { name: "Brand Strategy", slug: "brand-strategy", icon: "devicon-figma-plain", iconType: "devicon", color: "#F24E1E", category: "Design" },
  ];

  for (const tech of technologies) {
    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {},
      create: tech,
    });
  }

  console.log("✅ Technologies seeded with icons");

  // ============================================
  // 7. Seed All Projects (from existing hardcoded data)
  // ============================================
  const projectsData = [
    {
      project: {
        title: "LOGBOG",
        slug: "logbog",
        description: "React app in which authenticated users can post their blogs. A wide dynamic blogging app.",
        fullDescription: "Built a full-stack blogging web application with a complete frontend, backend, and database architecture. The platform allows users to securely register and authenticate, create personal profiles, and publish high-quality blog content through an intuitive and visually appealing interface.\n\nThe application supports creating, editing, updating, and deleting blog posts, giving users full control over their content. A rich text editor enables well-formatted, engaging posts, while a responsive and modern UI ensures an excellent reading and writing experience across desktops, tablets, and mobile devices.\n\nOn the backend, a robust server and database system manage user authentication, blog data, comments, and permissions, ensuring security, scalability, and smooth performance. The platform also includes features such as commenting, content management, and real-time updates, making it a complete and production-ready blogging solution.\n\nThis project demonstrates strong expertise in full-stack web development, combining clean UI design, efficient backend logic, and reliable database management to deliver a seamless and beautiful user experience.",
        category: "Web Development",
        technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Express"],
        heroImage: "/images/logbog.png",
        galleryImages: ["/images/logbog.png", "/projects/logbog-2.jpg", "/projects/logbog-3.jpg", "/projects/logbog-4.jpg"],
        challenge: "The client needed a user-friendly blogging platform that allows multiple users to contribute content while maintaining security and providing an engaging reading experience for visitors.",
        solution: "Implemented a full-stack solution with React for the frontend, Node.js and Express for the backend API, and MongoDB for data storage. Added authentication using JWT tokens and implemented a rich text editor for content creation.",
        featured: true,
        published: true,
        projectUrl: "https://logbog.vercel.app/",
        year: "2024",
        createdAt: new Date("2024-10-15"),
      },
      metrics: [
        { metric: "Active Users", value: "5,000+" },
        { metric: "Blog Posts", value: "10,000+" },
        { metric: "Daily Visitors", value: "50,000+" },
        { metric: "Engagement Rate", value: "85%" },
      ],
      testimonial: {
        quote: "LOGBOG transformed how our community shares ideas. The platform is intuitive and powerful.",
        author: "Alex Rivera",
        role: "Community Manager",
        company: "TechWrite",
      },
    },
    {
      project: {
        title: "AI Vocal Expert",
        slug: "ai-vocal-expert",
        description: "An AI vocal expert that can transcribe vocals and respond with face authentication for secure access.",
        fullDescription: "Developed an advanced AI-powered vocal assistant that combines speech recognition, natural language processing, and facial authentication. The system can transcribe conversations in real-time, provide intelligent responses, and ensures secure access through biometric face recognition technology.",
        category: "AI & Machine Learning",
        technologies: ["Python", "TensorFlow", "OpenAI", "Face Recognition", "Speech Recognition"],
        heroImage: "/images/vocalexpert.png",
        galleryImages: ["/images/vocalexpert.png", "/projects/vocal-2.jpg", "/projects/vocal-3.jpg", "/projects/vocal-4.jpg"],
        challenge: "Create a secure, intelligent voice assistant that could accurately transcribe speech, understand context, and verify user identity through facial recognition while maintaining privacy and security standards.",
        solution: "Integrated cutting-edge AI models for speech-to-text transcription, implemented OpenAI for intelligent responses, and used advanced facial recognition algorithms for biometric authentication. Built a secure pipeline that processes voice and video data in real-time.",
        featured: true,
        published: true,
        year: "2024",
        createdAt: new Date("2024-09-20"),
      },
      metrics: [
        { metric: "Transcription Accuracy", value: "98%" },
        { metric: "Response Time", value: "<2s" },
        { metric: "Face Recognition Accuracy", value: "99.5%" },
        { metric: "User Satisfaction", value: "95%" },
      ],
      testimonial: {
        quote: "The AI Vocal Expert revolutionized our customer service. The accuracy and security features are outstanding.",
        author: "David Martinez",
        role: "CTO",
        company: "VoiceTech Solutions",
      },
    },
    {
      project: {
        title: "GS Dashboard",
        slug: "gs-dashboard",
        description: "A complete CRM dashboard system with complex data management, analytics, and automation features.",
        fullDescription: "Developed a comprehensive CRM dashboard system that streamlines customer relationship management with advanced features. The platform includes customer tracking, sales pipeline management, automated workflows, detailed analytics, and real-time reporting capabilities for enterprise-level operations.",
        category: "Web Development",
        technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redux"],
        heroImage: "/images/gs.png",
        galleryImages: ["/images/gs.png", "/projects/gs-2.jpg", "/projects/gs-3.jpg", "/projects/gs-4.jpg"],
        challenge: "The client needed a powerful yet intuitive CRM system that could handle complex business processes, manage large volumes of customer data, and provide actionable insights while being easy to use for their sales and support teams.",
        solution: "Built a robust full-stack application with React and TypeScript for a responsive frontend, Node.js backend for efficient data processing, and PostgreSQL for reliable data storage. Implemented Redux for state management, custom analytics engine, and automated workflow system.",
        featured: true,
        published: true,
        year: "2024",
        createdAt: new Date("2024-08-25"),
      },
      metrics: [
        { metric: "Sales Efficiency", value: "+75%" },
        { metric: "Customer Response Time", value: "-60%" },
        { metric: "Data Processing Speed", value: "8x faster" },
        { metric: "User Adoption Rate", value: "92%" },
      ],
      testimonial: {
        quote: "GS Dashboard revolutionized our sales process. The automation and insights have been game-changing for our business.",
        author: "Jennifer Williams",
        role: "VP of Sales",
        company: "Global Solutions Inc",
      },
    },
    {
      project: {
        title: "Complete Brand Identity Redesign",
        slug: "brand-identity-redesign",
        description: "Comprehensive brand refresh including logo, color palette, and brand guidelines.",
        fullDescription: "Led a complete brand transformation for a growing tech startup. Created a modern, memorable brand identity that reflects their innovative spirit and appeals to their target audience. Delivered comprehensive brand guidelines, logo variations, and marketing collateral.",
        category: "Brand Design",
        technologies: ["Figma", "Adobe Suite", "Brand Strategy"],
        heroImage: "/images/carosal-3.jpg",
        galleryImages: ["/projects/brand-1.jpg", "/projects/brand-2.jpg", "/projects/brand-3.jpg", "/projects/brand-4.jpg", "/projects/brand-5.jpg"],
        challenge: "The company had outgrown their original brand identity and needed a refresh that would position them as industry leaders while maintaining some brand recognition. They needed a cohesive system that could scale across digital and print media.",
        solution: "Conducted extensive brand workshops, competitor analysis, and customer research. Developed a bold new visual identity with a versatile logo system, vibrant color palette, and custom typography. Created detailed brand guidelines to ensure consistency across all touchpoints.",
        featured: true,
        published: true,
        year: "2024",
        createdAt: new Date("2024-07-10"),
      },
      metrics: [
        { metric: "Brand Recognition", value: "+65%" },
        { metric: "Social Media Engagement", value: "+90%" },
        { metric: "Website Traffic", value: "+120%" },
        { metric: "Lead Quality Score", value: "+40%" },
      ],
      testimonial: {
        quote: "Our new brand identity has exceeded all expectations. We've seen tremendous growth since the launch.",
        author: "Emily Rodriguez",
        role: "CMO",
        company: "TechVision",
      },
    },
    {
      project: {
        title: "Grilli",
        slug: "grilli-restaurant",
        description: "A great restaurant website with elegant design, online reservations, and dynamic menu management.",
        fullDescription: "Crafted an exceptional restaurant website for Grilli that captures the essence of fine dining. Features include an elegant, responsive design, online reservation system, dynamic menu management, gallery showcase, and seamless user experience that drives customer engagement and bookings.",
        category: "Web Development",
        technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "Sanity CMS"],
        heroImage: "/images/grilli.png",
        galleryImages: ["/images/grilli.png", "/projects/grilli-2.jpg", "/projects/grilli-3.jpg", "/projects/grilli-4.jpg"],
        challenge: "The restaurant needed a sophisticated online presence that reflected their premium dining experience while making it easy for customers to view menus, make reservations, and learn about special events.",
        solution: "Developed a stunning website using Next.js with smooth animations via Framer Motion. Integrated Sanity CMS for easy menu updates, implemented a custom reservation system, and optimized for mobile users who are often browsing on-the-go.",
        featured: true,
        published: true,
        projectUrl: "https://grilli-master-one.vercel.app/",
        year: "2024",
        createdAt: new Date("2024-07-25"),
      },
      metrics: [
        { metric: "Online Reservations", value: "+85%" },
        { metric: "Website Traffic", value: "+150%" },
        { metric: "Mobile Conversion", value: "+120%" },
        { metric: "Customer Satisfaction", value: "96%" },
      ],
      testimonial: {
        quote: "The new website has transformed how customers discover and book our restaurant. It perfectly captures our brand.",
        author: "Marco Giovanni",
        role: "Owner & Chef",
        company: "Grilli Restaurant",
      },
    },
    {
      project: {
        title: "Fitness Tracking Mobile App",
        slug: "mobile-fitness-app",
        description: "Cross-platform fitness app with workout tracking, nutrition logging, and social features.",
        fullDescription: "Designed and developed a comprehensive fitness application that helps users track workouts, monitor nutrition, and connect with fitness communities. Integrated with device health APIs for automatic activity tracking and provided personalized workout recommendations.",
        category: "Mobile Development",
        technologies: ["React Native", "Firebase", "HealthKit", "Redux"],
        heroImage: "/projects/fitness-hero.jpg",
        galleryImages: ["/projects/fitness-1.jpg", "/projects/fitness-2.jpg", "/projects/fitness-3.jpg"],
        challenge: "Creating a unified experience across iOS and Android while integrating with platform-specific health APIs. The app needed to work offline, sync data seamlessly, and provide real-time workout tracking without draining battery life.",
        solution: "Used React Native for cross-platform development with native modules for health integrations. Implemented efficient data sync with Firebase, offline-first architecture, and optimized background processes. Added gamification features to boost user engagement.",
        featured: false,
        published: true,
        year: "2024",
        createdAt: new Date("2024-06-05"),
      },
      metrics: [
        { metric: "Active Users", value: "50K+" },
        { metric: "Daily Engagement", value: "25 min avg" },
        { metric: "App Store Rating", value: "4.8/5" },
        { metric: "User Retention (30 days)", value: "75%" },
      ],
      testimonial: {
        quote: "The app has transformed how our members engage with fitness. Retention is at an all-time high.",
        author: "David Park",
        role: "Founder",
        company: "FitLife Pro",
      },
    },
  ];

  for (const data of projectsData) {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.project.slug },
      include: { metrics: true, testimonial: true, projectTechnologies: true },
    });

    let project;
    if (existingProject) {
      console.log(`  → Project "${data.project.title}" already exists, skipping...`);
      project = existingProject;
    } else {
      project = await prisma.project.create({
        data: data.project,
      });

      // Link technologies to project
      const techNames = data.project.technologies;
      for (const techName of techNames) {
        // Find technology by name (case insensitive)
        const technology = await prisma.technology.findFirst({
          where: { 
            OR: [
              { name: { equals: techName, mode: 'insensitive' } },
              { slug: techName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
            ]
          }
        });
        
        if (technology) {
          await prisma.projectTechnology.create({
            data: {
              projectId: project.id,
              technologyId: technology.id,
            },
          });
        }
      }

      // Add metrics
      for (const metric of data.metrics) {
        await prisma.projectMetric.create({
          data: {
            projectId: project.id,
            metric: metric.metric,
            value: metric.value,
          },
        });
      }

      // Add testimonial
      if (data.testimonial) {
        await prisma.projectTestimonial.create({
          data: {
            projectId: project.id,
            quote: data.testimonial.quote,
            author: data.testimonial.author,
            role: data.testimonial.role,
            company: data.testimonial.company,
          },
        });
      }
      console.log(`  ✓ Created project: ${data.project.title}`);
    }
  }

  console.log("✅ All 6 projects seeded with metrics and testimonials");

  console.log("\n🎉 Database seeding complete!");
  console.log(`\n📧 Admin Login: ${adminEmail}`);
  console.log(`🔑 Admin Password: [hidden - check your .env file]`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
