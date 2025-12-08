'use client'

import { Fragment, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: 'default' | 'fullscreen' | 'side-panel'
  className?: string
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  className,
}: ModalProps) => {
  if (!isOpen) return null

  const variants = {
    default: 'max-w-lg w-full mx-4',
    fullscreen: 'w-full h-full',
    'side-panel': 'max-w-md w-full h-full ml-auto',
  }

  const containerVariants = {
    default: 'items-center justify-center',
    fullscreen: 'items-stretch',
    'side-panel': 'items-stretch justify-end',
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'fixed inset-0 z-50 flex p-4',
          containerVariants[variant]
        )}
      >
        {/* Modal Content */}
        <div
          className={cn(
            'bg-white rounded-lg shadow-xl overflow-hidden animate-scale-in',
            variants[variant],
            variant === 'side-panel' && 'rounded-l-lg rounded-r-none animate-slide-up',
            className
          )}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className={cn('px-6 py-4', !title && 'pt-6')}>
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export { Modal }
