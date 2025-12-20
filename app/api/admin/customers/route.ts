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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
      )
    }

    const { data: customers, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get counts for each customer
    const customerIds = customers.map((c) => c.id)

    const [signs, riders, lockboxes, orders] = await Promise.all([
      supabase
        .from('customer_signs')
        .select('user_id, quantity')
        .in('user_id', customerIds),
      supabase
        .from('customer_riders')
        .select('user_id, quantity')
        .in('user_id', customerIds),
      supabase
        .from('customer_lockboxes')
        .select('user_id, quantity')
        .in('user_id', customerIds),
      supabase
        .from('orders')
        .select('user_id')
        .in('user_id', customerIds),
    ])

    // Calculate totals per customer
    const customersWithCounts = customers.map((customer) => {
      const signCount = (signs.data || [])
        .filter((s) => s.user_id === customer.id)
        .reduce((sum, s) => sum + s.quantity, 0)

      const riderCount = (riders.data || [])
        .filter((r) => r.user_id === customer.id)
        .reduce((sum, r) => sum + r.quantity, 0)

      const lockboxCount = (lockboxes.data || [])
        .filter((l) => l.user_id === customer.id)
        .reduce((sum, l) => sum + l.quantity, 0)

      const orderCount = (orders.data || []).filter(
        (o) => o.user_id === customer.id
      ).length

      return {
        ...customer,
        sign_count: signCount,
        rider_count: riderCount,
        lockbox_count: lockboxCount,
        order_count: orderCount,
      }
    })

    return NextResponse.json({ customers: customersWithCounts })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
