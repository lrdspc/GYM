'use client'

import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { userLoginSchema, userRegistrationSchema } from '@/lib/validation'
import { sanitizeEmail, sanitizeInput, rateLimiter, createSession, isSessionValid, type Session } from '@/lib/security'
import { AuthenticationError, ValidationError, RateLimitError } from '@/lib/error-handling'

interface User {
  id: string
  name: string
  email: string
  userType: 'trainer' | 'student'
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string, userType: 'trainer' | 'student') => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedSession = localStorage.getItem('fittrainer_session')
        const storedUser = localStorage.getItem('fittrainer_user')
        
        if (storedSession && storedUser) {
          const parsedSession: Session = JSON.parse(storedSession)
          const parsedUser: User = JSON.parse(storedUser)
          
          if (isSessionValid(parsedSession)) {
            setSession(parsedSession)
            setUser(parsedUser)
          } else {
            // Session expired, clear storage
            localStorage.removeItem('fittrainer_session')
            localStorage.removeItem('fittrainer_user')
          }
        }
      } catch (error) {
        console.error('Failed to load session:', error)
        localStorage.removeItem('fittrainer_session')
        localStorage.removeItem('fittrainer_user')
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [])

  const login = useCallback(async (email: string, password: string, userType: 'trainer' | 'student') => {
    setIsLoading(true)
    
    try {
      // Rate limiting
      const clientId = `${sanitizeEmail(email)}_${userType}`
      if (!rateLimiter.isAllowed(clientId, 5, 15 * 60 * 1000)) {
        throw new RateLimitError('Too many login attempts. Please try again later.')
      }

      // Validate input
      const validation = userLoginSchema.safeParse({
        email: sanitizeEmail(email),
        password: sanitizeInput(password),
        userType
      })

      if (!validation.success) {
        throw new ValidationError('Invalid login credentials')
      }

      // Simulate API call with mock authentication
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data (in real app, this would come from server)
      const mockUser: User = {
        id: userType === 'trainer' ? '1' : '2',
        name: userType === 'trainer' ? 'João Silva' : 'Ana Santos',
        email: validation.data.email,
        userType: validation.data.userType
      }

      // Create session
      const newSession = createSession(mockUser.id, mockUser.userType)

      // Store in localStorage (in real app, use httpOnly cookies)
      localStorage.setItem('fittrainer_session', JSON.stringify(newSession))
      localStorage.setItem('fittrainer_user', JSON.stringify(mockUser))

      setUser(mockUser)
      setSession(newSession)

      // Reset rate limiter on successful login
      rateLimiter.reset(clientId)

      // Redirect based on user type
      router.push(userType === 'trainer' ? '/trainer/dashboard' : '/student/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new AuthenticationError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const register = useCallback(async (userData: any) => {
    setIsLoading(true)
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...userData,
        name: sanitizeInput(userData.name),
        email: sanitizeEmail(userData.email),
        password: sanitizeInput(userData.password),
        confirmPassword: sanitizeInput(userData.confirmPassword)
      }

      // Validate input
      const validation = userRegistrationSchema.safeParse(sanitizedData)

      if (!validation.success) {
        const errors = validation.error.errors.map(err => err.message).join(', ')
        throw new ValidationError(errors)
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Auto-login after registration
      await login(validation.data.email, validation.data.password, validation.data.userType)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new AuthenticationError('Registration failed')
    } finally {
      setIsLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('fittrainer_session')
    localStorage.removeItem('fittrainer_user')
    router.push('/')
  }, [router])

  const isAuthenticated = Boolean(user && session && isSessionValid(session))

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Protected route HOC
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredUserType?: 'trainer' | 'student'
) => {
  return (props: P) => {
    const { user, isLoading, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/')
          return
        }

        if (requiredUserType && user?.userType !== requiredUserType) {
          router.push(user?.userType === 'trainer' ? '/trainer/dashboard' : '/student/dashboard')
          return
        }
      }
    }, [isLoading, isAuthenticated, user, router])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    if (requiredUserType && user?.userType !== requiredUserType) {
      return null
    }

    return <Component {...props} />
  }
}