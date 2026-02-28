// ============================================
// Shared Types for ASAGUS Admin Panel
// ============================================

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Content Types
export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription?: string;
  category: string;
  clientName?: string;
  industry?: string;
  technologies: string[];
  heroImage?: string;
  galleryImages: string[];
  challenge?: string;
  solution?: string;
  projectUrl?: string;
  githubUrl?: string;
  year?: string;
  duration?: string;
  teamSize?: string;
  featured: boolean;
  published: boolean;
  viewCount: number;
  orderIndex: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  metrics?: { metric: string; value: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  icon?: string;
  features: string[];
  process?: Record<string, unknown>[];
  deliverables: string[];
  pricing?: { type: string; from: number; to: number };
  isActive: boolean;
  featured: boolean;
  orderIndex: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialDTO {
  id: string;
  clientName: string;
  clientRole?: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  featured: boolean;
  isActive: boolean;
  approved: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQDTO {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive: boolean;
  viewCount: number;
  helpful: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSubmissionDTO {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  company?: string;
  isRead: boolean;
  isReplied: boolean;
  repliedAt?: string;
  reply?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalContacts: number;
  unreadContacts: number;
  totalSubscribers: number;
  totalPageViews: number;
  recentContacts: ContactSubmissionDTO[];
  recentProjects: ProjectDTO[];
}

// User roles enum
export type UserRole = "super_admin" | "admin" | "editor" | "viewer";

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ProjectFilters extends PaginationParams {
  category?: string;
  featured?: boolean;
  published?: boolean;
}

export interface ServiceFilters extends PaginationParams {
  isActive?: boolean;
  featured?: boolean;
}
