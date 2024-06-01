import { z } from 'zod';
// zod schema for validating user email
export const emailSchema = z.string().email("Please provide a valid email address.");
// password schema
export const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
// zod schema for validating login credentials
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(32)
});
