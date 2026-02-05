import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, subtotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!promoCode) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      return NextResponse.json({ error: 'This promo code is no longer active' }, { status: 400 })
    }

    // Check if promo code has started
    if (promoCode.startsAt && new Date() < promoCode.startsAt) {
      return NextResponse.json({ error: 'This promo code is not yet active' }, { status: 400 })
    }

    // Check if promo code has expired
    if (promoCode.expiresAt && new Date() > promoCode.expiresAt) {
      return NextResponse.json({ error: 'This promo code has expired' }, { status: 400 })
    }

    // Check if max uses has been reached
    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      return NextResponse.json({ error: 'This promo code has reached its usage limit' }, { status: 400 })
    }

    // Check minimum order amount
    if (promoCode.minOrderAmount && subtotal < Number(promoCode.minOrderAmount)) {
      return NextResponse.json({
        error: `Minimum order amount of $${Number(promoCode.minOrderAmount).toFixed(2)} required for this promo code`,
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (promoCode.discountType === 'percentage') {
      discount = subtotal * (Number(promoCode.discountValue) / 100)
    } else {
      discount = Math.min(Number(promoCode.discountValue), subtotal) // Don't discount more than subtotal
    }

    // Round to 2 decimal places
    discount = Math.round(discount * 100) / 100

    return NextResponse.json({
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        description: promoCode.description,
        discountType: promoCode.discountType,
        discountValue: Number(promoCode.discountValue),
      },
      discount,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
