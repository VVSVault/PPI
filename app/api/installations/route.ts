import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('installations')
      .select(`
        *,
        installation_riders(*),
        installation_lockboxes(*)
      `)
      .eq('user_id', user.id)
      .order('installation_date', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ installations: data })
  } catch (error) {
    console.error('Error fetching installations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
