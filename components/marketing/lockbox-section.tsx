'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

const lockboxOptions = [
  {
    name: 'Realtor Bluetooth Lockbox',
    description: 'We install your SentriLock or Bluetooth-enabled lockbox',
    price: 5,
    image: '/images/lockboxes/bluetooth-lockbox.png',
    note: 'Your lockbox',
  },
  {
    name: 'Mechanical Lockbox',
    description: 'We install your mechanical combination lockbox',
    price: 5,
    image: '/images/lockboxes/mechanical-lockbox.png',
    note: 'Your lockbox',
  },
  {
    name: 'Rental Mechanical Lockbox',
    description: 'We provide AND install a mechanical lockbox for you',
    price: 10,
    image: '/images/lockboxes/rental-lockbox.png',
    note: 'We provide it',
  },
]

const LockboxSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-pink-100 mb-4">
            <Lock className="w-7 h-7 text-pink-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Can Install Your Lockboxes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure key management installed with your sign post
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {lockboxOptions.map((lockbox, index) => (
            <motion.div
              key={lockbox.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative bg-white">
                <Image
                  src={lockbox.image}
                  alt={lockbox.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{lockbox.name}</h3>
                  <span className="text-xs text-pink-600 font-medium bg-pink-50 px-2 py-1 rounded-full">
                    {lockbox.note}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{lockbox.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-pink-600">${lockbox.price}</span>
                  <span className="text-sm text-gray-500">
                    {lockbox.price === 10 ? 'includes lockbox + install' : 'install fee'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link href="/lockboxes">
            <Button variant="outline" size="lg">
              Learn More About Lockboxes
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export { LockboxSection }
