import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { detachPaymentMethod, stripe, setDefaultPaymentMethod } from '@/lib/stripe'

// DELETE /api/stripe/payment-methods/[id] - Remove a payment method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: paymentMethodId } = await params

    // Verify ownership
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        stripePaymentMethodId: paymentMethodId,
        userId: session.user.id,
      },
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // Detach from Stripe
    await detachPaymentMethod(paymentMethodId)

    // Remove from database
    await prisma.paymentMethod.delete({
      where: { stripePaymentMethodId: paymentMethodId },
    })

    // If this was the default, set another as default
    if (paymentMethod.isDefault) {
      const nextMethod = await prisma.paymentMethod.findFirst({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      })

      if (nextMethod) {
        await prisma.paymentMethod.update({
          where: { id: nextMethod.id },
          data: { isDefault: true },
        })

        // Get user's Stripe customer ID to update Stripe default
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { stripeCustomerId: true },
        })

        if (user?.stripeCustomerId) {
          await setDefaultPaymentMethod(user.stripeCustomerId, nextMethod.stripePaymentMethodId)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    )
  }
}

// PATCH /api/stripe/payment-methods/[id] - Set as default payment method
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: paymentMethodId } = await params

    // Verify ownership
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        stripePaymentMethodId: paymentMethodId,
        userId: session.user.id,
      },
    })

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    // Update Stripe default
    await setDefaultPaymentMethod(user.stripeCustomerId, paymentMethodId)

    // Update database - remove default from all others, set this one
    await prisma.$transaction([
      prisma.paymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.paymentMethod.update({
        where: { stripePaymentMethodId: paymentMethodId },
        data: { isDefault: true },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting default payment method:', error)
    return NextResponse.json(
      { error: 'Failed to set default payment method' },
      { status: 500 }
    )
  }
}
