import { z } from 'zod'

// User validation schemas
export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  userType: z.enum(['trainer', 'student']),
  phone: z.string().optional(),
  age: z.number().min(13).max(120).optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  goal: z.string().optional(),
  experience: z.enum(['Iniciante', 'Intermediário', 'Avançado']).optional(),
  restrictions: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  userType: z.enum(['trainer', 'student'])
})

// Exercise validation schemas
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Exercise name is required').max(100, 'Name too long'),
  sets: z.number().min(1, 'At least 1 set required').max(20, 'Too many sets'),
  reps: z.string().min(1, 'Reps are required'),
  weight: z.string().optional(),
  rest: z.string().optional(),
  notes: z.string().max(500, 'Notes too long').optional()
})

// Training plan validation schemas
export const trainingPlanSchema = z.object({
  name: z.string().min(1, 'Plan name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  duration: z.string().min(1, 'Duration is required'),
  difficulty: z.enum(['Iniciante', 'Intermediário', 'Avançado']),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise required'),
  studentId: z.number().positive('Valid student ID required')
})

// Message validation schemas
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  recipientId: z.number().positive('Valid recipient required')
})

// Validation helper functions
export const validateAndSanitize = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}

// Form validation hook
export const useFormValidation = <T>(schema: z.ZodSchema<T>) => {
  const validate = (data: unknown) => {
    return validateAndSanitize(schema, data)
  }

  return { validate }
}