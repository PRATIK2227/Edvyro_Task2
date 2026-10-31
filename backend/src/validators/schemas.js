import { z } from 'zod';
const email = z.string().trim().email().max(180);
export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    email,
    password: z.string().min(8).max(72),
    role: z.enum(['student', 'recruiter']).default('student'),
    headline: z.string().trim().max(160).optional(),
  }).strict(),
});
export const loginSchema = z.object({ body: z.object({ email, password: z.string().min(1).max(72) }).strict() });
export const createInternshipSchema = z.object({
  body: z.object({
    title: z.string().trim().min(4).max(160),
    company: z.string().trim().min(2).max(120),
    category: z.string().trim().min(2).max(80),
    location: z.string().trim().min(2).max(120),
    workMode: z.enum(['remote', 'hybrid', 'onsite']),
    type: z.enum(['internship', 'full-time', 'part-time', 'contract']).default('internship'),
    description: z.string().trim().min(30).max(6000),
    requirements: z.array(z.string().trim().min(2).max(200)).max(25).default([]),
    stipend: z.coerce.number().min(0).max(10000000).default(0),
    currency: z.string().length(3).default('INR'),
    duration: z.string().trim().max(80).default('Not specified'),
    applicationUrl: z.string().url().max(500).optional().or(z.literal('')),
    deadline: z.string().date().nullable().optional(),
    status: z.enum(['open', 'closed', 'draft']).default('open'),
  }).strict(),
});
export const updateInternshipSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createInternshipSchema.shape.body.partial().refine((v) => Object.keys(v).length > 0, 'Provide at least one field'),
});
export const idSchema = z.object({ params: z.object({ id: z.string().uuid() }) });
export const listSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    search: z.string().trim().max(120).optional(),
    category: z.string().trim().max(80).optional(),
    location: z.string().trim().max(120).optional(),
    workMode: z.enum(['remote', 'hybrid', 'onsite']).optional(),
    type: z.enum(['internship', 'full-time', 'part-time', 'contract']).optional(),
    sort: z.enum(['newest', 'stipend']).default('newest'),
  }),
});
export const applySchema = z.object({ params: z.object({ id: z.string().uuid() }), body: z.object({ coverLetter: z.string().trim().max(2500).optional() }).default({}) });
export const statusSchema = z.object({ params: z.object({ id: z.string().uuid() }), body: z.object({ status: z.enum(['reviewing', 'shortlisted', 'rejected', 'accepted']) }) });
