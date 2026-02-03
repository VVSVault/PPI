'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'
import { Shield, Lock, Eye, Phone } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your privacy is important to us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card variant="bordered">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Data Sales</h3>
                <p className="text-sm text-gray-600">
                  We do not sell your personal information to third parties.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Storage</h3>
                <p className="text-sm text-gray-600">
                  Login information is stored securely for profile and inventory purposes.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
                <p className="text-sm text-gray-600">
                  We&apos;re clear about what data we collect and how we use it.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Full Policy */}
          <Card variant="bordered">
            <CardContent className="p-8 space-y-6">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-600">
                  Pink Posts collects information necessary to provide our sign installation services,
                  including:
                </p>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Name and contact information (email, phone number)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Property addresses for installations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Order history and preferences
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Payment information (processed securely through Stripe)
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600">
                  Your information is used solely for:
                </p>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Processing and fulfilling your orders
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Managing your account and inventory
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Communicating about your orders and services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    Improving our services
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Data Protection
                </h2>
                <p className="text-gray-600">
                  <strong>Pink Posts does not sell your personal information.</strong> Login information
                  is stored solely for profile and inventory purposes. We implement appropriate security
                  measures to protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Security
                </h2>
                <p className="text-gray-600">
                  All payment information is processed securely through Stripe. We never store your
                  full credit card numbers on our servers. Only payment references are kept for
                  transaction records.
                </p>
              </section>

              <section className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                  <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                  <p className="text-gray-700">
                    For more questions or concerns about your privacy, contact us at{' '}
                    <a href="tel:859-395-8188" className="text-pink-600 hover:text-pink-700 font-semibold">
                      859-395-8188
                    </a>
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
