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
    const [signsRaw, ridersRaw, lockboxesRaw, brochureBoxesRaw, ordersRaw, installationsRaw] =
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

    // Transform data to match frontend expectations
    const signs = signsRaw.map((sign) => ({
      id: sign.id,
      description: sign.description,
      size: null,
      quantity: 1,
    }))

    const riders = ridersRaw.map((r) => ({
      id: r.id,
      rider_type: r.rider.name,
      quantity: 1,
    }))

    const lockboxes = lockboxesRaw.map((lb) => ({
      id: lb.id,
      lockbox_type: lb.lockboxType.name,
      lockbox_code: lb.code,
      quantity: 1,
    }))

    // Aggregate brochure boxes into a single count
    const brochureBoxes = brochureBoxesRaw.length > 0
      ? { id: brochureBoxesRaw[0].id, quantity: brochureBoxesRaw.length }
      : null

    // Transform orders to match frontend expectations
    const orders = ordersRaw.map((order) => ({
      id: order.id,
      order_number: order.orderNumber,
      status: order.status,
      total: Number(order.total),
      created_at: order.createdAt.toISOString(),
    }))

    // Transform installations
    const installations = installationsRaw.map((inst) => ({
      id: inst.id,
      address: inst.propertyAddress,
      city: inst.propertyCity,
      post_type: 'Standard',
      status: inst.status,
      installation_date: inst.installedAt.toISOString(),
    }))

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.fullName,
        phone: customer.phone,
        company_name: customer.company,
        license_number: null,
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
