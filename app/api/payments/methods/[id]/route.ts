import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { detachPaymentMethod, setDefaultPaymentMethod } from '@/lib/stripe/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { is_default } = body

    // Get the payment method
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    })

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
    }

    if (is_default) {
      if (user.stripeCustomerId) {
        await setDefaultPaymentMethod(
          user.stripeCustomerId,
          paymentMethod.stripePaymentMethodId
        )
      }

      // Clear other defaults
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id, id: { not: id } },
        data: { isDefault: false },
      })

      // Set this as default
      const updated = await prisma.paymentMethod.update({
        where: { id },
        data: { isDefault: true },
      })

      return NextResponse.json({ paymentMethod: updated })
    }

    return NextResponse.json({ paymentMethod })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the payment method
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id, userId: user.id },
    })

    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
    }

    // Detach from Stripe
    try {
      await detachPaymentMethod(paymentMethod.stripePaymentMethodId)
    } catch (stripeError) {
      console.error('Error detaching from Stripe:', stripeError)
    }

    // Delete from database
    await prisma.paymentMethod.delete({
      where: { id },
    })

    // If was default, set another as default
    if (paymentMethod.isDefault) {
      const remaining = await prisma.paymentMethod.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })

      if (remaining) {
        await prisma.paymentMethod.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
