import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'admin'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    ).toISOString()
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    ).toISOString()

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
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer'),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfWeek),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'confirmed']),
      supabase
        .from('installations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', startOfDay)
        .eq('payment_status', 'succeeded'),
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', startOfWeek)
        .eq('payment_status', 'succeeded'),
      supabase
        .from('orders')
        .select('total')
        .gte('created_at', startOfMonth)
        .eq('payment_status', 'succeeded'),
    ])

    const calculateRevenue = (data: { total: number }[] | null) =>
      (data || []).reduce((sum, order) => sum + (order.total || 0), 0)

    return NextResponse.json({
      totalCustomers: totalCustomers.count || 0,
      orders: {
        today: ordersToday.count || 0,
        thisWeek: ordersThisWeek.count || 0,
        thisMonth: ordersThisMonth.count || 0,
        pending: pendingOrders.count || 0,
      },
      activeInstallations: activeInstallations.count || 0,
      revenue: {
        today: calculateRevenue(revenueToday.data),
        thisWeek: calculateRevenue(revenueThisWeek.data),
        thisMonth: calculateRevenue(revenueThisMonth.data),
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
