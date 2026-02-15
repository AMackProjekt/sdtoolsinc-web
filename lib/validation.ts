import { z } from 'zod'

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(3, 'Email must be at least 3 characters')
  .max(255, 'Email must be less than 255 characters')

/**
 * Password validation schema
 * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')

/**
 * Login form validation
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Signup form validation
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignupInput = z.infer<typeof signupSchema>

/**
 * Email verification code validation
 */
export const verificationCodeSchema = z
  .string()
  .length(6, 'Verification code must be 6 digits')
  .regex(/^\d+$/, 'Verification code must be numeric')

/**
 * Password reset validation
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
})

export type PasswordResetInput = z.infer<typeof passwordResetSchema>

/**
 * New password validation (for reset flow)
 */
export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type NewPasswordInput = z.infer<typeof newPasswordSchema>

/**
 * Profile update validation
 */
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  avatarUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

/**
 * Form submission validation utility
 */
export async function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: boolean; data?: T; errors?: Record<string, string> }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { form: 'Unknown validation error' } }
  }
}
