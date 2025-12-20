import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(type ? { type: type as any } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            company: true,
          },
        },
        installation: {
          select: {
            id: true,
            propertyAddress: true,
            propertyCity: true,
            propertyState: true,
            propertyZip: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    // Get counts for dashboard
    const counts = await prisma.serviceRequest.groupBy({
      by: ['status'],
      _count: true,
    })

    const statusCounts = counts.reduce((acc, item) => {
      acc[item.status] = item._count
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      serviceRequests,
      counts: {
        pending: statusCounts.pending || 0,
        acknowledged: statusCounts.acknowledged || 0,
        scheduled: statusCounts.scheduled || 0,
        in_progress: statusCounts.in_progress || 0,
        completed: statusCounts.completed || 0,
        cancelled: statusCounts.cancelled || 0,
        total: serviceRequests.length,
      },
    })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
