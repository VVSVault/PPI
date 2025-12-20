import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { detachPaymentMethod, setDefaultPaymentMethod } from '@/lib/stripe/server'

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

    const body = await request.json()
    const { is_default } = body

    // Get the payment method
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
    }

    if (is_default) {
      // Get profile for Stripe customer ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (profile?.stripe_customer_id) {
        await setDefaultPaymentMethod(
          profile.stripe_customer_id,
          paymentMethod.stripe_payment_method_id
        )
      }

      // Clear other defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', id)

      // Set this as default
      const { data: updated, error: updateError } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      // Update profile
      await supabase
        .from('profiles')
        .update({ default_payment_method_id: id })
        .eq('id', user.id)

      return NextResponse.json({ paymentMethod: updated })
    }

    return NextResponse.json({ paymentMethod })
  } catch (error) {
    console.error('Error updating payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    // Get the payment method
    const { data: paymentMethod, error: fetchError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !paymentMethod) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 })
    }

    // Detach from Stripe
    try {
      await detachPaymentMethod(paymentMethod.stripe_payment_method_id)
    } catch (stripeError) {
      console.error('Error detaching from Stripe:', stripeError)
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // If was default, set another as default
    if (paymentMethod.is_default) {
      const { data: remaining } = await supabase
        .from('payment_methods')
        .select('id, stripe_payment_method_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (remaining) {
        await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', remaining.id)

        await supabase
          .from('profiles')
          .update({ default_payment_method_id: remaining.id })
          .eq('id', user.id)
      } else {
        await supabase
          .from('profiles')
          .update({ default_payment_method_id: null })
          .eq('id', user.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
