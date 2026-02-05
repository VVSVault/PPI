import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-utils'
import { calculateTax } from '@/lib/stripe/server'

const FALLBACK_TAX_RATE = 0.06 // Fallback Kentucky 6% sales tax

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, expedite_fee, discount, address } = body

    if (!items || !Array.isArray(items) || !address) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: { total_price: number }) => sum + item.total_price, 0)
    const expediteFee = expedite_fee || 0
    const discountAmount = discount || 0
    const discountedSubtotal = Math.max(0, subtotal - discountAmount)
    const taxableAmount = discountedSubtotal + expediteFee

    let tax = 0
    let taxRate = 0
    let taxMethod = 'fallback'
    let jurisdiction = ''

    try {
      // Build line items for Stripe Tax calculation
      const taxLineItems = items.map((item: { total_price: number; item_type: string }, index: number) => ({
        amount: Math.round(item.total_price * 100), // Convert to cents
        reference: `item_${index}_${item.item_type}`,
        tax_code: 'txcd_99999999', // General services
      }))

      // Add expedite fee as a line item if applicable
      if (expediteFee > 0) {
        taxLineItems.push({
          amount: Math.round(expediteFee * 100),
          reference: 'expedite_fee',
          tax_code: 'txcd_99999999',
        })
      }

      // Apply discount proportionally
      if (discountAmount > 0 && taxLineItems.length > 0) {
        const discountCents = Math.round(discountAmount * 100)
        taxLineItems[0].amount = Math.max(0, taxLineItems[0].amount - discountCents)
      }

      const taxResult = await calculateTax(taxLineItems, {
        line1: address.line1 || address.property_address,
        city: address.city || address.property_city,
        state: address.state || address.property_state || 'KY',
        postal_code: address.postal_code || address.property_zip,
        country: 'US',
      })

      const stripeTax = taxResult.taxAmountExclusive / 100 // Convert back from cents

      // If Stripe Tax returns 0 (e.g., services classified as non-taxable), use fallback rate
      // Pink Posts charges 6% on all orders as a business decision
      if (stripeTax > 0) {
        tax = stripeTax
        taxMethod = 'stripe_tax'

        // Extract jurisdiction and rate from breakdown
        if (taxResult.taxBreakdown.length > 0) {
          const primaryTax = taxResult.taxBreakdown[0]
          jurisdiction = primaryTax.jurisdiction
          taxRate = parseFloat(primaryTax.rate) / 100
        }
      } else {
        // Stripe Tax returned 0, use fallback
        tax = Math.round(taxableAmount * FALLBACK_TAX_RATE * 100) / 100
        taxRate = FALLBACK_TAX_RATE
        taxMethod = 'fallback'
        jurisdiction = 'Kentucky (6% applied)'
      }
    } catch (taxError) {
      // Fallback to manual calculation
      console.warn('Stripe Tax calculation failed in preview, using fallback:', taxError)
      tax = Math.round(taxableAmount * FALLBACK_TAX_RATE * 100) / 100
      taxRate = FALLBACK_TAX_RATE
      taxMethod = 'fallback'
      jurisdiction = 'Kentucky (fallback)'
    }

    return NextResponse.json({
      tax,
      tax_rate: taxRate,
      tax_method: taxMethod,
      jurisdiction,
      taxable_amount: taxableAmount,
    })
  } catch (error) {
    console.error('Error calculating tax:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
