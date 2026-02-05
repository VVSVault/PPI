import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { createNotification } from '@/lib/notifications'

// POST - Create a service request for an unlisted address
// This is used when the system doesn't show an existing installation
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, description, requested_date, notes, address } = body

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Type and description are required' },
        { status: 400 }
      )
    }

    // For unlisted addresses, we need to find or create an installation placeholder
    // First, check if user has any existing installations at this address
    let installation = null
    if (address) {
      installation = await prisma.installation.findFirst({
        where: {
          userId: user.id,
          propertyAddress: { contains: address.street, mode: 'insensitive' },
          propertyCity: { contains: address.city, mode: 'insensitive' },
        },
      })
    }

    // If no installation found and we have address info, check if user has ANY installation
    // and include address info in the notes
    if (!installation) {
      // Get user's first installation to link to (if any)
      installation = await prisma.installation.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    }

    if (!installation) {
      // User has no installations at all - they need to place an order first
      // or contact support directly
      return NextResponse.json(
        { error: 'No installations found. Please contact support for assistance with unlisted addresses.' },
        { status: 400 }
      )
    }

    // Create the service request
    // Include address info in description/notes if it's an unlisted address
    const fullDescription = address
      ? `${description}\n\n[Unlisted Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}]`
      : description

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        installationId: installation.id,
        userId: user.id,
        type: type as any,
        description: fullDescription,
        requestedDate: requested_date ? new Date(requested_date) : null,
        notes: notes || null,
      },
      include: {
        installation: {
          select: {
            propertyAddress: true,
            propertyCity: true,
          },
        },
      },
    })

    // Create notification for the user
    await createNotification({
      userId: user.id,
      type: 'service_request_acknowledged',
      title: 'Service Request Submitted',
      message: `Your ${type} request has been submitted and will be reviewed.`,
      link: '/dashboard/service-requests',
    })

    return NextResponse.json({
      serviceRequest: {
        id: serviceRequest.id,
        type: serviceRequest.type,
        status: serviceRequest.status,
        description: serviceRequest.description,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating service request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
