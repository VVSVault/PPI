'use client'

import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Button,
} from '@/components/ui'
import { MoreVertical, Calendar, Wrench, Eye, MapPin, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  InstallationDetailsModal,
  ScheduleRemovalModal,
  RequestServiceModal,
} from './installation-modals'

interface Installation {
  id: string
  installDate: string
  address: string
  city: string
  state: string
  zip: string
  agentRef: string
  mlsNumber: string
  status: 'active' | 'scheduled' | 'removal_scheduled' | 'removed'
  postType: string
}

interface ActivePostsTableProps {
  installations: Installation[]
  onRefresh?: () => void
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const },
  scheduled: { label: 'Scheduled', variant: 'info' as const },
  removal_scheduled: { label: 'Removal Scheduled', variant: 'warning' as const },
  removed: { label: 'Removed', variant: 'neutral' as const },
}

const ActivePostsTable = ({ installations, onRefresh }: ActivePostsTableProps) => {
  const [actionInstallation, setActionInstallation] = useState<Installation | null>(null)
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showRemovalModal, setShowRemovalModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)

  const handleViewDetails = (installation: Installation) => {
    setSelectedInstallation(installation)
    setShowDetailsModal(true)
    setActionInstallation(null)
  }

  const handleScheduleRemoval = (installation: Installation) => {
    setSelectedInstallation(installation)
    setShowRemovalModal(true)
    setActionInstallation(null)
  }

  const handleRequestService = (installation: Installation) => {
    setSelectedInstallation(installation)
    setShowServiceModal(true)
    setActionInstallation(null)
  }

  const handleModalSuccess = () => {
    onRefresh?.()
  }

  const getFullAddress = (installation: Installation) => {
    return `${installation.address}, ${installation.city}, ${installation.state} ${installation.zip}`
  }

  return (
    <>
      {/* Action Popup - Fixed center overlay */}
      {actionInstallation && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setActionInstallation(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-xs">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{actionInstallation.address}</p>
                  <p className="text-xs text-gray-500">{actionInstallation.city}, {actionInstallation.state}</p>
                </div>
                <button
                  onClick={() => setActionInstallation(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="py-1">
                <button
                  onClick={() => handleViewDetails(actionInstallation)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  View Details
                </button>
                {actionInstallation.status === 'active' && (
                  <button
                    onClick={() => handleScheduleRemoval(actionInstallation)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Schedule Removal
                  </button>
                )}
                {actionInstallation.status !== 'removed' && (
                  <button
                    onClick={() => handleRequestService(actionInstallation)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-gray-400" />
                    Request Service
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {installations.map((installation) => (
          <div
            key={installation.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                  <p className="font-medium text-gray-900 truncate">
                    {installation.address}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {installation.city}, {installation.state} {installation.zip}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(installation.installDate)}</span>
                  {installation.mlsNumber && (
                    <>
                      <span>•</span>
                      <span>MLS: {installation.mlsNumber}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={statusConfig[installation.status].variant}>
                  {statusConfig[installation.status].label}
                </Badge>
                <button
                  onClick={() => setActionInstallation(installation)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {installations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No active installations found.</p>
            <Button variant="primary" className="mt-4">
              Place Your First Order
            </Button>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Install Date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Agent Ref</TableHead>
                <TableHead>MLS #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installations.map((installation) => (
                <TableRow key={installation.id}>
                  <TableCell className="font-medium">
                    {formatDate(installation.installDate)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {installation.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {installation.city}, {installation.state} {installation.zip}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{installation.agentRef || '—'}</TableCell>
                  <TableCell>{installation.mlsNumber || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[installation.status].variant}>
                      {statusConfig[installation.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setActionInstallation(installation)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {installations.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No active installations found.</p>
            <Button variant="primary" className="mt-4">
              Place Your First Order
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <InstallationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        installationId={selectedInstallation?.id || null}
      />

      <ScheduleRemovalModal
        isOpen={showRemovalModal}
        onClose={() => setShowRemovalModal(false)}
        installationId={selectedInstallation?.id || null}
        installationAddress={selectedInstallation ? getFullAddress(selectedInstallation) : ''}
        onSuccess={handleModalSuccess}
      />

      <RequestServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        installationId={selectedInstallation?.id || null}
        installationAddress={selectedInstallation ? getFullAddress(selectedInstallation) : ''}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

export { ActivePostsTable }
export type { Installation }
