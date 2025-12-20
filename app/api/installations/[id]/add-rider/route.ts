import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function POST(
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
    const { rider_id, is_rental } = body

    if (!rider_id) {
      return NextResponse.json(
        { error: 'Rider ID is required' },
        { status: 400 }
      )
    }

    // Verify installation belongs to user
    const installation = await prisma.installation.findFirst({
      where: { id, userId: user.id },
    })

    if (!installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    if (installation.status !== 'active') {
      return NextResponse.json(
        { error: 'Can only add riders to active installations' },
        { status: 400 }
      )
    }

    const rider = await prisma.installationRider.create({
      data: {
        installationId: id,
        riderId: rider_id,
        isRental: is_rental || false,
      },
      include: { rider: true },
    })

    return NextResponse.json({ rider }, { status: 201 })
  } catch (error) {
    console.error('Error adding rider:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
