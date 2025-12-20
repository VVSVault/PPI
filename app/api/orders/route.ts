import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validations'
import { createPaymentIntent, createCustomer } from '@/lib/stripe/server'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

const FUEL_SURCHARGE = 2.47

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = createOrderSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const orderData = validationResult.data

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + item.total_price, 0)
    const expediteFee = orderData.is_expedited ? 25 : 0 // Configurable expedite fee
    const total = subtotal + FUEL_SURCHARGE + expediteFee

    // Create or get Stripe customer
    let stripeCustomerId = profile.stripe_customer_id
    if (!stripeCustomerId) {
      const stripeCustomer = await createCustomer(profile.email, profile.full_name)
      stripeCustomerId = stripeCustomer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      total,
      stripeCustomerId,
      orderData.payment_method_id
    )

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        property_type: orderData.property_type,
        property_address: orderData.property_address,
        property_city: orderData.property_city,
        property_state: orderData.property_state || 'KY',
        property_zip: orderData.property_zip,
        installation_location: orderData.installation_location,
        installation_notes: orderData.installation_notes,
        requested_date: orderData.requested_date,
        is_expedited: orderData.is_expedited,
        subtotal,
        fuel_surcharge: FUEL_SURCHARGE,
        expedite_fee: expediteFee,
        total,
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'processing',
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
    }

    // Send emails if payment succeeded
    if (paymentIntent.status === 'succeeded') {
      try {
        await Promise.all([
          sendOrderConfirmationEmail({
            customerName: profile.full_name,
            customerEmail: profile.email,
            orderNumber: order.order_number,
            propertyAddress: `${order.property_address}, ${order.property_city}, ${order.property_state} ${order.property_zip}`,
            total: order.total,
            items: orderData.items,
            requestedDate: orderData.requested_date,
          }),
          sendAdminOrderNotification({
            orderNumber: order.order_number,
            customerName: profile.full_name,
            customerEmail: profile.email,
            customerPhone: profile.phone,
            propertyAddress: `${order.property_address}, ${order.property_city}, ${order.property_state} ${order.property_zip}`,
            total: order.total,
            items: orderData.items,
            requestedDate: orderData.requested_date,
            isExpedited: orderData.is_expedited,
          }),
        ])
      } catch (emailError) {
        console.error('Error sending emails:', emailError)
      }
    }

    return NextResponse.json({
      order,
      clientSecret: paymentIntent.client_secret,
      paymentStatus: paymentIntent.status,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
