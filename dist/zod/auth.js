import * as zod from 'zod';
// zod schema for validating user email
export const emailSchema = zod.string().email("Please provide a valid email address.").trim();
// password schema
export const passwordSchema = zod.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
// zod schema for validating login credentials
export const registerUserSchema = zod.object({
    email: zod.string({ message: "Email is required" }).email('Invalid email format').trim(),
    password: passwordSchema,
    confirm_password: passwordSchema
}).refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password']
});
