import { z } from 'zod';
import { validateImageUrl } from './imageValidation.js';
export const loginSchema = z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
export const skillSchema = z.object({
    skillName: z.string().trim().min(1, 'Skill name is required'),
    focus: z.enum(['Software', 'Hardware', 'Data', 'AI', 'Web']),
    img: z
        .string()
        .default('')
        .refine(validateImageUrl, 'Image must be a data URL (≤400KB), /lib/ path, or https URL'),
    descrip: z.string().trim().min(1, 'Description is required'),
});
export const experienceSchema = z.object({
    type: z.enum(['Education', 'Work']),
    company: z.string().trim().min(1, 'Company/Institution is required'),
    subDescrip: z.string().default(''),
    date: z.string().trim().min(1, 'Date is required'),
    descrip: z.string().trim().min(1, 'Description is required'),
});
export const projectSchema = z.object({
    name: z.string().trim().min(1, 'Project name is required'),
    img: z
        .string()
        .default('')
        .refine(validateImageUrl, 'Image must be a data URL (≤400KB), /lib/ path, or https URL'),
    role: z.string().trim().min(1, 'Role is required'),
    date: z.string().trim().min(1, 'Date is required'),
    techStack: z.string().trim().min(1, 'Tech stack is required'),
    description: z.string().trim().min(1, 'Description is required'),
});
