// ============================================
// Shared Constants
// ============================================

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
} as const;

export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "AI & Machine Learning",
  "Cybersecurity",
  "Cloud & DevOps",
  "UI/UX Design",
  "E-Commerce",
  "SaaS",
  "Other",
] as const;

export const SERVICE_ICONS = [
  "Code", "Globe", "Smartphone", "Brain", "Shield", "Cloud",
  "Database", "Palette", "Zap", "Lock", "BarChart", "Settings",
] as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const JWT_CONFIG = {
  ACCESS_EXPIRY: "15m",
  REFRESH_EXPIRY: "7d",
} as const;

export const RATE_LIMITS = {
  LOGIN: { windowMs: 15 * 60 * 1000, max: 5 },        // 5 per 15 min
  REGISTER: { windowMs: 60 * 60 * 1000, max: 3 },     // 3 per hour
  API_DEFAULT: { windowMs: 60 * 1000, max: 100 },      // 100 per min
  API_AUTHENTICATED: { windowMs: 60 * 1000, max: 1000 }, // 1000 per min
} as const;

export const MEDIA_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"],
  ALLOWED_FILE_TYPES: ["application/pdf", "application/zip"],
  THUMBNAIL_SIZES: {
    small: { width: 150, height: 150 },
    medium: { width: 400, height: 300 },
    large: { width: 800, height: 600 },
  },
} as const;
