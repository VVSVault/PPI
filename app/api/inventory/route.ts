import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all inventory types in parallel
    const [signs, riders, lockboxes, brochureBoxes] = await Promise.all([
      supabase
        .from('customer_signs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('customer_riders')
        .select('*')
        .eq('user_id', user.id)
        .order('rider_type'),
      supabase
        .from('customer_lockboxes')
        .select('*')
        .eq('user_id', user.id)
        .order('lockbox_type'),
      supabase
        .from('customer_brochure_boxes')
        .select('*')
        .eq('user_id', user.id)
        .single(),
    ])

    return NextResponse.json({
      signs: signs.data || [],
      riders: riders.data || [],
      lockboxes: lockboxes.data || [],
      brochureBoxes: brochureBoxes.data || null,
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
