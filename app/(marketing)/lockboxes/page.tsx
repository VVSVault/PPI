'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from '@/components/ui'
import { ArrowRight, Check } from 'lucide-react'

const lockboxOptions = [
  {
    name: 'Realtor Bluetooth Lockbox',
    description: 'We can install your Bluetooth-enabled realtor lockbox. Bring your own SentriLock or similar electronic lockbox and we\'ll mount it securely.',
    price: 5,
    priceLabel: 'Installation Fee',
    image: '/images/lockboxes/bluetooth-lockbox.png',
    features: [
      'Professional installation',
      'Secure mounting',
      'Compatible with SentriKey app',
      'Your lockbox, our service',
    ],
  },
  {
    name: 'Mechanical Lockbox (Your Own)',
    description: 'Install your own mechanical combination lockbox. Perfect for agents who already own a lockbox and need installation service.',
    price: 5,
    priceLabel: 'Installation Fee',
    image: '/images/lockboxes/mechanical-lockbox.png',
    features: [
      'Professional installation',
      'Secure mounting',
      'Any combination lockbox',
      'Your lockbox, our service',
    ],
  },
  {
    name: 'Mechanical Lockbox (Rental)',
    description: 'Don\'t have a lockbox? Rent one of ours! We\'ll provide and install a mechanical combination lockbox for your listing.',
    price: 10,
    priceLabel: 'Rental + Installation',
    image: '/images/lockboxes/rental-lockbox.png',
    features: [
      'Lockbox provided',
      'Professional installation',
      'Includes secure mounting',
      'Returned at sign removal',
    ],
    isRental: true,
  },
]

export default function LockboxesPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Lockbox Services
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Secure key management solutions for your listings. We install your lockbox or provide one of ours.
          </p>
        </motion.div>

        {/* Lockbox Options */}
        <div className="grid md:grid-cols-3 gap-6">
          {lockboxOptions.map((lockbox, index) => (
            <motion.div
              key={lockbox.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="bordered" className="h-full relative overflow-hidden">
                {lockbox.isRental && (
                  <div className="absolute top-0 right-0 bg-pink-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium z-10">
                    We Provide
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-full h-48 relative bg-gray-50 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={lockbox.image}
                      alt={lockbox.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {lockbox.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {lockbox.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-4">
                      {lockbox.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-pink-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-pink-600">
                        ${lockbox.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {lockbox.priceLabel}
                      </span>
                    </div>

                    <Link href="/sign-up" className="mt-auto">
                      <Button className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card variant="bordered">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Important Information
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  Lockboxes are installed at the same time as your post
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  Rental lockboxes remain property of Pink Posts Installations
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  All lockboxes are returned when your sign is removed
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  SentriLock users must have their own lockbox and SentriKey app
                </li>
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
          <p className="text-gray-600 mb-4">
            Ready to get started? Create your free account today.
          </p>
          <Link href="/sign-up">
            <Button size="lg">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
