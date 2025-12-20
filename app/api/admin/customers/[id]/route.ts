import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get customer profile
    const customer = await prisma.user.findUnique({
      where: { id },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get all inventory and related data
    const [signs, riders, lockboxes, brochureBoxes, orders, installations] =
      await Promise.all([
        prisma.customerSign.findMany({
          where: { userId: id },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.customerRider.findMany({
          where: { userId: id },
          include: { rider: true },
        }),
        prisma.customerLockbox.findMany({
          where: { userId: id },
          include: { lockboxType: true },
        }),
        prisma.customerBrochureBox.findMany({
          where: { userId: id },
        }),
        prisma.order.findMany({
          where: { userId: id },
          include: { orderItems: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.installation.findMany({
          where: { userId: id },
          include: {
            riders: { include: { rider: true } },
            lockboxes: { include: { lockboxType: true } },
          },
          orderBy: { installedAt: 'desc' },
        }),
      ])

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.fullName,
        phone: customer.phone,
        company: customer.company,
        created_at: customer.createdAt,
      },
      inventory: {
        signs,
        riders,
        lockboxes,
        brochureBoxes,
      },
      orders,
      installations,
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    if (body.full_name !== undefined) updateData.fullName = body.full_name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.company !== undefined) updateData.company = body.company

    const customer = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.fullName,
        phone: customer.phone,
        company: customer.company,
      },
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
