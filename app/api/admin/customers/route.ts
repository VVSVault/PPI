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
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const customers = await prisma.user.findMany({
      where: {
        role: 'customer',
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        _count: {
          select: {
            customerSigns: true,
            customerRiders: true,
            customerLockboxes: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    })

    const customersWithCounts = customers.map((customer) => ({
      id: customer.id,
      email: customer.email,
      full_name: customer.fullName,
      phone: customer.phone,
      company: customer.company,
      created_at: customer.createdAt,
      sign_count: customer._count.customerSigns,
      rider_count: customer._count.customerRiders,
      lockbox_count: customer._count.customerLockboxes,
      order_count: customer._count.orders,
    }))

    return NextResponse.json({ customers: customersWithCounts })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
