'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RiderOption, RiderSource } from '../types'

interface RiderChipProps {
  rider: RiderOption
  isSelected: boolean
  isDisabled: boolean
  price: number
  source: RiderSource
  onClick: () => void
  disabledReason?: string
}

export function RiderChip({
  rider,
  isSelected,
  isDisabled,
  price,
  onClick,
  disabledReason,
}: RiderChipProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`${rider.name} rider, $${price}, ${isSelected ? 'selected' : 'not selected'}`}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left w-full',
        isSelected && 'border-pink-500 bg-pink-50',
        !isSelected && !isDisabled && 'border-gray-200 hover:border-gray-300 bg-white',
        isDisabled && 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {isSelected && (
          <Check className="w-4 h-4 text-pink-500 flex-shrink-0" />
        )}
        <span className={cn(
          'text-sm font-medium truncate',
          isSelected ? 'text-pink-700' : 'text-gray-900',
          isDisabled && 'text-gray-400'
        )}>
          {rider.name}
        </span>
      </div>
      <span className={cn(
        'text-xs font-medium flex-shrink-0 ml-2',
        isSelected ? 'text-pink-600' : 'text-gray-500',
        isDisabled && 'text-gray-400'
      )}>
        {isDisabled ? disabledReason || 'N/A' : `$${price.toFixed(0)}`}
      </span>
    </button>
  )
}
