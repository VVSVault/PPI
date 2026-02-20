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

    // Check if user has exceeded their max uses for this code
    if (promoCode.maxUses) {
      const userUsageCount = await prisma.promoCodeUsage.count({
        where: {
          userId: user.id,
          promoCodeId: promoCode.id,
        },
      })
      if (userUsageCount >= promoCode.maxUses) {
        return NextResponse.json({ error: 'You have already used this promo code the maximum number of times' }, { status: 400 })
      }
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
        waiveFuelSurcharge: promoCode.waiveFuelSurcharge,
      },
      discount,
    })
  } catch (error) {
    console.error('Error validating promo code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
