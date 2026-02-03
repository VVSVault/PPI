'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui'

export default function TermsPage() {
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
            Terms and Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Please read these terms carefully before using our services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="bordered">
            <CardContent className="p-8 space-y-8">
              {/* Order Processing */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Processing & Installation
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Orders placed before <strong>4pm EST</strong> will receive next business day installation.
                    Rush orders are subject to availability.
                  </p>
                  <p>
                    Business days are <strong>Monday through Saturday</strong>. Sunday we are closed.
                    Any orders made after 4pm EST on Saturday will be installed Monday.
                  </p>
                </div>
              </section>

              {/* HOA Notice */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  HOA Regulations
                </h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-gray-700">
                    Homes located in a subdivision governed by an HOA may have additional regulations
                    about sign type, placement, height, etc. <strong>It is your responsibility to advise us
                    if there are restrictions from the HOA regarding this installation.</strong>
                  </p>
                </div>
              </section>

              {/* Utility Lines */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Utility Lines & Kentucky 811
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Kentucky 811 marks buried utility lines (power, gas, water lines in metal pipe,
                    telephone and television cable) if you or your homeowner orders their service.
                  </p>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Important:</strong> If you choose not to use this free service, Pink Posts
                      will not be responsible for the repair expenses related to damaged utility lines.
                      You will be billed for any repair bills sent to Pink Posts for such repairs.
                    </p>
                  </div>
                  <p>
                    <strong>PVC water lines are undetectable.</strong> Every time we install a post, we risk
                    hitting water lines. Pink Posts will not reimburse a homeowner or agent for any expenses,
                    damages or repairs (i.e., water bill, lost plants, plumber&apos;s bill).
                  </p>
                </div>
              </section>

              {/* Rider Terms */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Rider Rental Terms
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Riders remain property of Pink Posts Installations
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Riders must be returned upon sign removal
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom riders available upon request (additional fees apply)
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Riders are installed at same time as post or within 24 hours
                  </li>
                </ul>
              </section>

              {/* Contact */}
              <section className="pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  For questions or concerns, contact us at{' '}
                  <a href="tel:859-395-8188" className="text-pink-600 hover:text-pink-700 font-semibold">
                    859-395-8188
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
