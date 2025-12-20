'use client'

import { Lock, Key, ShoppingCart, X } from 'lucide-react'
import { Input, Select } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'
import { PRICING } from '../types'

export function LockboxStep({ formData, updateFormData, inventory }: StepProps) {
  const hasSentrilock = inventory?.lockboxes?.some((l) => l.lockbox_type === 'sentrilock')
  const hasMechanical = inventory?.lockboxes?.some((l) => l.lockbox_type === 'mechanical')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lockbox Selection</h2>
        <p className="text-gray-600">Optional - Add a lockbox to your installation.</p>
      </div>

      <div className="space-y-3">
        {/* My SentriLock */}
        <button
          type="button"
          onClick={() => updateFormData({
            lockbox_option: 'sentrilock',
            lockbox_type: 'sentrilock',
            lockbox_code: ''
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.lockbox_option === 'sentrilock'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.lockbox_option === 'sentrilock' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <Lock className={cn(
              'w-5 h-5',
              formData.lockbox_option === 'sentrilock' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">My SentriLock</h3>
            <p className="text-sm text-gray-600">We'll install your SentriLock lockbox</p>
            <p className="text-sm font-medium text-pink-600 mt-1">Install fee: ${PRICING.lockbox_install.toFixed(2)}</p>
          </div>
        </button>

        {/* My Mechanical */}
        <button
          type="button"
          onClick={() => updateFormData({
            lockbox_option: 'mechanical_own',
            lockbox_type: 'mechanical',
            lockbox_code: ''
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.lockbox_option === 'mechanical_own'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.lockbox_option === 'mechanical_own' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <Key className={cn(
              'w-5 h-5',
              formData.lockbox_option === 'mechanical_own' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">My Mechanical Lockbox</h3>
            <p className="text-sm text-gray-600">We'll install your mechanical lockbox</p>
            <p className="text-sm font-medium text-pink-600 mt-1">Install fee: ${PRICING.lockbox_install.toFixed(2)}</p>
          </div>
        </button>

        {formData.lockbox_option === 'mechanical_own' && (
          <div className="ml-14 p-4 bg-gray-50 rounded-lg">
            <Input
              label="Lockbox Code (optional)"
              value={formData.lockbox_code || ''}
              onChange={(e) => updateFormData({ lockbox_code: e.target.value })}
              placeholder="e.g., 1234"
              helperText="Enter the code for your lockbox"
            />
          </div>
        )}

        {/* Rent Mechanical */}
        <button
          type="button"
          onClick={() => updateFormData({
            lockbox_option: 'mechanical_rent',
            lockbox_type: 'mechanical',
            lockbox_code: ''
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.lockbox_option === 'mechanical_rent'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.lockbox_option === 'mechanical_rent' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <ShoppingCart className={cn(
              'w-5 h-5',
              formData.lockbox_option === 'mechanical_rent' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Rent Mechanical Lockbox</h3>
            <p className="text-sm text-gray-600">We'll provide a mechanical lockbox for your listing</p>
            <p className="text-sm font-medium text-pink-600 mt-1">Rental fee: ${PRICING.lockbox_rental.toFixed(2)}</p>
          </div>
        </button>

        {/* No lockbox */}
        <button
          type="button"
          onClick={() => updateFormData({
            lockbox_option: 'none',
            lockbox_type: undefined,
            lockbox_code: ''
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.lockbox_option === 'none'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.lockbox_option === 'none' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <X className={cn(
              'w-5 h-5',
              formData.lockbox_option === 'none' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">No lockbox needed</h3>
            <p className="text-sm text-gray-600">Skip lockbox for this installation</p>
          </div>
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p><strong>Note:</strong> SentriLock lockboxes are agent-owned only. Mechanical lockboxes can be rented for ${PRICING.lockbox_rental} per order or we'll install your own for ${PRICING.lockbox_install}.</p>
      </div>
    </div>
  )
}
