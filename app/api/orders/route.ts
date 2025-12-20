import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, generateOrderNumber } from '@/lib/auth-utils'
import { createOrderSchema } from '@/lib/validations'
import { createPaymentIntent, createCustomer } from '@/lib/stripe/server'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

const FUEL_SURCHARGE = 2.47

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
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

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + item.total_price, 0)
    const expediteFee = orderData.is_expedited ? 25 : 0
    const total = subtotal + FUEL_SURCHARGE + expediteFee

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const stripeCustomer = await createCustomer(user.email, user.fullName || user.name || '')
      stripeCustomerId = stripeCustomer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      total,
      stripeCustomerId,
      orderData.payment_method_id
    )

    // Get the post type
    const postType = await prisma.postType.findFirst({
      where: { name: orderData.post_type },
    })

    if (!postType) {
      return NextResponse.json({ error: 'Invalid post type' }, { status: 400 })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        postTypeId: postType.id,
        propertyType: orderData.property_type as any,
        propertyAddress: orderData.property_address,
        propertyCity: orderData.property_city,
        propertyState: orderData.property_state || 'KY',
        propertyZip: orderData.property_zip,
        propertyNotes: orderData.installation_notes,
        installationLocationImage: orderData.installation_location_image,
        scheduledDate: orderData.requested_date ? new Date(orderData.requested_date) : null,
        isExpedited: orderData.is_expedited,
        subtotal,
        fuelSurcharge: FUEL_SURCHARGE,
        expediteFee,
        total,
        paymentIntentId: paymentIntent.id,
        paymentStatus: paymentIntent.status === 'succeeded' ? 'succeeded' : 'processing',
        orderItems: {
          create: orderData.items.map((item) => ({
            itemType: item.item_type,
            itemCategory: item.item_category,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            totalPrice: item.total_price,
            customerSignId: item.customer_sign_id,
            customerRiderId: item.customer_rider_id,
            customerLockboxId: item.customer_lockbox_id,
            customerBrochureBoxId: item.customer_brochure_box_id,
            customValue: item.custom_value,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    // Send emails if payment succeeded
    if (paymentIntent.status === 'succeeded') {
      try {
        await Promise.all([
          sendOrderConfirmationEmail({
            customerName: user.fullName || user.name || '',
            customerEmail: user.email,
            orderNumber: order.orderNumber,
            propertyAddress: `${order.propertyAddress}, ${order.propertyCity}, ${order.propertyState} ${order.propertyZip}`,
            total: Number(order.total),
            items: orderData.items,
            requestedDate: orderData.requested_date,
          }),
          sendAdminOrderNotification({
            orderNumber: order.orderNumber,
            customerName: user.fullName || user.name || '',
            customerEmail: user.email,
            customerPhone: user.phone || '',
            propertyAddress: `${order.propertyAddress}, ${order.propertyCity}, ${order.propertyState} ${order.propertyZip}`,
            total: Number(order.total),
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
