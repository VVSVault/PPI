'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, Button } from '@/components/ui'
import Link from 'next/link'

const riders = [
  { name: 'Open House', slug: 'open-house', price: 5, color: 'bg-blue-500' },
  { name: 'Coming Soon', slug: 'coming-soon', price: 5, color: 'bg-purple-500' },
  { name: 'Price Reduced', slug: 'price-reduced', price: 5, color: 'bg-orange-500' },
  { name: 'Under Contract', slug: 'under-contract', price: 5, color: 'bg-green-500' },
  { name: 'Pending', slug: 'pending', price: 5, color: 'bg-yellow-500' },
  { name: 'New Listing', slug: 'new-listing', price: 5, color: 'bg-pink-500' },
  { name: 'For Lease', slug: 'for-lease', price: 5, color: 'bg-teal-500' },
]

const terms = [
  'Riders remain property of Pink Post Installations',
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
          </p>
        </motion.div>

        {/* Riders Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {riders.map((rider, index) => (
            <motion.div
              key={rider.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card variant="interactive" className="h-full">
                <CardContent className="p-0">
                  {/* Rider Visual */}
                  <div className="bg-gray-50 p-6 flex items-center justify-center">
                    <div
                      className={`${rider.color} px-6 py-3 rounded shadow-md`}
                    >
                      <span className="text-white font-bold text-sm">
                        {rider.name.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900">{rider.name}</h3>
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
