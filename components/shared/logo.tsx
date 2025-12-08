import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Logo = ({ variant = 'dark', size = 'md', className }: LogoProps) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const colors = {
    light: 'text-white',
    dark: 'text-gray-900',
  }

  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {/* Logo Mark */}
      <div className={cn(
        'flex items-center justify-center rounded-lg bg-pink-500',
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-10 h-10',
        size === 'lg' && 'w-12 h-12'
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            'text-white',
            size === 'sm' && 'w-5 h-5',
            size === 'md' && 'w-6 h-6',
            size === 'lg' && 'w-7 h-7'
          )}
        >
          <path
            d="M12 3L14 7H10L12 3Z"
            fill="currentColor"
          />
          <rect
            x="11"
            y="7"
            width="2"
            height="14"
            fill="currentColor"
          />
          <rect
            x="8"
            y="8"
            width="8"
            height="6"
            rx="1"
            fill="currentColor"
            fillOpacity="0.8"
          />
        </svg>
      </div>

      {/* Logo Text */}
      <div className={cn('font-semibold', sizes[size], colors[variant])}>
        <span>Pink</span>
        <span className="text-pink-500">Post</span>
      </div>
    </Link>
  )
}

export { Logo }
