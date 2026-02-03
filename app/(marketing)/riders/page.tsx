'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, Button } from '@/components/ui'
import Link from 'next/link'

interface RiderDisplay {
  name: string
  slug: string
  price: number
  color: string
  isCustom?: boolean
}

const riders: RiderDisplay[] = [
  // Status
  { name: 'SOLD', slug: 'sold', price: 5, color: 'bg-green-600' },
  { name: 'Pending', slug: 'pending', price: 5, color: 'bg-yellow-500' },
  { name: 'Coming Soon', slug: 'coming-soon', price: 5, color: 'bg-purple-500' },
  { name: 'For Sale', slug: 'for-sale', price: 5, color: 'bg-blue-500' },
  { name: 'Under Contract', slug: 'under-contract', price: 5, color: 'bg-green-500' },
  { name: 'Under Contract, Taking Backups', slug: 'under-contract-backups', price: 5, color: 'bg-green-500' },
  { name: 'Price Reduced', slug: 'price-reduced', price: 5, color: 'bg-orange-500' },
  { name: 'New Listing', slug: 'new-listing', price: 5, color: 'bg-pink-500' },
  { name: 'By Appointment Only', slug: 'by-appointment', price: 5, color: 'bg-gray-500' },
  // Bedrooms
  { name: '3 Beds', slug: '3-beds', price: 5, color: 'bg-indigo-500' },
  { name: '4 Beds', slug: '4-beds', price: 5, color: 'bg-indigo-500' },
  { name: '5 Beds', slug: '5-beds', price: 5, color: 'bg-indigo-500' },
  { name: '6 Beds', slug: '6-beds', price: 5, color: 'bg-indigo-500' },
  // Property Features
  { name: 'Pool/Spa', slug: 'pool-spa', price: 5, color: 'bg-cyan-500' },
  { name: 'Basement', slug: 'basement', price: 5, color: 'bg-stone-500' },
  { name: 'Furnished', slug: 'furnished', price: 5, color: 'bg-amber-500' },
  { name: 'Huge Backyard', slug: 'huge-backyard', price: 5, color: 'bg-emerald-500' },
  { name: 'Horse Property', slug: 'horse-property', price: 5, color: 'bg-amber-600' },
  { name: 'Waterfront', slug: 'waterfront', price: 5, color: 'bg-sky-500' },
  { name: 'Golf Course', slug: 'golf-course', price: 5, color: 'bg-green-500' },
  { name: 'Large Lot', slug: 'large-lot', price: 5, color: 'bg-lime-500' },
  { name: 'RV Parking', slug: 'rv-parking', price: 5, color: 'bg-slate-500' },
  // Rental & Lease
  { name: 'For Rent', slug: 'for-rent', price: 5, color: 'bg-teal-500' },
  { name: 'For Sale or Lease', slug: 'for-sale-lease', price: 5, color: 'bg-teal-600' },
  // Special
  { name: 'Se Habla Español', slug: 'se-habla-espanol', price: 5, color: 'bg-red-500' },
  { name: 'Owner/Agent', slug: 'owner-agent', price: 5, color: 'bg-violet-500' },
  { name: 'Home Warranty', slug: 'home-warranty', price: 5, color: 'bg-blue-600' },
  { name: "I'm Gorgeous Inside", slug: 'gorgeous-inside', price: 5, color: 'bg-pink-400' },
  { name: 'Neighborhood Specialist', slug: 'neighborhood-specialist', price: 5, color: 'bg-rose-500' },
  { name: 'Acreage', slug: 'acreage', price: 5, color: 'bg-green-700' },
  // Custom
  { name: 'Custom Acres', slug: 'custom-acres', price: 5, color: 'bg-emerald-600', isCustom: true },
  { name: 'Car Garage', slug: 'car-garage', price: 5, color: 'bg-gray-600', isCustom: true },
]

const terms = [
  'Riders remain property of Pink Posts Installations',
  'Riders must be returned upon sign removal',
  'Custom riders available upon request (additional fees apply)',
  'Riders are installed at same time as post or within 24 hours',
]

export default function RidersPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Rider Options
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Add riders to your signs to communicate status and attract attention.
            All riders are <span className="font-semibold text-pink-600">$5 each</span> to rent.
          </p>
        </motion.div>

        {/* Riders Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {riders.map((rider, index) => (
            <motion.div
              key={rider.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
            >
              <Card variant="interactive" className="h-full">
                <CardContent className="p-0">
                  {/* Rider Visual */}
                  <div className="bg-gray-50 p-6 flex items-center justify-center">
                    <div
                      className={`${rider.color} px-6 py-3 rounded shadow-md`}
                    >
                      <span className="text-white font-bold text-sm text-center">
                        {rider.isCustom ? `[#] ${rider.name.replace('Custom ', '')}` : rider.name.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900">{rider.name}</h3>
                    {rider.isCustom && (
                      <p className="text-xs text-gray-500 mt-1">Enter your own number</p>
                    )}
                    <p className="mt-1 text-lg font-bold text-pink-600">
                      ${rider.price}.00
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Terms Section */}
        <motion.div
          id="terms"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 scroll-mt-8"
        >
          <Card variant="bordered">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Rental Terms & Conditions
              </h2>
              <ul className="space-y-3">
                {terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-600">
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
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/sign-up">
            <Button size="lg">Get Started with Riders</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
