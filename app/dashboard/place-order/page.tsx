'use client'

import { useState } from 'react'
import { Header, CalendlyPlaceholder } from '@/components/dashboard'
import { Card, CardContent, Button, Select } from '@/components/ui'
import { Plus, Calendar, Wrench } from 'lucide-react'

type OrderType = 'installation' | 'removal' | 'service'

const orderTypes = [
  {
    id: 'installation' as OrderType,
    title: 'New Installation',
    description: 'Install a new sign at a property',
    icon: Plus,
  },
  {
    id: 'removal' as OrderType,
    title: 'Schedule Removal',
    description: 'Remove an existing sign from a property',
    icon: Calendar,
  },
  {
    id: 'service' as OrderType,
    title: 'Request Service',
    description: 'Repair, replace, or service a sign',
    icon: Wrench,
  },
]

// Mock active installations for removal scheduling
const activeInstallations = [
  { value: '1', label: '1245 Richmond Rd, Lexington, KY 40502' },
  { value: '2', label: '890 Tates Creek Rd, Lexington, KY 40517' },
  { value: '3', label: '456 Man O War Blvd, Lexington, KY 40509' },
]

export default function PlaceOrderPage() {
  const [selectedType, setSelectedType] = useState<OrderType | null>(null)
  const [selectedInstallation, setSelectedInstallation] = useState('')

  return (
    <div>
      <Header title="Place an Order" />

      <div className="p-6">
        <p className="text-gray-600 mb-8">
          What would you like to schedule?
        </p>

        {/* Order Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {orderTypes.map((type) => (
            <Card
              key={type.id}
              variant={selectedType === type.id ? 'bordered' : 'default'}
              className={`cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'ring-2 ring-pink-500 bg-pink-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    selectedType === type.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <type.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {type.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Form based on selection */}
        {selectedType && (
          <Card variant="bordered">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {selectedType === 'installation' && 'Schedule New Installation'}
                {selectedType === 'removal' && 'Schedule Removal'}
                {selectedType === 'service' && 'Request Service'}
              </h2>

              {/* Removal or Service - Select existing installation */}
              {(selectedType === 'removal' || selectedType === 'service') && (
                <div className="mb-6">
                  <Select
                    label="Select Installation"
                    options={activeInstallations}
                    value={selectedInstallation}
                    onChange={(e) => setSelectedInstallation(e.target.value)}
                    placeholder="Choose an active installation"
                  />
                </div>
              )}

              {/* Service Type Selection */}
              {selectedType === 'service' && (
                <div className="mb-6">
                  <Select
                    label="Service Type"
                    options={[
                      { value: 'repair', label: 'Repair damaged post' },
                      { value: 'replace', label: 'Replace post' },
                      { value: 'rider-add', label: 'Add rider' },
                      { value: 'rider-remove', label: 'Remove rider' },
                      { value: 'rider-change', label: 'Change rider' },
                      { value: 'other', label: 'Other (describe below)' },
                    ]}
                    placeholder="Select service type"
                  />
                </div>
              )}

              {/* Service Notes */}
              {selectedType === 'service' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notes / Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Describe the issue or what you need..."
                  />
                </div>
              )}

              {/* Calendly Embed */}
              {selectedType === 'installation' && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Select an available date and time for your installation.
                  </p>
                  <CalendlyPlaceholder />
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Configure your Calendly URL in the environment settings to
                    enable live scheduling.
                  </p>
                </div>
              )}

              {selectedType === 'removal' && selectedInstallation && (
                <div>
                  <p className="text-gray-600 mb-4">
                    Select a date for the sign removal.
                  </p>
                  <CalendlyPlaceholder />
                </div>
              )}

              {selectedType === 'service' && selectedInstallation && (
                <div className="mt-6">
                  <Button size="lg" className="w-full md:w-auto">
                    Submit Service Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
