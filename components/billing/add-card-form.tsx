'use client'

import { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { Button, Card, CardContent } from '@/components/ui'
import { CreditCard, Loader2, X } from 'lucide-react'

interface AddCardFormProps {
  onSuccess: () => void
  onCancel: () => void
}

function CardForm({ onSuccess, onCancel }: AddCardFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Confirm the SetupIntent
      const { error: submitError, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/billing`,
        },
        redirect: 'if_required',
      })

      if (submitError) {
        setError(submitError.message || 'Failed to add card')
        setProcessing(false)
        return
      }

      if (setupIntent && setupIntent.payment_method) {
        // Save the payment method to our database
        const saveRes = await fetch('/api/stripe/payment-methods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: setupIntent.payment_method,
          }),
        })

        if (!saveRes.ok) {
          throw new Error('Failed to save payment method')
        }

        onSuccess()
      }
    } catch (err) {
      console.error('Error adding card:', err)
      setError('Failed to add card. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={processing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!stripe || processing}
            className="flex-1"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Add Card
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddCardModal({ isOpen, onClose, onSuccess }: AddCardModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch SetupIntent when modal opens
  const initSetupIntent = async () => {
    if (clientSecret) return // Already have one

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to initialize card setup')
      }

      const data = await res.json()
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.error('Error creating setup intent:', err)
      setError('Failed to initialize. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Initialize when modal opens
  if (isOpen && !clientSecret && !loading && !error) {
    initSetupIntent()
  }

  // Reset state when modal closes
  const handleClose = () => {
    setClientSecret(null)
    setError(null)
    onClose()
  }

  const handleSuccess = () => {
    setClientSecret(null)
    onSuccess()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Add Payment Method</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <CardContent className="p-4 overflow-y-auto flex-1">
          {loading && (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Initializing secure form...</p>
            </div>
          )}

          {error && (
            <div className="py-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline" onClick={initSetupIntent}>
                Try Again
              </Button>
            </div>
          )}

          {clientSecret && !loading && (
            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#ec4899',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, sans-serif',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <CardForm onSuccess={handleSuccess} onCancel={handleClose} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
