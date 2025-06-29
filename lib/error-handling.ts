// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT', 429)
    this.name = 'RateLimitError'
  }
}

// Error handler utility
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR')
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR')
}

// Error logging utility
export const logError = (error: AppError, context?: Record<string, any>) => {
  const errorLog = {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  }

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    console.error('Production Error:', errorLog)
  } else {
    console.error('Development Error:', errorLog)
  }
}

// React error boundary hook
export const useErrorHandler = () => {
  const handleError = (error: unknown, errorInfo?: any) => {
    const appError = handleError(error)
    logError(appError, errorInfo)
    
    // Show user-friendly error message
    return {
      message: appError.isOperational ? appError.message : 'Something went wrong. Please try again.',
      code: appError.code
    }
  }

  return { handleError }
}

// Async error wrapper
export const asyncErrorHandler = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = handleError(error)
      logError(appError)
      throw appError
    }
  }
}

// Error boundary component
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>
) => {
  return (props: P) => {
    const [error, setError] = React.useState<AppError | null>(null)

    const retry = () => setError(null)

    React.useEffect(() => {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const appError = handleError(event.reason)
        setError(appError)
        logError(appError)
      }

      window.addEventListener('unhandledrejection', handleUnhandledRejection)
      return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }, [])

    if (error) {
      if (fallback) {
        const FallbackComponent = fallback
        return <FallbackComponent error={error} retry={retry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={retry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}