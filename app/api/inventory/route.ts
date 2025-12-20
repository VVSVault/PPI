import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all inventory types in parallel
    const [signs, riders, lockboxes, brochureBoxes] = await Promise.all([
      prisma.customerSign.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customerRider.findMany({
        where: { userId: user.id },
        include: { rider: true },
      }),
      prisma.customerLockbox.findMany({
        where: { userId: user.id },
        include: { lockboxType: true },
      }),
      prisma.customerBrochureBox.findMany({
        where: { userId: user.id },
      }),
    ])

    return NextResponse.json({
      signs,
      riders,
      lockboxes,
      brochureBoxes,
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
