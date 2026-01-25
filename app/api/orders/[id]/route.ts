import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { sendInstallationCompleteEmail } from '@/lib/email'
import { createOrderNotification } from '@/lib/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        orderItems: true,
        postType: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can update order status
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        orderItems: true,
      },
    })

    // Create notification for status change (skip pending as that's initial state)
    if (status !== 'pending') {
      try {
        await createOrderNotification(
          order.userId,
          order.orderNumber,
          order.id,
          status
        )
      } catch (notifError) {
        console.error('Error creating notification:', notifError)
      }
    }

    // If order is completed, create installation record and notify customer
    if (status === 'completed') {
      // Check if installation already exists
      const existingInstallation = await prisma.installation.findUnique({
        where: { orderId: id },
      })

      if (!existingInstallation) {
        const installation = await prisma.installation.create({
          data: {
            orderId: order.id,
            userId: order.userId,
            propertyAddress: order.propertyAddress,
            propertyCity: order.propertyCity,
            propertyState: order.propertyState,
            propertyZip: order.propertyZip,
            status: 'active',
          },
        })

        // Create InstallationRider and InstallationLockbox records from order items
        for (const item of order.orderItems) {
          // Handle riders
          if (item.itemType === 'rider') {
            const isRental = item.itemCategory === 'rental'
            let riderId = item.riderId

            // If no direct riderId, try to get it from customer's rider
            if (!riderId && item.customerRiderId) {
              const customerRider = await prisma.customerRider.findUnique({
                where: { id: item.customerRiderId },
              })
              riderId = customerRider?.riderId || null
            }

            if (riderId) {
              await prisma.installationRider.create({
                data: {
                  installationId: installation.id,
                  riderId,
                  isRental,
                },
              })

              // Update customer's rider status if from storage
              if (item.customerRiderId && item.itemCategory === 'storage') {
                await prisma.customerRider.update({
                  where: { id: item.customerRiderId },
                  data: { inStorage: false },
                })
              }
            }
          }

          // Handle lockboxes
          if (item.itemType === 'lockbox') {
            const isRental = item.itemCategory === 'rental'
            let lockboxTypeId: string | null = null
            let code: string | null = null

            // Get lockbox type from customer's lockbox
            if (item.customerLockboxId) {
              const customerLockbox = await prisma.customerLockbox.findUnique({
                where: { id: item.customerLockboxId },
              })
              lockboxTypeId = customerLockbox?.lockboxTypeId || null
              code = customerLockbox?.code || null

              // Update customer's lockbox status if from storage
              if (item.itemCategory === 'storage') {
                await prisma.customerLockbox.update({
                  where: { id: item.customerLockboxId },
                  data: { inStorage: false },
                })
              }
            } else {
              // For new/rental lockboxes, try to find the lockbox type by name in description
              const lockboxType = await prisma.lockboxType.findFirst({
                where: {
                  OR: [
                    { name: { contains: 'SentriLock', mode: 'insensitive' } },
                    { name: { contains: 'Supra', mode: 'insensitive' } },
                  ],
                  isActive: true,
                },
              })
              lockboxTypeId = lockboxType?.id || null
            }

            if (lockboxTypeId) {
              await prisma.installationLockbox.create({
                data: {
                  installationId: installation.id,
                  lockboxTypeId,
                  isRental,
                  code,
                },
              })
            }
          }
        }

        // Send completion email to customer
        try {
          await sendInstallationCompleteEmail(
            order.user.email,
            order.user.fullName || order.user.name || 'Customer',
            `${order.propertyAddress}, ${order.propertyCity}, ${order.propertyState} ${order.propertyZip}`
          )
        } catch (emailError) {
          console.error('Error sending completion email:', emailError)
        }
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
