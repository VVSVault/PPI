import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

// Helper to get or create a Stripe customer for a user
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')

  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  })

  // Save customer ID to user record
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

// Create a SetupIntent for saving a card
export async function createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
  return stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  })
}

// List payment methods for a customer
export async function listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  })
  return paymentMethods.data
}

// Detach a payment method
export async function detachPaymentMethod(paymentMethodId: string): Promise<void> {
  await stripe.paymentMethods.detach(paymentMethodId)
}

// Set default payment method for customer
export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
): Promise<void> {
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

// Charge a saved payment method
export async function chargePaymentMethod(
  customerId: string,
  paymentMethodId: string,
  amount: number, // in cents
  description: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    description,
    metadata,
  })

  return paymentIntent
}

// Create a payment intent for manual payment
export async function createPaymentIntent(
  customerId: string,
  amount: number, // in cents
  description: string,
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    customer: customerId,
    description,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })
}
