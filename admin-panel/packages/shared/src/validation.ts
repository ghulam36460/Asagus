import { z } from "zod";

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

// Project Validation
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  fullDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  clientName: z.string().optional(),
  industry: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  galleryImages: z.array(z.string()).default([]),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  projectUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  year: z.string().optional(),
  duration: z.string().optional(),
  teamSize: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
});

// Service Validation
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  features: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// Testimonial Validation
export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientRole: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.number().min(1).max(5).default(5),
  avatarUrl: z.string().optional(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

// FAQ Validation
export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Contact Reply Validation
export const contactReplySchema = z.object({
  reply: z.string().min(1, "Reply is required"),
});

// Settings Validation
export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
  group: z.string().default("general"),
  label: z.string().optional(),
  type: z.enum(["string", "number", "boolean", "json", "image"]).default("string"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
