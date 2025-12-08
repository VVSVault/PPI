'use client'

import { Header, LockboxCard } from '@/components/dashboard'
import { Card, CardContent } from '@/components/ui'

const lockboxes = [
  {
    name: 'Standard Lockbox',
    slug: 'standard',
    description: 'Basic combination lockbox suitable for most properties.',
    rentalFee: 15,
    deposit: 50,
  },
  {
    name: 'Supra eKey',
    slug: 'supra-ekey',
    description:
      'Electronic lockbox compatible with Supra eKey app. Enhanced security features.',
    rentalFee: 25,
    deposit: 100,
  },
  {
    name: 'SentriLock',
    slug: 'sentrilock',
    description:
      'Bluetooth-enabled lockbox with SentriKey app integration. Real-time access tracking.',
    rentalFee: 25,
    deposit: 100,
  },
]

const terms = [
  'Lockboxes remain property of Pink Post Installations',
  'Monthly rental fee charged at beginning of each period',
  'Deposit refunded upon return in good condition',
  'Lost or damaged lockboxes will forfeit deposit',
  'Electronic lockboxes require compatible app download',
]

export default function LockboxOptionsPage() {
  return (
    <div>
      <Header title="Lockbox Options" />

      <div className="p-6">
        <p className="text-gray-600 mb-8">
          Secure key management solutions for your listings. Choose from
          traditional or electronic options.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockboxes.map((lockbox) => (
            <LockboxCard
              key={lockbox.slug}
              {...lockbox}
              onSelect={() => {
                window.location.href = `/dashboard/place-order?lockbox=${lockbox.slug}`
              }}
            />
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
