import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order payment status if we have an orderId in metadata
        if (paymentIntent.metadata?.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: {
              paymentStatus: 'succeeded',
              paymentIntentId: paymentIntent.id,
              paidAt: new Date(),
            },
          })

          console.log(`Payment succeeded for order ${paymentIntent.metadata.orderNumber}`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        if (paymentIntent.metadata?.orderId) {
          await prisma.order.update({
            where: { id: paymentIntent.metadata.orderId },
            data: {
              paymentStatus: 'failed',
            },
          })

          console.error(`Payment failed for order ${paymentIntent.metadata.orderNumber}:`, paymentIntent.last_payment_error?.message)
        }
        break
      }

      case 'setup_intent.succeeded': {
        // Card was successfully saved - we handle this in the frontend
        console.log('SetupIntent succeeded:', event.data.object.id)
        break
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        // Handle subscription events if needed in the future
        break
      }

      default:
        // Unhandled event type
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

