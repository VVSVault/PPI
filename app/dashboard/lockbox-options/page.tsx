'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'

const lockboxOptions = [
  {
    name: 'Realtor Bluetooth Lockbox',
    slug: 'sentrilock',
    image: '/images/lockboxes/bluetooth-lockbox.png',
    description: 'We can install your Bluetooth-enabled realtor lockbox! SentriLock or similar electronic lockbox with app integration.',
    price: 5,
    priceLabel: 'Install Fee',
    note: 'Your Realtor Bluetooth Lockbox',
    isRental: false,
  },
  {
    name: 'Mechanical Lockbox (Your Own)',
    slug: 'mechanical-own',
    image: '/images/lockboxes/mechanical-lockbox.png',
    description: 'Install your mechanical combination lockbox. Bring your own and we\'ll mount it securely.',
    price: 5,
    priceLabel: 'Install Fee',
    note: 'Your lockbox, our installation',
    isRental: false,
  },
  {
    name: 'Mechanical Lockbox (Rental)',
    slug: 'mechanical-rent',
    image: '/images/lockboxes/rental-lockbox.png',
    description: 'Rent and install our mechanical lockbox! We\'ll provide and install a combination lockbox for your listing.',
    price: 10,
    priceLabel: 'Rental + Install',
    note: 'We provide the lockbox',
    isRental: true,
  },
]

const terms = [
  'Rental lockboxes remain property of Pink Posts Installations',
  'Rental lockboxes are returned when your sign is removed',
  'Bluetooth/SentriLock users must have their own lockbox and app',
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
          {lockboxOptions.map((lockbox) => (
            <Card key={lockbox.slug} variant="bordered" className="relative overflow-hidden">
              {lockbox.isRental && (
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-3 py-1 rounded-bl-lg z-10">
                  Rental Available
                </div>
              )}
              <div className="aspect-square relative bg-gray-50">
                <Image
                  src={lockbox.image}
                  alt={lockbox.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">{lockbox.name}</h3>
                  <p className="text-xs text-gray-500">{lockbox.note}</p>
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
