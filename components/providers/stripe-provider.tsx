'use client'

import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'

interface StripeProviderProps {
  children: React.ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const stripePromise = getStripe()

  return (
    <Elements
      stripe={stripePromise}
      options={{
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
      {children}
    </Elements>
  )
}
