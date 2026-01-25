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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch only this user's service requests
    let serviceRequests: any[] = []

    try {
      serviceRequests = await prisma.serviceRequest.findMany({
        where: {
          userId: user.id,
          ...(status ? { status: status as any } : {}),
        },
        include: {
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
    } catch {
      // Table may not exist yet
      serviceRequests = []
    }

    // Count by status for this user
    let statusCounts: Record<string, number> = {}
    try {
      const counts = await prisma.serviceRequest.groupBy({
        by: ['status'],
        where: { userId: user.id },
        _count: true,
      })
      statusCounts = counts.reduce((acc, item) => {
        acc[item.status] = item._count
        return acc
      }, {} as Record<string, number>)
    } catch {
      statusCounts = {}
    }

    return NextResponse.json({
      serviceRequests: serviceRequests.map((sr) => ({
        id: sr.id,
        type: sr.type,
        status: sr.status,
        description: sr.description,
        requestedDate: sr.requestedDate?.toISOString() || null,
        notes: sr.notes,
        adminNotes: sr.adminNotes,
        completedAt: sr.completedAt?.toISOString() || null,
        createdAt: sr.createdAt.toISOString(),
        updatedAt: sr.updatedAt.toISOString(),
        installation: sr.installation
          ? {
              id: sr.installation.id,
              address: `${sr.installation.propertyAddress}, ${sr.installation.propertyCity}, ${sr.installation.propertyState} ${sr.installation.propertyZip}`,
              status: sr.installation.status,
            }
          : null,
      })),
      counts: {
        pending: statusCounts.pending || 0,
        acknowledged: statusCounts.acknowledged || 0,
        scheduled: statusCounts.scheduled || 0,
        in_progress: statusCounts.in_progress || 0,
        completed: statusCounts.completed || 0,
        cancelled: statusCounts.cancelled || 0,
        total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      },
    })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
