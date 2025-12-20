import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'
import { createCustomer, createSetupIntent } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Stripe customer if doesn't exist
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const stripeCustomer = await createCustomer(user.email, user.fullName || user.name || '')
      stripeCustomerId = stripeCustomer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // Create setup intent
    const setupIntent = await createSetupIntent(stripeCustomerId)

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating setup intent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
