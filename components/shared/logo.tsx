'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
}

const Logo = ({ variant = 'dark', size = 'md', className, href }: LogoProps) => {
  const pathname = usePathname()

  // If on dashboard or admin pages, link to dashboard; otherwise link to home
  const isInApp = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')
  const linkHref = href ?? (isInApp ? '/dashboard' : '/')

  const imageSizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 56, height: 56 },
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const colors = {
    light: 'text-white',
    dark: 'text-gray-900',
  }

  return (
    <Link href={linkHref} className={cn('flex items-center gap-2', className)}>
      {/* Logo Image */}
      <Image
        src="/images/logo.svg"
        alt="Pink Posts Installations"
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className="object-contain"
      />

      {/* Logo Text */}
      <div className={cn('font-semibold', textSizes[size], colors[variant])}>
        <span>Pink</span>
        <span className="text-pink-500">Posts</span>
      </div>
    </Link>
  )
}

export { Logo }
