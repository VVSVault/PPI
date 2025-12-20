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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get all stats in parallel
    const [
      totalCustomers,
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      pendingOrders,
      activeInstallations,
      revenueToday,
      revenueThisWeek,
      revenueThisMonth,
      pendingServiceRequests,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: 'customer' },
      }),
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      prisma.order.count({
        where: { status: { in: ['pending', 'confirmed'] } },
      }),
      prisma.installation.count({
        where: { status: 'active' },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: today },
          paymentStatus: 'succeeded',
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfWeek },
          paymentStatus: 'succeeded',
        },
        select: { total: true },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          paymentStatus: 'succeeded',
        },
        select: { total: true },
      }),
      prisma.serviceRequest.count({
        where: { status: { in: ['pending', 'acknowledged'] } },
      }),
    ])

    const calculateRevenue = (orders: { total: any }[]) =>
      orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

    return NextResponse.json({
      totalCustomers,
      orders: {
        today: ordersToday,
        thisWeek: ordersThisWeek,
        thisMonth: ordersThisMonth,
        pending: pendingOrders,
      },
      activeInstallations,
      revenue: {
        today: calculateRevenue(revenueToday),
        thisWeek: calculateRevenue(revenueThisWeek),
        thisMonth: calculateRevenue(revenueThisMonth),
      },
      pendingServiceRequests,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
