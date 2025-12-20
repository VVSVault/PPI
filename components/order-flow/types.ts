import type { PropertyType } from '@/types/database'

export interface RiderSelection {
  rider_type: string
  is_rental: boolean
  quantity: number
  custom_value?: string
  customer_rider_id?: string
}

export interface OrderFormData {
  // Property Info
  property_type: PropertyType | undefined
  property_address: string
  property_city: string
  property_state: string
  property_zip: string
  installation_location: string
  installation_notes: string

  // Post Selection
  post_type: 'white-vinyl' | 'black-vinyl' | 'pink-vinyl' | undefined

  // Sign Selection
  sign_option: 'stored' | 'at_property' | 'none'
  stored_sign_id?: string
  sign_description?: string

  // Rider Selection
  riders: RiderSelection[]

  // Lockbox Selection
  lockbox_option: 'sentrilock' | 'mechanical_own' | 'mechanical_rent' | 'none'
  lockbox_type?: string
  lockbox_code?: string
  customer_lockbox_id?: string

  // Brochure Box
  brochure_option: 'stored' | 'new' | 'none'
  customer_brochure_box_id?: string

  // Scheduling
  schedule_type: 'next_available' | 'specific_date' | 'expedited'
  requested_date?: string

  // Payment
  payment_method_id?: string
  save_payment_method: boolean
}

export interface StepProps {
  formData: OrderFormData
  updateFormData: (updates: Partial<OrderFormData>) => void
  inventory?: {
    signs: Array<{ id: string; description: string; size: string | null }>
    riders: Array<{ id: string; rider_type: string; quantity: number }>
    lockboxes: Array<{ id: string; lockbox_type: string; lockbox_code: string | null }>
    brochureBoxes: { quantity: number } | null
  }
  paymentMethods?: Array<{
    id: string
    card_brand: string | null
    card_last4: string | null
    is_default: boolean
  }>
  isSubmitting?: boolean
  setIsSubmitting?: (value: boolean) => void
}

export const PRICING = {
  posts: {
    'white-vinyl': 55,
    'black-vinyl': 55,
    'pink-vinyl': 65,
  },
  sign_install: 3,
  rider_rental: 5,
  rider_install: 2,
  lockbox_install: 5,
  lockbox_rental: 15,
  brochure_box_new: 23,
  brochure_box_install: 2,
  fuel_surcharge: 2.47,
  expedite_fee: 25,
} as const
