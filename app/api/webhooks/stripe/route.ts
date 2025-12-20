import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

// Use service role for webhooks since there's no user context
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

        // Find order by payment intent ID
        const { data: order, error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'succeeded',
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .select('*, order_items(*)')
          .single()

        if (error) {
          console.error('Error updating order:', error)
          break
        }

        if (order) {
          // Get user profile for email
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', order.user_id)
            .single()

          if (profile) {
            // Send confirmation emails
            try {
              await Promise.all([
                sendOrderConfirmationEmail({
                  customerName: profile.full_name,
                  customerEmail: profile.email,
                  orderNumber: order.order_number,
                  propertyAddress: `${order.property_address}, ${order.property_city}, ${order.property_state} ${order.property_zip}`,
                  total: order.total,
                  items: order.order_items,
                  requestedDate: order.requested_date,
                }),
                sendAdminOrderNotification({
                  orderNumber: order.order_number,
                  customerName: profile.full_name,
                  customerEmail: profile.email,
                  customerPhone: profile.phone,
                  propertyAddress: `${order.property_address}, ${order.property_city}, ${order.property_state} ${order.property_zip}`,
                  total: order.total,
                  items: order.order_items,
                  requestedDate: order.requested_date,
                  isExpedited: order.is_expedited,
                }),
              ])
            } catch (emailError) {
              console.error('Error sending emails:', emailError)
            }
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

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
