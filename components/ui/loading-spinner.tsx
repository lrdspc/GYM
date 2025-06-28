import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className,
      )}
    />
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-xl h-32 w-full mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 rounded h-4 w-3/4"></div>
        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      </div>
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-top safe-area-bottom">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-500">Carregando...</p>
      </div>
    </div>
  )
}
