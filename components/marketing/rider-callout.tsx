'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'

const RiderCallout = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                <Tag className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Full Rider Selection
                </h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold text-gray-900">Sold</span>
                  {' • '}
                  <span className="font-semibold text-gray-900">Pending</span>
                  {' • '}
                  <span className="font-semibold text-gray-900">Coming Soon</span>
                  {' • '}
                  <span className="text-pink-600 font-medium">24 more options</span>
                </p>
                <p className="text-gray-600">
                  Rent ours for{' '}
                  <span className="font-bold text-pink-600">$5</span>
                  {' '}or we&apos;ll install yours for{' '}
                  <span className="font-bold text-pink-600">$2</span>
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Choose from status tags, bedroom counts, property features, and more during checkout
              </p>
              <Link href="/sign-up" className="flex-shrink-0">
                <Button variant="primary" size="md">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export { RiderCallout }
