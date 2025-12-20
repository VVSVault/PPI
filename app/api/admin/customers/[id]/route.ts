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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get customer profile
    const { data: customer, error: customerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Get all inventory and related data
    const [signs, riders, lockboxes, brochureBoxes, orders, installations] =
      await Promise.all([
        supabase
          .from('customer_signs')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('customer_riders')
          .select('*')
          .eq('user_id', id)
          .order('rider_type'),
        supabase
          .from('customer_lockboxes')
          .select('*')
          .eq('user_id', id)
          .order('lockbox_type'),
        supabase
          .from('customer_brochure_boxes')
          .select('*')
          .eq('user_id', id)
          .single(),
        supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('installations')
          .select('*, installation_riders(*), installation_lockboxes(*)')
          .eq('user_id', id)
          .order('installation_date', { ascending: false }),
      ])

    return NextResponse.json({
      customer,
      inventory: {
        signs: signs.data || [],
        riders: riders.data || [],
        lockboxes: lockboxes.data || [],
        brochureBoxes: brochureBoxes.data || null,
      },
      orders: orders.data || [],
      installations: installations.data || [],
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
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const allowedFields = ['full_name', 'phone', 'company_name', 'license_number']
    const updateData: Record<string, unknown> = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: customer, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
