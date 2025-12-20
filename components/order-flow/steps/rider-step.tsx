'use client'

import { useState } from 'react'
import { Plus, Minus, X, Info } from 'lucide-react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { StepProps, RiderSelection } from '../types'
import { PRICING } from '../types'

const riderOptions = [
  { name: 'Sold', slug: 'sold' },
  { name: 'Pending', slug: 'pending' },
  { name: 'Coming Soon', slug: 'coming-soon' },
  { name: 'For Sale', slug: 'for-sale' },
  { name: 'Back on the Market', slug: 'back-on-market' },
  { name: 'By Appointment Only', slug: 'by-appointment' },
  { name: 'For Lease', slug: 'for-lease' },
  { name: 'For Rent', slug: 'for-rent' },
  { name: 'Home Warranty', slug: 'home-warranty' },
  { name: 'Horse Property', slug: 'horse-property' },
  { name: 'Pool', slug: 'pool' },
  { name: 'Basement', slug: 'basement' },
  { name: 'No HOA', slug: 'no-hoa' },
  { name: 'Lake Front', slug: 'lake-front' },
  { name: 'Large Lot', slug: 'large-lot' },
  { name: 'RV Parking', slug: 'rv-parking' },
  { name: '3 Beds', slug: '3-beds' },
  { name: '4 Beds', slug: '4-beds' },
  { name: '5 Beds', slug: '5-beds' },
  { name: '6 Beds', slug: '6-beds' },
  { name: '___ Acres', slug: 'custom-acres', requiresInput: true },
]

export function RiderStep({ formData, updateFormData, inventory }: StepProps) {
  const [acresValue, setAcresValue] = useState('')
  const hasStoredRiders = inventory?.riders && inventory.riders.length > 0

  const toggleRider = (slug: string, isRental: boolean, customValue?: string) => {
    const existing = formData.riders.find(
      (r) => r.rider_type === slug && r.is_rental === isRental
    )

    if (existing) {
      // Remove
      updateFormData({
        riders: formData.riders.filter(
          (r) => !(r.rider_type === slug && r.is_rental === isRental)
        ),
      })
    } else {
      // Add
      const newRider: RiderSelection = {
        rider_type: slug,
        is_rental: isRental,
        quantity: 1,
        custom_value: customValue,
      }
      updateFormData({
        riders: [...formData.riders, newRider],
      })
    }
  }

  const isSelected = (slug: string, isRental: boolean) => {
    return formData.riders.some(
      (r) => r.rider_type === slug && r.is_rental === isRental
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Riders</h2>
        <p className="text-gray-600">Optional - Select any riders you'd like to add to your installation.</p>
      </div>

      {/* Pricing Info */}
      <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
        <Info className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-gray-900">Rider Pricing</p>
          <p className="text-gray-600">
            Install your own riders for <span className="font-semibold">${PRICING.rider_install}</span> each,
            or rent one of our riders for <span className="font-semibold">${PRICING.rider_rental}</span>!
          </p>
        </div>
      </div>

      {/* Customer's stored riders */}
      {hasStoredRiders && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Your Riders in Storage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {inventory.riders.map((rider) => (
              <button
                key={rider.id}
                type="button"
                onClick={() => toggleRider(rider.rider_type, false)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  isSelected(rider.rider_type, false)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="text-left">
                  <span className="text-sm font-medium text-gray-900">{rider.rider_type}</span>
                  <span className="text-xs text-gray-500 block">Qty: {rider.quantity}</span>
                </div>
                <span className="text-xs font-medium text-pink-600">${PRICING.rider_install}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rental Riders */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Rent a Rider</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {riderOptions.filter(r => !r.requiresInput).map((rider) => (
            <button
              key={rider.slug}
              type="button"
              onClick={() => toggleRider(rider.slug, true)}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                isSelected(rider.slug, true)
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <span className="text-sm font-medium text-gray-900">{rider.name}</span>
              <span className="text-xs font-medium text-pink-600">${PRICING.rider_rental}</span>
            </button>
          ))}
        </div>

        {/* Custom Acres Input */}
        <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Input
              label="Custom Acres Rider"
              value={acresValue}
              onChange={(e) => setAcresValue(e.target.value)}
              placeholder="Number of acres"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (acresValue) {
                  toggleRider('custom-acres', true, acresValue)
                  setAcresValue('')
                }
              }}
              disabled={!acresValue}
              className="mt-6 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Riders Summary */}
      {formData.riders.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Selected Riders</h4>
          <div className="space-y-2">
            {formData.riders.map((rider, index) => (
              <div
                key={`${rider.rider_type}-${rider.is_rental}-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">
                    {riderOptions.find(r => r.slug === rider.rider_type)?.name || rider.rider_type}
                    {rider.custom_value && ` (${rider.custom_value} Acres)`}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    rider.is_rental ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'
                  )}>
                    {rider.is_rental ? 'Rental' : 'Your Own'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    ${rider.is_rental ? PRICING.rider_rental : PRICING.rider_install}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRider(rider.rider_type, rider.is_rental)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
