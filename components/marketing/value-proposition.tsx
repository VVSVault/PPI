'use client'

import { motion } from 'framer-motion'
import {
  Zap,
  Package,
  DollarSign,
  Calendar,
  UserCheck,
  FileX,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Next Day Installation',
    description:
      'Orders before 4pm installed next day! We strive for same day installations for an expedite fee if possible.',
  },
  {
    icon: Package,
    title: 'We Store Your Inventory',
    description:
      'Your signs, riders, and lockboxes are safe with us. Access them anytime from your dashboard.',
  },
  {
    icon: DollarSign,
    title: 'One Low Fee',
    description:
      'Includes install AND pickup! When it\'s sold, we pick it up. No surprise charges.',
  },
  {
    icon: Calendar,
    title: 'Easy Online Scheduling',
    description:
      'Book 24/7 from your dashboard. Schedule installations, removals, and service calls anytime.',
  },
  {
    icon: UserCheck,
    title: 'Full Service by Active Broker',
    description:
      'We know what you need! Run by a licensed real estate professional who understands your business.',
  },
  {
    icon: FileX,
    title: 'No Contracts Required',
    description:
      'Pay per order. Cancel anytime. No long-term commitments or hidden fees.',
  },
]

const ValueProposition = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Realtors Choose Pink Posts
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We handle the signs so you can focus on closing deals.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-pink-50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
                <feature.icon className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { ValueProposition }
