'use client'

import { useState, useEffect } from 'react'
import { Modal, Badge, Button } from '@/components/ui'
import { MapPin, Calendar, Package, Lock, Loader2, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface InstallationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  installationId: string | null
}

interface InstallationDetails {
  id: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  installedAt: string
  status: string
  removalDate: string | null
  order: {
    orderNumber: string
    postType: {
      name: string
    }
    orderItems: Array<{
      id: string
      description: string
      quantity: number
    }>
  }
  riders: Array<{
    id: string
    isRental: boolean
    installedAt: string
    rider: {
      name: string
    }
  }>
  lockboxes: Array<{
    id: string
    isRental: boolean
    code: string | null
    lockboxType: {
      name: string
    }
  }>
  serviceRequests: Array<{
    id: string
    type: string
    status: string
    createdAt: string
  }>
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' | 'info' }> = {
  active: { label: 'Active', variant: 'success' },
  removal_scheduled: { label: 'Removal Scheduled', variant: 'warning' },
  removed: { label: 'Removed', variant: 'neutral' },
}

const requestStatusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' | 'info' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  acknowledged: { label: 'Acknowledged', variant: 'info' },
  scheduled: { label: 'Scheduled', variant: 'info' },
  in_progress: { label: 'In Progress', variant: 'info' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'neutral' },
}

export function InstallationDetailsModal({
  isOpen,
  onClose,
  installationId,
}: InstallationDetailsModalProps) {
  const [installation, setInstallation] = useState<InstallationDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && installationId) {
      fetchDetails()
    }
  }, [isOpen, installationId])

  const fetchDetails = async () => {
    if (!installationId) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/installations/${installationId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch installation details')
      }
      const data = await res.json()
      setInstallation(data.installation)
    } catch (err) {
      setError('Could not load installation details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Installation Details">
      <div className="max-h-[70vh] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 py-8 justify-center">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {installation && !loading && (
          <div className="space-y-6">
            {/* Status & Order Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order #{installation.order.orderNumber}</p>
                <p className="font-semibold text-gray-900">{installation.order.postType.name}</p>
              </div>
              <Badge variant={statusConfig[installation.status]?.variant || 'neutral'}>
                {statusConfig[installation.status]?.label || installation.status}
              </Badge>
            </div>

            {/* Property Address */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Installation Address</p>
                <p className="font-medium text-gray-900">{installation.propertyAddress}</p>
                <p className="text-gray-600">
                  {installation.propertyCity}, {installation.propertyState} {installation.propertyZip}
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Installed</p>
                    <p className="font-medium text-gray-900">{formatDate(installation.installedAt)}</p>
                  </div>
                  {installation.removalDate && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Removal Scheduled</p>
                      <p className="font-medium text-amber-600">{formatDate(installation.removalDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Riders */}
            {installation.riders.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Riders ({installation.riders.length})</p>
                </div>
                <ul className="space-y-2">
                  {installation.riders.map((rider) => (
                    <li key={rider.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{rider.rider.name}</span>
                      {rider.isRental && (
                        <Badge variant="info">Rental</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lockboxes */}
            {installation.lockboxes.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Lockboxes ({installation.lockboxes.length})</p>
                </div>
                <ul className="space-y-2">
                  {installation.lockboxes.map((lockbox) => (
                    <li key={lockbox.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{lockbox.lockboxType.name}</span>
                      <div className="flex items-center gap-2">
                        {lockbox.code && (
                          <span className="text-gray-500">Code: {lockbox.code}</span>
                        )}
                        {lockbox.isRental && (
                          <Badge variant="info">Rental</Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Service Requests */}
            {installation.serviceRequests.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-3">Service History</p>
                <ul className="space-y-2">
                  {installation.serviceRequests.map((request) => (
                    <li key={request.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-700 capitalize">{request.type}</span>
                        <span className="text-gray-400 ml-2">{formatDate(request.createdAt)}</span>
                      </div>
                      <Badge variant={requestStatusConfig[request.status]?.variant || 'neutral'}>
                        {requestStatusConfig[request.status]?.label || request.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
