import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  firstNameAr: z.string().min(1).max(100).optional(),
  lastNameAr: z.string().min(1).max(100).optional(),
  phone: z.string().min(8).max(20).optional(),
  preferredLocale: z.enum(['ar', 'en']).default('ar'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof LoginSchema>;
