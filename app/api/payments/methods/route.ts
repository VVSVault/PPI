import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  createCustomer,
  attachPaymentMethod,
  listPaymentMethods,
  setDefaultPaymentMethod,
  createSetupIntent,
} from '@/lib/stripe/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { payment_method_id, set_as_default } = body

    if (!payment_method_id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Create Stripe customer if doesn't exist
    let stripeCustomerId = profile.stripe_customer_id
    if (!stripeCustomerId) {
      const stripeCustomer = await createCustomer(profile.email, profile.full_name)
      stripeCustomerId = stripeCustomer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Attach payment method to customer
    const paymentMethod = await attachPaymentMethod(payment_method_id, stripeCustomerId)

    // If setting as default or first card, update Stripe customer
    const { count } = await supabase
      .from('payment_methods')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const isFirstCard = count === 0
    const shouldSetDefault = set_as_default || isFirstCard

    if (shouldSetDefault) {
      await setDefaultPaymentMethod(stripeCustomerId, payment_method_id)

      // Clear other defaults
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // Save to database
    const { data: savedMethod, error: saveError } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        stripe_payment_method_id: payment_method_id,
        card_brand: paymentMethod.card?.brand,
        card_last4: paymentMethod.card?.last4,
        card_exp_month: paymentMethod.card?.exp_month,
        card_exp_year: paymentMethod.card?.exp_year,
        is_default: shouldSetDefault,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 })
    }

    // Update profile with default payment method
    if (shouldSetDefault) {
      await supabase
        .from('profiles')
        .update({ default_payment_method_id: savedMethod.id })
        .eq('id', user.id)
    }

    return NextResponse.json({ paymentMethod: savedMethod }, { status: 201 })
  } catch (error) {
    console.error('Error saving payment method:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
