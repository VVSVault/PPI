'use client'

import { Package, ShoppingCart, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'
import { PRICING } from '../types'

export function BrochureBoxStep({ formData, updateFormData, inventory }: StepProps) {
  const hasStoredBrochureBox = inventory?.brochureBoxes && inventory.brochureBoxes.quantity > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Brochure Box</h2>
        <p className="text-gray-600">Optional - Add a brochure box to your installation.</p>
      </div>

      <div className="space-y-3">
        {/* Use stored brochure box */}
        {hasStoredBrochureBox && (
          <button
            type="button"
            onClick={() => updateFormData({ brochure_option: 'stored' })}
            className={cn(
              'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
              formData.brochure_option === 'stored'
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              formData.brochure_option === 'stored' ? 'bg-pink-500' : 'bg-gray-100'
            )}>
              <Package className={cn(
                'w-5 h-5',
                formData.brochure_option === 'stored' ? 'text-white' : 'text-gray-400'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Use my brochure box from storage</h3>
              <p className="text-sm text-gray-600">
                You have {inventory.brochureBoxes!.quantity} brochure box(es) in storage
              </p>
              <p className="text-sm font-medium text-pink-600 mt-1">
                Install fee: ${PRICING.brochure_box_install.toFixed(2)}
              </p>
            </div>
          </button>
        )}

        {/* New brochure box */}
        <button
          type="button"
          onClick={() => updateFormData({ brochure_option: 'new' })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.brochure_option === 'new'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.brochure_option === 'new' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <ShoppingCart className={cn(
              'w-5 h-5',
              formData.brochure_option === 'new' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">New brochure box</h3>
            <p className="text-sm text-gray-600">Purchase a new brochure box with installation</p>
            <p className="text-sm font-medium text-pink-600 mt-1">
              ${PRICING.brochure_box_new.toFixed(2)}
            </p>
          </div>
        </button>

        {/* No brochure box */}
        <button
          type="button"
          onClick={() => updateFormData({ brochure_option: 'none' })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.brochure_option === 'none'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.brochure_option === 'none' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <X className={cn(
              'w-5 h-5',
              formData.brochure_option === 'none' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">No brochure box needed</h3>
            <p className="text-sm text-gray-600">Skip brochure box for this installation</p>
          </div>
        </button>
      </div>
    </div>
  )
}
