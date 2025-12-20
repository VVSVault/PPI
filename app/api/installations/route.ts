import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const installations = await prisma.installation.findMany({
      where: {
        userId: user.id,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        riders: {
          include: { rider: true },
        },
        lockboxes: {
          include: { lockboxType: true },
        },
      },
      orderBy: { installedAt: 'desc' },
    })

    return NextResponse.json({ installations })
  } catch (error) {
    console.error('Error fetching installations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
