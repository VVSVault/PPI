import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Loading = ({ size = 'md', className }: LoadingProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-200 border-t-pink-500',
          sizes[size]
        )}
      />
    </div>
  )
}

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
    />
  )
}

export { Loading, LoadingPage, LoadingSkeleton }
