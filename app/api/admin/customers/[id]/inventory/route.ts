import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  customerSignSchema,
  customerRiderSchema,
  customerLockboxSchema,
  customerBrochureBoxSchema,
} from '@/lib/validations'

async function isAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'admin'
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type, ...data } = body

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    let result
    switch (type) {
      case 'sign': {
        const validated = customerSignSchema.safeParse(data)
        if (!validated.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validated.error.errors },
            { status: 400 }
          )
        }
        result = await supabase
          .from('customer_signs')
          .insert({ user_id: customerId, ...validated.data })
          .select()
          .single()
        break
      }
      case 'rider': {
        const validated = customerRiderSchema.safeParse(data)
        if (!validated.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validated.error.errors },
            { status: 400 }
          )
        }
        result = await supabase
          .from('customer_riders')
          .insert({ user_id: customerId, ...validated.data })
          .select()
          .single()
        break
      }
      case 'lockbox': {
        const validated = customerLockboxSchema.safeParse(data)
        if (!validated.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validated.error.errors },
            { status: 400 }
          )
        }
        result = await supabase
          .from('customer_lockboxes')
          .insert({ user_id: customerId, ...validated.data })
          .select()
          .single()
        break
      }
      case 'brochure_box': {
        const validated = customerBrochureBoxSchema.safeParse(data)
        if (!validated.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validated.error.errors },
            { status: 400 }
          )
        }
        // Check if exists, update or insert
        const { data: existing } = await supabase
          .from('customer_brochure_boxes')
          .select('*')
          .eq('user_id', customerId)
          .single()

        if (existing) {
          result = await supabase
            .from('customer_brochure_boxes')
            .update({ quantity: validated.data.quantity })
            .eq('id', existing.id)
            .select()
            .single()
        } else {
          result = await supabase
            .from('customer_brochure_boxes')
            .insert({ user_id: customerId, ...validated.data })
            .select()
            .single()
        }
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ item: result.data }, { status: 201 })
  } catch (error) {
    console.error('Error adding inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type, item_id, ...data } = body

    if (!type || !item_id) {
      return NextResponse.json(
        { error: 'Type and item_id are required' },
        { status: 400 }
      )
    }

    let tableName: string
    switch (type) {
      case 'sign':
        tableName = 'customer_signs'
        break
      case 'rider':
        tableName = 'customer_riders'
        break
      case 'lockbox':
        tableName = 'customer_lockboxes'
        break
      case 'brochure_box':
        tableName = 'customer_brochure_boxes'
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { data: item, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', item_id)
      .eq('user_id', customerId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(supabase, user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const itemId = searchParams.get('item_id')

    if (!type || !itemId) {
      return NextResponse.json(
        { error: 'Type and item_id are required' },
        { status: 400 }
      )
    }

    let tableName: string
    switch (type) {
      case 'sign':
        tableName = 'customer_signs'
        break
      case 'rider':
        tableName = 'customer_riders'
        break
      case 'lockbox':
        tableName = 'customer_lockboxes'
        break
      case 'brochure_box':
        tableName = 'customer_brochure_boxes'
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', itemId)
      .eq('user_id', customerId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
