import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { z } from 'zod'

const createPromoCodeSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase()),
  description: z.string().optional().nullable(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  waiveFuelSurcharge: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true, usages: true },
        },
      },
    })

    return NextResponse.json({ promoCodes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = createPromoCodeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: data.code },
    })

    if (existing) {
      return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 })
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxUses: data.maxUses,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        waiveFuelSurcharge: data.waiveFuelSurcharge,
        isActive: data.isActive,
      },
    })

    return NextResponse.json({ promoCode }, { status: 201 })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
