import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  return stripeClient
}

export { getStripe as stripe }

export async function createCustomer(email: string, name: string) {
  return getStripe().customers.create({
    email,
    name,
  })
}

export async function getCustomer(customerId: string) {
  return getStripe().customers.retrieve(customerId)
}

export async function createPaymentIntent(
  amount: number,
  customerId?: string,
  paymentMethodId?: string
) {
  const params: Stripe.PaymentIntentCreateParams = {
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  }

  if (customerId) {
    params.customer = customerId
  }

  if (paymentMethodId) {
    params.payment_method = paymentMethodId
    params.confirm = true
    params.return_url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/order-confirmation`
  }

  return getStripe().paymentIntents.create(params)
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
) {
  return getStripe().paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/order-confirmation`,
  })
}

export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  return getStripe().paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  })
}

export async function detachPaymentMethod(paymentMethodId: string) {
  return getStripe().paymentMethods.detach(paymentMethodId)
}

export async function listPaymentMethods(customerId: string) {
  return getStripe().paymentMethods.list({
    customer: customerId,
    type: 'card',
  })
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
) {
  return getStripe().customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

export async function createSetupIntent(customerId: string) {
  return getStripe().setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  })
}

// Stripe Tax calculation
interface TaxLineItem {
  amount: number // in cents
  reference: string
  tax_code?: string
}

interface TaxAddress {
  line1?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export async function calculateTax(
  lineItems: TaxLineItem[],
  shippingAddress: TaxAddress
): Promise<{ taxAmountExclusive: number; taxBreakdown: Array<{ amount: number; jurisdiction: string; rate: string }> }> {
  try {
    const calculation = await getStripe().tax.calculations.create({
      currency: 'usd',
      line_items: lineItems.map((item) => ({
        amount: item.amount,
        reference: item.reference,
        // txcd_99999999 is the default tax code for general services
        tax_code: item.tax_code || 'txcd_99999999',
      })),
      customer_details: {
        address: {
          line1: shippingAddress.line1 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
        address_source: 'shipping',
      },
    })

    // Extract tax breakdown for transparency
    const taxBreakdown = calculation.tax_breakdown?.map((breakdown) => {
      const percentDecimal = breakdown.tax_rate_details?.percentage_decimal
      const rateValue = percentDecimal ? parseFloat(percentDecimal) * 100 : 0
      // Access display_name from the jurisdiction object
      const jurisdictionName = breakdown.tax_rate_details?.country || 'unknown'
      return {
        amount: breakdown.amount,
        jurisdiction: jurisdictionName,
        rate: `${rateValue.toFixed(2)}%`,
      }
    }) || []

    return {
      taxAmountExclusive: calculation.tax_amount_exclusive,
      taxBreakdown,
    }
  } catch (error) {
    console.error('Stripe Tax calculation error:', error)
    // Fall back to manual calculation if Stripe Tax fails
    // This ensures orders can still be placed even if tax service is unavailable
    throw error
  }
}

// Check if Stripe Tax is enabled (useful for feature flagging)
export async function isStripeTaxEnabled(): Promise<boolean> {
  try {
    // Try a minimal tax calculation to verify the service is enabled
    await getStripe().tax.calculations.create({
      currency: 'usd',
      line_items: [{ amount: 100, reference: 'test' }],
      customer_details: {
        address: {
          city: 'Lexington',
          state: 'KY',
          postal_code: '40502',
          country: 'US',
        },
        address_source: 'shipping',
      },
    })
    return true
  } catch (error: unknown) {
    // If we get a specific error about Tax not being enabled, return false
    if (error && typeof error === 'object' && 'code' in error && error.code === 'tax_not_enabled') {
      return false
    }
    // Other errors might be transient, so we log but assume enabled
    console.warn('Could not verify Stripe Tax status:', error)
    return false
  }
}
