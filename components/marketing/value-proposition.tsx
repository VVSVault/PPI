'use client'

import { motion } from 'framer-motion'
import {
  Clock,
  Camera,
  Calendar,
  Palette,
  Package,
  FileCheck,
} from 'lucide-react'

const features = [
  {
    icon: Clock,
    title: 'Same-Day Installation',
    description:
      'Need a sign up fast? We\'ve got you covered with same-day service for orders placed before 12pm.',
  },
  {
    icon: Camera,
    title: 'Always Professional',
    description:
      'Every installation is photo-verified and GPS-logged for your peace of mind.',
  },
  {
    icon: Calendar,
    title: 'Easy Online Scheduling',
    description:
      'Book installations, removals, and service calls 24/7 from your dashboard.',
  },
  {
    icon: Palette,
    title: 'Flexible Options',
    description:
      'White, black, or signature pink. Choose the post style that matches your brand.',
  },
  {
    icon: Package,
    title: 'Full Inventory',
    description:
      'Signs, riders, lockboxes — all in one place. Everything you need for your listings.',
  },
  {
    icon: FileCheck,
    title: 'No Contracts Required',
    description:
      'Pay as you go. Cancel anytime. No long-term commitments or hidden fees.',
  },
]

const ValueProposition = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
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
            Why Realtors Choose Us
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
              className="group p-6 rounded-xl bg-gray-50 hover:bg-pink-50 transition-colors duration-300"
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
