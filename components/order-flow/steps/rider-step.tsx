'use client'

import { useCallback, useMemo } from 'react'
import { RiderSelector, RIDERS, type SelectedRider } from '../RiderSelector'
import type { StepProps, RiderSelection } from '../types'
import { PRICING } from '../types'

// Convert from RiderSelector format to order form format
function toRiderSelection(selected: SelectedRider): RiderSelection {
  const rider = RIDERS.find(r => r.id === selected.riderId)
  return {
    rider_type: rider?.slug || selected.riderId,
    is_rental: selected.source === 'rental',
    quantity: 1,
    custom_value: selected.customValue?.toString(),
  }
}

// Convert from order form format to RiderSelector format
function toSelectedRider(selection: RiderSelection): SelectedRider | null {
  // Find the rider by slug (try popular version first, then regular)
  let rider = RIDERS.find(r => r.slug === selection.rider_type && r.category === 'popular')
  if (!rider) {
    rider = RIDERS.find(r => r.slug === selection.rider_type)
  }

  if (!rider) return null

  return {
    riderId: rider.id,
    source: selection.is_rental ? 'rental' : 'owned',
    price: selection.is_rental ? PRICING.rider_rental : PRICING.rider_install,
    customValue: selection.custom_value ? parseFloat(selection.custom_value) || selection.custom_value : undefined,
  }
}

export function RiderStep({ formData, updateFormData, inventory }: StepProps) {
  // Convert inventory riders to CustomerRiderInventory format
  const customerInventory = useMemo(() => {
    return inventory?.riders?.map(rider => ({
      id: rider.id,
      riderType: rider.rider_type,
      quantity: rider.quantity,
    })) || []
  }, [inventory?.riders])

  // Convert form data riders to SelectedRider format
  const selectedRiders = useMemo(() => {
    return formData.riders
      .map(toSelectedRider)
      .filter((r): r is SelectedRider => r !== null)
  }, [formData.riders])

  // Handle selection changes from RiderSelector
  const handleSelectionChange = useCallback((newSelection: SelectedRider[]) => {
    const riderSelections = newSelection.map(toRiderSelection)
    updateFormData({ riders: riderSelections })
  }, [updateFormData])

  return (
    <RiderSelector
      selectedRiders={selectedRiders}
      onSelectionChange={handleSelectionChange}
      customerInventory={customerInventory}
      rentalPrice={PRICING.rider_rental}
      installPrice={PRICING.rider_install}
    />
  )
}
