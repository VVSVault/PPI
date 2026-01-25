import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrCreateStripeCustomer, createSetupIntent } from '@/lib/stripe'

// POST /api/stripe/setup-intent - Create a SetupIntent for adding a new card
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      session.user.id,
      session.user.email!,
      session.user.name
    )

    // Create SetupIntent
    const setupIntent = await createSetupIntent(customerId)

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating setup intent:', error)
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    )
  }
}
