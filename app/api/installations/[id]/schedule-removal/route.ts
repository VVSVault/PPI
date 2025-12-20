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
    const { removal_date } = body

    if (!removal_date) {
      return NextResponse.json(
        { error: 'Removal date is required' },
        { status: 400 }
      )
    }

    // Get the installation
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
        { error: 'Can only schedule removal for active installations' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('installations')
      .update({
        status: 'removal_scheduled',
        removal_scheduled_date: removal_date,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ installation: data })
  } catch (error) {
    console.error('Error scheduling removal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
