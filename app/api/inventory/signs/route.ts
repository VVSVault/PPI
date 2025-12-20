import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const signs = await prisma.customerSign.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ signs })
  } catch (error) {
    console.error('Error fetching signs:', error)
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

    if (!body.description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }

    const sign = await prisma.customerSign.create({
      data: {
        userId: user.id,
        description: body.description,
        imageUrl: body.image_url,
        inStorage: body.in_storage ?? true,
      },
    })

    return NextResponse.json({ sign }, { status: 201 })
  } catch (error) {
    console.error('Error creating sign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
