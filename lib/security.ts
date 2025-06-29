import { z } from 'zod'

// Input validation schemas
export const emailSchema = z.string().email('Invalid email format')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long')

// Sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .slice(0, 1000) // Limit length
}

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim()
}

// Rate limiting (client-side simulation)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs)
    
    if (validAttempts.length >= maxAttempts) {
      return false
    }
    
    validAttempts.push(now)
    this.attempts.set(key, validAttempts)
    return true
  }
  
  reset(key: string): void {
    this.attempts.delete(key)
  }
}

export const rateLimiter = new RateLimiter()

// CSRF token simulation
export const generateCSRFToken = (): string => {
  return crypto.randomUUID()
}

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length > 0
}

// Password hashing simulation (in real app, use bcrypt on server)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Session management
export interface Session {
  userId: string
  userType: 'trainer' | 'student'
  expiresAt: number
  csrfToken: string
}

export const createSession = (userId: string, userType: 'trainer' | 'student'): Session => {
  return {
    userId,
    userType,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    csrfToken: generateCSRFToken()
  }
}

export const isSessionValid = (session: Session): boolean => {
  return session.expiresAt > Date.now()
}