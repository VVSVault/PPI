import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function createCustomer(email: string, name: string) {
  return stripe.customers.create({
    email,
    name,
  })
}

export async function getCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId)
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

  return stripe.paymentIntents.create(params)
}

export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId: string
) {
  return stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: paymentMethodId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/order-confirmation`,
  })
}

export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  return stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  })
}

export async function detachPaymentMethod(paymentMethodId: string) {
  return stripe.paymentMethods.detach(paymentMethodId)
}

export async function listPaymentMethods(customerId: string) {
  return stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  })
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string
) {
  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

export async function createSetupIntent(customerId: string) {
  return stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
  })
}
