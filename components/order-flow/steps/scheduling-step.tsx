'use client'

import { Zap, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'
import { PRICING } from '../types'

export function SchedulingStep({ formData, updateFormData }: StepProps) {
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Installation</h2>
        <p className="text-gray-600">When do you need this installed?</p>
      </div>

      <div className="space-y-3">
        {/* Next Available */}
        <button
          type="button"
          onClick={() => updateFormData({
            schedule_type: 'next_available',
            requested_date: undefined
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.schedule_type === 'next_available'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.schedule_type === 'next_available' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <Clock className={cn(
              'w-5 h-5',
              formData.schedule_type === 'next_available' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Next available day</h3>
            <p className="text-sm text-gray-600">
              Orders placed before 4pm are installed next day!
            </p>
            <p className="text-sm text-green-600 font-medium mt-1">
              No additional fee
            </p>
          </div>
        </button>

        {/* Specific Date */}
        <button
          type="button"
          onClick={() => updateFormData({
            schedule_type: 'specific_date',
            requested_date: minDateStr
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.schedule_type === 'specific_date'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.schedule_type === 'specific_date' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <Calendar className={cn(
              'w-5 h-5',
              formData.schedule_type === 'specific_date' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Specific date</h3>
            <p className="text-sm text-gray-600">
              Schedule installation for a particular day
            </p>
            <p className="text-sm text-green-600 font-medium mt-1">
              No additional fee
            </p>
          </div>
        </button>

        {formData.schedule_type === 'specific_date' && (
          <div className="ml-14 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              min={minDateStr}
              value={formData.requested_date || ''}
              onChange={(e) => updateFormData({ requested_date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
          </div>
        )}

        {/* Expedited */}
        <button
          type="button"
          onClick={() => updateFormData({
            schedule_type: 'expedited',
            requested_date: undefined
          })}
          className={cn(
            'w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left',
            formData.schedule_type === 'expedited'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-gray-300'
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
            formData.schedule_type === 'expedited' ? 'bg-pink-500' : 'bg-gray-100'
          )}>
            <Zap className={cn(
              'w-5 h-5',
              formData.schedule_type === 'expedited' ? 'text-white' : 'text-gray-400'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Same day (expedited)</h3>
            <p className="text-sm text-gray-600">
              Rush installation today, subject to availability
            </p>
            <p className="text-sm font-medium text-pink-600 mt-1">
              + ${PRICING.expedite_fee.toFixed(2)} expedite fee
            </p>
          </div>
        </button>
      </div>

      {formData.schedule_type === 'expedited' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Note:</strong> Same day installations are subject to availability and our current schedule.
          We'll contact you to confirm if same day service is possible.
        </div>
      )}
    </div>
  )
}
