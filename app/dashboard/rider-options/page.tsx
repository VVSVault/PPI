'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Star, Tag, Bed, Home, Key, Sparkles, Edit, Mountain, Info, ArrowRight } from 'lucide-react'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface RiderOption {
  id: string
  name: string
  icon?: string
}

interface Category {
  id: string
  label: string
  icon: typeof Tag
  riders: RiderOption[]
}

const categories: Category[] = [
  {
    id: 'popular',
    label: 'Popular',
    icon: Star,
    riders: [
      { id: 'open-house', name: 'Open House' },
      { id: 'pending', name: 'Pending' },
      { id: 'coming-soon', name: 'Coming Soon' },
      { id: 'for-sale', name: 'For Sale' },
    ]
  },
  {
    id: 'status',
    label: 'Status',
    icon: Tag,
    riders: [
      { id: 'open-house', name: 'Open House' },
      { id: 'pending', name: 'Pending' },
      { id: 'coming-soon', name: 'Coming Soon' },
      { id: 'for-sale', name: 'For Sale' },
      { id: 'back-on-market', name: 'Back on the Market' },
      { id: 'by-appointment', name: 'By Appointment Only' },
    ]
  },
  {
    id: 'bedrooms',
    label: 'Bedrooms',
    icon: Bed,
    riders: [
      { id: '3-beds', name: '3 Beds' },
      { id: '4-beds', name: '4 Beds' },
      { id: '5-beds', name: '5 Beds' },
      { id: '6-beds', name: '6 Beds' },
    ]
  },
  {
    id: 'property',
    label: 'Property Features',
    icon: Home,
    riders: [
      { id: 'pool', name: 'Pool' },
      { id: 'spa', name: 'Spa' },
      { id: 'basement', name: 'Basement' },
      { id: 'horse-property', name: 'Horse Property' },
      { id: 'lake-front', name: 'Lake Front' },
      { id: 'large-lot', name: 'Large Lot' },
      { id: 'rv-parking', name: 'RV Parking' },
      { id: 'no-hoa', name: 'No HOA' },
    ]
  },
  {
    id: 'rental',
    label: 'Rental & Lease',
    icon: Key,
    riders: [
      { id: 'for-rent', name: 'For Rent' },
      { id: 'for-lease', name: 'For Lease' },
      { id: 'for-sale-lease', name: 'For Sale or Lease' },
    ]
  },
  {
    id: 'special',
    label: 'Special',
    icon: Sparkles,
    riders: [
      { id: 'se-habla-espanol', name: 'Se Habla Español' },
      { id: 'owner-agent', name: 'Owner/Agent' },
      { id: 'home-warranty', name: 'Home Warranty' },
      { id: 'gorgeous-inside', name: "I'm Gorgeous Inside" },
      { id: 'acreage', name: 'Acreage' },
    ]
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: Edit,
    riders: [
      { id: 'custom-acres', name: 'Custom Acres (e.g., "5 Acres")' },
    ]
  },
]

const terms = [
  'Riders remain property of Pink Post Installations',
  'Riders must be returned upon sign removal',
  'Custom riders available upon request (additional fees apply)',
  'Riders are installed at same time as post or within 24 hours',
]

function CategoryAccordion({ category, isExpanded, onToggle }: {
  category: Category
  isExpanded: boolean
  onToggle: () => void
}) {
  const Icon = category.icon

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={cn(
            'w-4 h-4',
            category.id === 'popular' ? 'text-amber-500' : 'text-gray-500'
          )} />
          <span className="font-medium text-gray-900">{category.label}</span>
          <span className="text-xs text-gray-500">({category.riders.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {category.riders.map(rider => (
            <div
              key={rider.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
            >
              <span className="text-sm font-medium text-gray-900">{rider.name}</span>
              <span className="text-xs font-medium text-pink-600">$5</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RiderOptionsPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['popular']))

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalRiders = categories.reduce((sum, cat) => sum + cat.riders.length, 0) - 4 // Subtract popular duplicates

  return (
    <div>
      <Header title="Rider Options" />

      <div className="p-6 space-y-6">
        {/* Intro */}
        <div>
          <p className="text-gray-600 mb-4">
            Add riders to your signs to communicate status and attract attention.
          </p>
          <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg">
            <Info className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Rider Pricing</p>
              <p className="text-gray-600">
                Install your own riders for <span className="font-semibold">$2</span> each,
                or rent one of our <span className="font-semibold">{totalRiders}+ riders</span> for <span className="font-semibold">$5</span> each!
              </p>
            </div>
          </div>
        </div>

        {/* Category Accordions */}
        <div className="space-y-2">
          {categories.map(category => (
            <CategoryAccordion
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>

        {/* Custom Acres Highlight */}
        <Card variant="bordered" className="border-dashed border-2">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Mountain className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Custom Acres Rider</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Need a specific acreage displayed? We can create custom riders like &quot;5 Acres&quot;, &quot;10 Acres&quot;, etc. Select this option during checkout.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/dashboard/place-order">
            <Button variant="primary" size="lg">
              Place an Order
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Terms */}
        <Card variant="bordered">
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
