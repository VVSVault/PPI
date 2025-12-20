import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
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

    const body = await request.json()
    const { rider_type, custom_value, is_rental } = body

    if (!rider_type) {
      return NextResponse.json(
        { error: 'Rider type is required' },
        { status: 400 }
      )
    }

    // Verify installation belongs to user
    const { data: installation, error: fetchError } = await supabase
      .from('installations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 })
    }

    if (installation.status !== 'active') {
      return NextResponse.json(
        { error: 'Can only add riders to active installations' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('installation_riders')
      .insert({
        installation_id: id,
        rider_type,
        custom_value,
        is_rental: is_rental || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rider: data }, { status: 201 })
  } catch (error) {
    console.error('Error adding rider:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
