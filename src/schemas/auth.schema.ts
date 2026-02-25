import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email('Must be a valid email address')
  .max(254);

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const phoneField = z
  .string()
  .trim()
  .regex(/^\+61[2-9]\d{8}$/, 'Phone must be in Australian E.164 format: +61XXXXXXXXX')
  .optional();

const fullNameField = z
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(100)
  .regex(/^[a-zA-Z\s'\-\.]+$/, 'Full name contains invalid characters');

export const RegisterSchema = z.object({
  email: emailField,
  password: passwordField,
  full_name: fullNameField,
  role: z.enum(['customer', 'provider']),
  phone: phoneField,
  business_name: z.string().trim().min(2).max(200).optional(),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms of Service' }),
  }),
  privacy_accepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Privacy Policy' }),
  }),
  marketing_consent: z.boolean().default(false),
  referral_code: z.string().trim().toUpperCase().max(20).optional(),
});

export const LoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required').max(128),
});

export const ForgotPasswordSchema = z.object({
  email: emailField,
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  new_password: passwordField,
});

export const VerifyPhoneOTPSchema = z.object({
  phone: z.string().regex(/^\+61[2-9]\d{8}$/),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyPhoneOTPInput = z.infer<typeof VerifyPhoneOTPSchema>;
