import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find and update order by payment intent ID
        const order = await prisma.order.update({
          where: { paymentIntentId: paymentIntent.id },
          data: {
            paymentStatus: 'succeeded',
            paidAt: new Date(),
          },
          include: {
            orderItems: true,
            user: true,
          },
        })

        if (order) {
          // Send confirmation emails
          try {
            await Promise.all([
              sendOrderConfirmationEmail({
                customerName: order.user.fullName || order.user.name || '',
                customerEmail: order.user.email,
                orderNumber: order.orderNumber,
                propertyAddress: `${order.propertyAddress}, ${order.propertyCity}, ${order.propertyState} ${order.propertyZip}`,
                total: Number(order.total),
                items: order.orderItems.map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  total_price: Number(item.totalPrice),
                })),
                requestedDate: order.scheduledDate?.toISOString(),
              }),
              sendAdminOrderNotification({
                orderNumber: order.orderNumber,
                customerName: order.user.fullName || order.user.name || '',
                customerEmail: order.user.email,
                customerPhone: order.user.phone || '',
                propertyAddress: `${order.propertyAddress}, ${order.propertyCity}, ${order.propertyState} ${order.propertyZip}`,
                total: Number(order.total),
                items: order.orderItems.map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  total_price: Number(item.totalPrice),
                })),
                requestedDate: order.scheduledDate?.toISOString(),
                isExpedited: order.isExpedited,
              }),
            ])
          } catch (emailError) {
            console.error('Error sending emails:', emailError)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.order.update({
          where: { paymentIntentId: paymentIntent.id },
          data: { paymentStatus: 'failed' },
        })

        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await prisma.order.update({
          where: { paymentIntentId: paymentIntent.id },
          data: {
            paymentStatus: 'failed',
            status: 'cancelled',
          },
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
