'use client'

import { useState } from 'react'
import { Mountain, X, Check } from 'lucide-react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { RiderSource } from '../types'

interface AcresInputProps {
  isSelected: boolean
  value: number | null
  onChange: (value: number | null) => void
  price: number
  source: RiderSource
}

export function AcresInput({
  isSelected,
  value,
  onChange,
  price,
}: AcresInputProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || '')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    if (val === '') {
      onChange(null)
    } else {
      const num = parseFloat(val)
      if (!isNaN(num) && num > 0) {
        onChange(num)
      }
    }
  }

  const handleRemove = () => {
    setInputValue('')
    onChange(null)
  }

  return (
    <div className={cn(
      'border-2 rounded-lg p-4 transition-all',
      isSelected ? 'border-pink-500 bg-pink-50' : 'border-dashed border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            isSelected ? 'bg-pink-100' : 'bg-gray-100'
          )}>
            <Mountain className={cn(
              'w-5 h-5',
              isSelected ? 'text-pink-600' : 'text-gray-500'
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900">Custom Acres</h4>
              {isSelected && (
                <Check className="w-4 h-4 text-pink-500" />
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              Add a custom acres rider to your sign
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                step="0.1"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter acres"
                className="flex-1 max-w-[150px]"
              />
              <span className="text-sm text-gray-500">Acres</span>
            </div>
            {isSelected && value && (
              <p className="text-sm text-pink-600 mt-2">
                Your rider will display: &quot;{value} Acres&quot;
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn(
            'text-sm font-medium',
            isSelected ? 'text-pink-600' : 'text-gray-500'
          )}>
            ${price.toFixed(0)}
          </span>
          {isSelected && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
