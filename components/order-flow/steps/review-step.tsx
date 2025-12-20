'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { StepProps } from '../types'
import { PRICING } from '../types'

const postNames: Record<string, string> = {
  'white-vinyl': 'White Vinyl Post',
  'black-vinyl': 'Black Vinyl Post',
  'pink-vinyl': 'Signature Pink Vinyl Post',
}

export function ReviewStep({
  formData,
  updateFormData,
  inventory,
  paymentMethods,
  isSubmitting,
  setIsSubmitting,
}: StepProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Calculate order items and totals
  const orderItems: Array<{ description: string; price: number }> = []

  // Post
  if (formData.post_type) {
    orderItems.push({
      description: `${postNames[formData.post_type]} (install & pickup)`,
      price: PRICING.posts[formData.post_type],
    })
  }

  // Sign
  if (formData.sign_option === 'stored' || formData.sign_option === 'at_property') {
    orderItems.push({
      description: 'Sign Install',
      price: PRICING.sign_install,
    })
  }

  // Riders
  formData.riders.forEach((rider) => {
    const price = rider.is_rental ? PRICING.rider_rental : PRICING.rider_install
    const suffix = rider.is_rental ? ' (rental)' : ' (your own)'
    const name = rider.custom_value ? `${rider.custom_value} Acres` : rider.rider_type
    orderItems.push({
      description: `Rider: ${name}${suffix}`,
      price,
    })
  })

  // Lockbox
  if (formData.lockbox_option === 'sentrilock' || formData.lockbox_option === 'mechanical_own') {
    orderItems.push({
      description: `${formData.lockbox_option === 'sentrilock' ? 'SentriLock' : 'Mechanical Lockbox'} Install`,
      price: PRICING.lockbox_install,
    })
  } else if (formData.lockbox_option === 'mechanical_rent') {
    orderItems.push({
      description: 'Mechanical Lockbox Rental',
      price: PRICING.lockbox_rental,
    })
  }

  // Brochure box
  if (formData.brochure_option === 'stored') {
    orderItems.push({
      description: 'Brochure Box Install',
      price: PRICING.brochure_box_install,
    })
  } else if (formData.brochure_option === 'new') {
    orderItems.push({
      description: 'New Brochure Box',
      price: PRICING.brochure_box_new,
    })
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
  const expediteFee = formData.schedule_type === 'expedited' ? PRICING.expedite_fee : 0
  const total = subtotal + PRICING.fuel_surcharge + expediteFee

  const defaultPaymentMethod = paymentMethods?.find((pm) => pm.is_default)

  const handleSubmit = async () => {
    if (!formData.post_type) {
      setError('Please select a post type')
      return
    }

    setIsSubmitting?.(true)
    setError(null)

    try {
      const items = orderItems.map((item) => ({
        item_type: 'post', // Simplified for now
        description: item.description,
        quantity: 1,
        unit_price: item.price,
        total_price: item.price,
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_type: formData.property_type,
          property_address: formData.property_address,
          property_city: formData.property_city,
          property_state: formData.property_state,
          property_zip: formData.property_zip,
          installation_location: formData.installation_location,
          installation_notes: formData.installation_notes,
          post_type: formData.post_type,
          items,
          requested_date: formData.requested_date,
          is_expedited: formData.schedule_type === 'expedited',
          payment_method_id: formData.payment_method_id || defaultPaymentMethod?.id,
          save_payment_method: formData.save_payment_method,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Redirect to confirmation page
      router.push(`/dashboard/order-confirmation?order=${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting?.(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Pay</h2>
        <p className="text-gray-600">Review your order details and complete payment.</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

        {/* Property */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">Property</p>
          <p className="font-medium text-gray-900">
            {formData.property_address}, {formData.property_city}, {formData.property_state} {formData.property_zip}
          </p>
          <p className="text-sm text-gray-500 capitalize">{formData.property_type?.replace('_', ' ')}</p>
        </div>

        {/* Schedule */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">Requested Date</p>
          <p className="font-medium text-gray-900">
            {formData.schedule_type === 'next_available' && 'Next Available'}
            {formData.schedule_type === 'expedited' && 'Same Day (Expedited)'}
            {formData.schedule_type === 'specific_date' && formData.requested_date}
          </p>
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.description}</span>
              <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel Surcharge</span>
            <span className="text-gray-900">${PRICING.fuel_surcharge.toFixed(2)}</span>
          </div>
          {expediteFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expedite Fee</span>
              <span className="text-gray-900">${expediteFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-pink-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </h3>

        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => updateFormData({ payment_method_id: pm.id })}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                  (formData.payment_method_id || defaultPaymentMethod?.id) === pm.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-600 uppercase">
                    {pm.card_brand}
                  </div>
                  <span className="text-gray-900">•••• {pm.card_last4}</span>
                  {pm.is_default && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Default</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No saved payment methods.</p>
            <p className="text-sm mt-1">You&apos;ll be redirected to add a card after clicking &quot;Place Order&quot;.</p>
          </div>
        )}

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.save_payment_method}
            onChange={(e) => updateFormData({ save_payment_method: e.target.checked })}
            className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm text-gray-600">Save card for future orders</span>
        </label>
      </div>

      {/* Fuel Surcharge Notice */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
        <p>
          A fuel surcharge of ${PRICING.fuel_surcharge.toFixed(2)} is applied to all orders.
          Your payment information is securely processed via Stripe.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
      </Button>
    </div>
  )
}
