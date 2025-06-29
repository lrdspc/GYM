import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
  lines?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  variant = 'text',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4',
              className
            )}
            style={index === 0 ? style : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        variant === 'text' && 'h-4',
        variant === 'rectangular' && !height && 'h-20',
        variant === 'circular' && !width && !height && 'h-10 w-10',
        className
      )}
      style={style}
    />
  )
}

interface CardSkeletonProps {
  showAvatar?: boolean
  lines?: number
  className?: string
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  showAvatar = false, 
  lines = 3,
  className 
}) => {
  return (
    <div className={cn('p-4 border rounded-lg space-y-3', className)}>
      <div className="flex items-center space-x-3">
        {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
      <Skeleton variant="text" lines={lines} />
    </div>
  )
}

interface LoadingPageProps {
  message?: string
  showSpinner?: boolean
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = 'Carregando...',
  showSpinner = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-top safe-area-bottom">
      <div className="text-center space-y-4">
        {showSpinner && <LoadingSpinner size="xl" />}
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Carregando...',
  className 
}) => {
  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 bg-black/50 flex items-center justify-center z-50',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="lg" />
          <span className="text-gray-700 font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}

// Loading button component
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  loadingText = 'Carregando...',
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      {isLoading ? loadingText : children}
    </button>
  )
}