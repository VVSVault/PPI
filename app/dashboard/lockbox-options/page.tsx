'use client'

import Link from 'next/link'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button } from '@/components/ui'
import { Lock, Key, ArrowRight } from 'lucide-react'

const lockboxOptions = [
  {
    name: 'SentriLock',
    slug: 'sentrilock',
    icon: Lock,
    description: 'Bluetooth-enabled electronic lockbox with SentriKey app integration and real-time access tracking.',
    price: 5,
    priceLabel: 'Install Fee',
    note: 'Customer-owned SentriLock lockboxes only',
    isRental: false,
  },
  {
    name: 'Mechanical Lockbox (Owned)',
    slug: 'mechanical-own',
    icon: Key,
    description: 'Traditional combination lockbox. Bring your own and we\'ll install it for you.',
    price: 5,
    priceLabel: 'Install Fee',
    note: 'Your lockbox, our installation',
    isRental: false,
  },
  {
    name: 'Mechanical Lockbox (Rental)',
    slug: 'mechanical-rent',
    icon: Key,
    description: 'Don\'t have a lockbox? Rent one of ours for the duration of your listing.',
    price: 15,
    priceLabel: 'Rental Fee',
    note: 'Per order, includes installation',
    isRental: true,
  },
]

const terms = [
  'Rental lockboxes remain property of Pink Post Installations',
  'Rental fee is per order, not monthly',
  'SentriLock users must have their own lockbox and SentriKey app',
  'All lockboxes are installed at the same time as your post',
]

export default function LockboxOptionsPage() {
  return (
    <div>
      <Header title="Lockbox Options" />

      <div className="p-6">
        <p className="text-gray-600 mb-8">
          Secure key management solutions for your listings. We install your lockbox or rent you one of ours.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {lockboxOptions.map((lockbox) => {
            const Icon = lockbox.icon
            return (
              <Card key={lockbox.slug} variant="bordered" className="relative overflow-hidden">
                {lockbox.isRental && (
                  <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                    Rental Available
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lockbox.name}</h3>
                      <p className="text-xs text-gray-500">{lockbox.note}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{lockbox.description}</p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-pink-600">${lockbox.price}</span>
                    <span className="text-sm text-gray-500">{lockbox.priceLabel}</span>
                  </div>

                  <Link href="/dashboard/place-order">
                    <Button size="sm" className="w-full">
                      Select & Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
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
