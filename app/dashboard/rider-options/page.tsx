'use client'

import { Header, RiderCard } from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui'

const riders = [
  { name: 'SOLD', slug: 'sold', price: 5 },
  { name: 'Open House', slug: 'open-house', price: 5 },
  { name: 'Coming Soon', slug: 'coming-soon', price: 5 },
  { name: 'Price Reduced', slug: 'price-reduced', price: 5 },
  { name: 'Under Contract', slug: 'under-contract', price: 5 },
  { name: 'Pending', slug: 'pending', price: 5 },
  { name: 'New Listing', slug: 'new-listing', price: 5 },
  { name: 'For Lease', slug: 'for-lease', price: 5 },
]

const terms = [
  'Riders remain property of Pink Post Installations',
  'Riders must be returned upon sign removal',
  'Lost/damaged riders will incur replacement fee',
  'Custom riders available upon request (additional fees apply)',
  'Riders are installed at same time as post or within 24 hours',
]

export default function RiderOptionsPage() {
  return (
    <div>
      <Header title="Rider Options" />

      <div className="p-6">
        <p className="text-gray-600 mb-8">
          Add riders to your signs to communicate status and attract attention.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {riders.map((rider) => (
            <RiderCard
              key={rider.slug}
              {...rider}
              onSelect={() => {
                // Add to cart or navigate to place order
                window.location.href = `/dashboard/place-order?rider=${rider.slug}`
              }}
            />
          ))}
        </div>

        {/* Terms */}
        <Card variant="bordered" className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Terms & Conditions
            </h2>
            <ul className="space-y-3">
              {terms.map((term, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-600"
                >
                  <svg
                    className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {term}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
